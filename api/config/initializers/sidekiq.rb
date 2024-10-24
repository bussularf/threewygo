require "sidekiq"
require "sidekiq-cron"

Sidekiq.configure_server do |config|
  config.on(:startup) do
    Sidekiq::Cron::Job.load_from_hash(
      "remove_expired_courses" => {
        cron: "*/5 * * * *",
        class: "RemoveExpiredCoursesJob"
      }
    )
  end
end
