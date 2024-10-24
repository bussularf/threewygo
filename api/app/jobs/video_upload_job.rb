class VideoUploadJob < ApplicationJob
  queue_as :default

  def perform(course_id, video_blob_ids)
    course = Course.find(course_id)

    video_blob_ids.each do |blob_id|
      video = course.videos.new
      video.videos.attach(blob_id)
      video.save!
    end

    ActionCable.server.broadcast("upload_notification_channel", { message: "Upload de vídeos concluído para o curso: #{course.title}" })

  rescue ActiveRecord::RecordNotFound => e
    Rails.logger.error("Course not found: #{e.message}")
  rescue => e
    Rails.logger.error("Failed to upload video: #{e.message}")
  end
end
