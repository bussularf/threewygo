class Api::V1::CoursesController < ApplicationController
  def index
    @courses = Course.all
    render json: @courses
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

            uploaded_videos.each do |video|
              @course.videos.create!(videos: video)
            end
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
      videos: videos
    }
  end

  def edit; end

  def update
    @course = Course.find(params[:id])

    if @course.update(course_params)
      if params[:course][:videos].present?
        uploaded_videos = params[:course][:videos].is_a?(Array) ? params[:course][:videos] : [ params[:course][:videos] ]

        uploaded_videos.each do |video|
          @course.videos.create!(videos: video)
        end
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


  private

  def course_params
    params.require(:course).permit(:title, :description, :state, :end_date, :videos, :remove_video_ids)
  end
end
