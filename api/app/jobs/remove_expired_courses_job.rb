class RemoveExpiredCoursesJob < ApplicationJob
  queue_as :default

  def perform
    Course.where("end_date < ?", Date.current).find_each do |course|
      course.update(state: :unavailable)
    end
  end
end
