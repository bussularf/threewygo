require 'rails_helper'

RSpec.describe Course, type: :model do
  describe '#total_video_size' do
    let(:course) { Course.create!(title: 'Sample Course', description: 'A course description', end_date: Date.current, state: :available) }
    let(:video) { course.videos.create! }

    before do
      video.videos.attach(io: StringIO.new('a' * 1_073_741_824), filename: 'test_video.mp4', content_type: 'video/mp4')
    end

    it 'calculates the total video size in GB' do
      expect(course.total_video_size).to eq(1.0)
    end
  end
end
