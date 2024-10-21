class CreateCourses < ActiveRecord::Migration[7.2]
  def change
    create_table :courses do |t|
      t.string :title
      t.text :description
      t.integer :state
      t.date :end_date

      t.timestamps
    end
  end
end
