class Course < ApplicationRecord
  has_one_attached :photo
  validates :end_date, presence: true
  has_many :videos, dependent: :destroy
  enum :state, { available: 0, unavailable: 1 }

  def total_video_size
    total_bytes = videos.joins(videos_attachments: :blob).sum("active_storage_blobs.byte_size")
    total_gb = total_bytes.to_f / (1024 ** 3)
    total_gb.round(2)
  end
end
