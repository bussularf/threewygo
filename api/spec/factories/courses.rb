FactoryBot.define do
  factory :course do
    title { "Sample Course" }
    description { "A course description" }
    end_date { 1.week.from_now }
    state { :available }
  end
end
