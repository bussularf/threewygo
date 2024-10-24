require "rails_helper"

RSpec.describe "Courses", type: :request do
  let!(:course) { Course.create!(title: "Sample Course", description: "A course description", end_date: 1.week.from_now) }

  describe "GET /api/v1/courses" do
    it "returns a list of available courses" do
      get api_v1_courses_path
      expect(response).to have_http_status(:success)
      expect(JSON.parse(response.body).size).to eq(1)
    end
  end

  describe "POST /courses" do
    context "with valid parameters" do
      let(:valid_attributes) do
        { course: { title: "New Course", description: "New course description", end_date: 1.week.from_now } }
      end

      it "creates a new course" do
        expect {
          post "/api/v1/courses", params: valid_attributes
        }.to change(Course, :count).by(1)
      end

      it "returns a success message" do
        post "/api/v1/courses", params: valid_attributes
        expect(response).to have_http_status(:created)
        expect(JSON.parse(response.body)["message"]).to eq("Curso criado com sucesso")
      end
    end

    context "with invalid parameters" do
      let(:invalid_attributes) do
        { course: { title: "", description: "", end_date: nil } }
      end

      it "does not create a new course" do
        expect {
          post "/api/v1/courses", params: invalid_attributes
        }.not_to change(Course, :count)
      end

      it "returns an error message" do
        post "/api/v1/courses", params: invalid_attributes
        expect(response).to have_http_status(:unprocessable_entity)
        expect(JSON.parse(response.body)["error"]).to include("A data de término não pode estar em branco.")
      end
    end
  end

  describe "GET /courses/:id" do
    it "returns the course details" do
      get "/api/v1/courses/#{course.id}"
      expect(response).to have_http_status(:success)
      expect(JSON.parse(response.body)["course"]["id"]).to eq(course.id)
    end
  end

  describe "PUT /courses/:id" do
    context "with valid parameters" do
      let(:new_attributes) { { course: { title: "Updated Title" } } }

      it "updates the course" do
        put "/api/v1/courses/#{course.id}", params: new_attributes
        expect(course.reload.title).to eq("Updated Title")
      end

      it "returns a success message" do
        put "/api/v1/courses/#{course.id}", params: new_attributes
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)["message"]).to eq("Curso atualizado com sucesso")
      end
    end
  end

  describe "DELETE /courses/:id" do
    it "deletes the course" do
      expect {
        delete "/api/v1/courses/#{course.id}"
      }.to change(Course, :count).by(-1)
    end
  end
end
