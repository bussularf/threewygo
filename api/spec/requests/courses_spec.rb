require 'rails_helper'

RSpec.describe "Courses", type: :request do
  let!(:course) { create(:course, state: :available) }

  describe "GET /api/v1/courses" do
    it "returns a list of available courses" do
      get api_v1_courses_path
      expect(response).to have_http_status(:success)
      expect(JSON.parse(response.body).size).to eq(1)
      expect(JSON.parse(response.body).first["title"]).to eq(course.title)
    end
  end

  describe "POST /api/v1/courses" do
    it "creates a new course" do
      course_params = {
        course: {
          title: "New Course",
          description: "Course description",
          state: :available,
          end_date: Time.current + 1.day
        }
      }

      expect {
        post api_v1_courses_path, params: course_params
      }.to change(Course, :count).by(1)

      expect(response).to have_http_status(:created)
      expect(JSON.parse(response.body)["message"]).to eq("Curso criado com sucesso")
      expect(Course.last.title).to eq("New Course")
    end

    it "does not create a course without an end_date" do
      course_params = {
        course: {
          title: "New Course",
          description: "Course description",
          state: :available,
          end_date: nil
        }
      }

      post api_v1_courses_path, params: course_params

      expect(response).to have_http_status(:unprocessable_entity)
      expect(JSON.parse(response.body)["error"]).to eq("A data de término não pode estar em branco.")
    end
  end

  describe "PATCH /api/v1/courses/:id" do
    it "updates an existing course" do
      updated_params = {
        course: {
          title: "Updated Course",
          description: "Updated description",
          end_date: Time.current + 2.days
        }
      }

      patch api_v1_course_path(course), params: updated_params

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)["message"]).to eq("Curso atualizado com sucesso")
      expect(course.reload.title).to eq("Updated Course")
    end

    it "does not update a course with an invalid end_date" do
      updated_params = {
        course: {
          end_date: nil
        }
      }

      patch api_v1_course_path(course), params: updated_params

      expect(response).to have_http_status(:unprocessable_entity)
      expect(JSON.parse(response.body)["errors"]).to include("End date can't be blank")
    end
  end

  describe "DELETE /api/v1/courses/:id" do
    it "destroys the course" do
      expect {
        delete api_v1_course_path(course)
      }.to change(Course, :count).by(-1)

      expect(response).to have_http_status(:no_content)
    end
  end
end
