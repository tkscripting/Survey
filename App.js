import { useState } from "react";

export default function SurveyApp() {
  const [formData, setFormData] = useState({ name: "", favoriteColor: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Survey:", formData);
    setSubmitted(true);
    // In a real app, you'd save this to Firebase or another backend
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Basic Survey</h1>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">What is your name?</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Favorite Color?</label>
              <select
                name="favoriteColor"
                value={formData.favoriteColor}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
              >
                <option value="">Select one</option>
                <option value="Red">Red</option>
                <option value="Blue">Blue</option>
                <option value="Green">Green</option>
                <option value="Yellow">Yellow</option>
              </select>
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Submit
            </button>
          </form>
        ) : (
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Thank you, {formData.name}!</h2>
            <p>You selected: <strong>{formData.favoriteColor}</strong></p>
          </div>
        )}
      </div>
    </div>
  );
}
