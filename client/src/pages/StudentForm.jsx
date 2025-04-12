// src/pages/StudentForm.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { studentApi } from "../services/api";

const StudentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(isEditMode);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode) {
      fetchStudent();
    }
  }, [id]);

  const fetchStudent = async () => {
    try {
      setLoading(true);
      const response = await studentApi.getById(id);
      const student = response.data.data;

      // Format date for input field
      if (student.date_of_birth) {
        const date = new Date(student.date_of_birth);
        student.date_of_birth = date.toISOString().split("T")[0];
      }

      setFormData(student);
    } catch (error) {
      console.error("Error fetching student:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load student data. Please try again later.",
      });
      navigate("/students");
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.first_name.trim())
      newErrors.first_name = "First name is required";
    if (!formData.last_name.trim())
      newErrors.last_name = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when field is updated
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      if (isEditMode) {
        await studentApi.update(id, formData);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Student updated successfully",
        });
      } else {
        await studentApi.create(formData);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Student created successfully",
        });
      }
      navigate("/students");
    } catch (error) {
      console.error("Error saving student:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "Failed to save student. Please try again later.",
      });
    }
  };

  return (
    <div className="student-form">
      <h2>{isEditMode ? "Edit Student" : "Add New Student"}</h2>

      {loading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="first_name" className="form-label">
                First Name *
              </label>
              <input
                type="text"
                className={`form-control ${
                  errors.first_name ? "is-invalid" : ""
                }`}
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
              />
              {errors.first_name && (
                <div className="invalid-feedback">{errors.first_name}</div>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="last_name" className="form-label">
                Last Name *
              </label>
              <input
                type="text"
                className={`form-control ${
                  errors.last_name ? "is-invalid" : ""
                }`}
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
              />
              {errors.last_name && (
                <div className="invalid-feedback">{errors.last_name}</div>
              )}
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email *
            </label>
            <input
              type="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="phone" className="form-label">
                Phone
              </label>
              <input
                type="tel"
                className="form-control"
                id="phone"
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="date_of_birth" className="form-label">
                Date of Birth
              </label>
              <input
                type="date"
                className="form-control"
                id="date_of_birth"
                name="date_of_birth"
                value={formData.date_of_birth || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mt-4">
            <button type="submit" className="btn btn-primary me-2">
              {isEditMode ? "Update Student" : "Add Student"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/students")}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default StudentForm;
