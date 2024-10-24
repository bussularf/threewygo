class UploadNotificationChannel < ApplicationCable::Channel
  def subscribed
    stream_from "upload_notification_channel"
  end

  def unsubscribed
  end
end
