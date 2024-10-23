class Course < ApplicationRecord
  has_many :videos, dependent: :destroy
  enum :state, { available: 0, unavailable: 1 }
end
