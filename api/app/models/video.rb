class Video < ApplicationRecord
  belongs_to :course
  has_many_attached :videos
end
