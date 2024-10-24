class Api::V1::CoursesController < ApplicationController
  require "csv"
  def index
    @courses = Course.where(state: :available)
    courses_with_photos = @courses.map do |course|
      course.as_json.merge(photo_url: course.photo.attached? ? url_for(course.photo) : nil)
    end
    render json: courses_with_photos
  end

  def new
    @course = Course.new
    render json: @course
  end

  def create
    @course = Course.new(course_params)

    if @course.end_date.nil?
      render json: { error: "A data de término não pode estar em branco." }, status: :unprocessable_entity
    elsif @course.end_date < Time.current
      render json: { error: "A data de término deve ser uma data futura." }, status: :unprocessable_entity
    else
      @course.state = :available
      begin
        if @course.save!
          if params[:course][:videos].present?
            uploaded_videos = params[:course][:videos].is_a?(Array) ? params[:course][:videos] : [ params[:course][:videos] ]

            video_blobs = uploaded_videos.map do |video|
              ActiveStorage::Blob.create_and_upload!(
                io: video.tempfile,
                filename: video.original_filename,
                content_type: video.content_type
              ).signed_id
            end

            VideoUploadJob.perform_later(@course.id, video_blobs)
          end
          render json: { message: "Curso criado com sucesso", course: @course }, status: :created
        else
          render json: { error: @course.errors.full_messages }, status: :unprocessable_entity
        end
      end
    end
  end

  def show
    @course = Course.find(params[:id])

    videos = @course.videos.map do |video|
      {
        id: video.id,
        urls: video.videos.map { |video_file| url_for(video_file) }
      }
    end

    render json: {
      course: @course,
      videos: videos,
      total_video_size: @course.total_video_size
    }
  end

  def edit; end

  def update
    @course = Course.find(params[:id])

    if @course.update(course_params)
      if params[:course][:videos].present?
        uploaded_videos = params[:course][:videos].is_a?(Array) ? params[:course][:videos] : [ params[:course][:videos] ]

        video_blobs = uploaded_videos.map do |video|
          ActiveStorage::Blob.create_and_upload!(
            io: video.tempfile,
            filename: video.original_filename,
            content_type: video.content_type
          ).signed_id
        end

        VideoUploadJob.perform_later(@course.id, video_blobs)
      end

      if params[:course][:remove_video_ids].present?
        video_ids_to_remove = params[:course][:remove_video_ids].is_a?(Array) ? params[:course][:remove_video_ids] : [ params[:course][:remove_video_ids] ]

        video_ids_to_remove.each do |video_id|
          video_to_remove = @course.videos.find_by(id: video_id)

          if video_to_remove
            video_to_remove.destroy
          end
        end
      end

      render json: { message: "Curso atualizado com sucesso", course: @course }, status: :ok
    else
      render json: { errors: @course.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @course = Course.find(params[:id])
    @course.destroy
  end

  def report
    end_date = params[:end_date].presence

    if end_date
      parsed_end_date = end_date.to_date
      courses = Course.where("end_date >= ?", parsed_end_date) if parsed_end_date
    else
      courses = Course.all
    end

    render json: {
      courses: courses
    }
  end

  def report_csv
    courses = Course.all

    csv_data = CSV.generate(headers: true) do |csv|
      csv << [ "ID", "Título", "Descrição", "Data de Término" ]
      courses.each do |course|
        csv << [ course.id, course.title, course.description, course.end_date ]
      end
    end

    send_data csv_data, filename: "cursos_relatorio.csv", type: "text/csv", disposition: "attachment"
  end

  private

  def course_params
    params.require(:course).permit(:title, :description, :state, :end_date, :photo, :total_video_size, :remove_video_ids)
  end
end
