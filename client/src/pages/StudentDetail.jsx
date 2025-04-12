// src/pages/StudentDetail.js
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { studentApi, markApi, subjectApi } from "../services/api";

const StudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMarkForm, setShowMarkForm] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [markFormData, setMarkFormData] = useState({
    student_id: id,
    subject_id: "",
    score: "",
    exam_date: "",
  });

  useEffect(() => {
    fetchStudentData();
    fetchSubjects();
  }, [id]);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const response = await studentApi.getById(id);
      setStudent(response.data.data);
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

  const fetchSubjects = async () => {
    try {
      const response = await subjectApi.getAll();
      setSubjects(response.data.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const handleMarkFormChange = (e) => {
    const { name, value } = e.target;
    setMarkFormData({
      ...markFormData,
      [name]: value,
    });
  };

  const handleMarkFormSubmit = async (e) => {
    e.preventDefault();

    try {
      await markApi.create(markFormData);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Mark added successfully",
      });

      // Reset form and refresh student data
      setMarkFormData({
        student_id: id,
        subject_id: "",
        score: "",
        exam_date: "",
      });
      setShowMarkForm(false);
      fetchStudentData();
    } catch (error) {
      console.error("Error adding mark:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "Failed to add mark. Please try again later.",
      });
    }
  };

  const handleDeleteMark = async (markId) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await markApi.delete(markId);
        fetchStudentData();
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Mark has been deleted.",
        });
      }
    } catch (error) {
      console.error("Error deleting mark:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete mark. Please try again later.",
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!student) {
    return <div className="alert alert-warning">Student not found</div>;
  }

  return (
    <div className="student-detail">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Student Details</h2>
        <div>
          <Link to={`/students/edit/${id}`} className="btn btn-warning me-2">
            Edit Student
          </Link>
          <Link to="/students" className="btn btn-secondary">
            Back to List
          </Link>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Personal Information</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <p>
                <strong>Name:</strong>{" "}
                {`${student.first_name} ${student.last_name}`}
              </p>
              <p>
                <strong>Email:</strong> {student.email}
              </p>
            </div>
            <div className="col-md-6">
              <p>
                <strong>Phone:</strong> {student.phone || "-"}
              </p>
              <p>
                <strong>Date of Birth:</strong>{" "}
                {formatDate(student.date_of_birth)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Marks</h5>
          <button
            className="btn btn-sm btn-light"
            onClick={() => setShowMarkForm(!showMarkForm)}
          >
            {showMarkForm ? "Cancel" : "Add Mark"}
          </button>
        </div>
        <div className="card-body">
          {showMarkForm && (
            <form
              onSubmit={handleMarkFormSubmit}
              className="mb-4 p-3 border rounded bg-light"
            >
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label htmlFor="subject_id" className="form-label">
                    Subject *
                  </label>
                  <select
                    className="form-select"
                    id="subject_id"
                    name="subject_id"
                    value={markFormData.subject_id}
                    onChange={handleMarkFormChange}
                    required
                  >
                    <option value="">Select Subject</option>
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name} ({subject.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-4 mb-3">
                  <label htmlFor="score" className="form-label">
                    Score *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    className="form-control"
                    id="score"
                    name="score"
                    value={markFormData.score}
                    onChange={handleMarkFormChange}
                    required
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label htmlFor="exam_date" className="form-label">
                    Exam Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="exam_date"
                    name="exam_date"
                    value={markFormData.exam_date}
                    onChange={handleMarkFormChange}
                  />
                </div>
              </div>

              <div className="text-end">
                <button type="submit" className="btn btn-primary">
                  Add Mark
                </button>
              </div>
            </form>
          )}

          {student.marks && student.marks.length === 0 ? (
            <div className="alert alert-info">
              No marks available for this student.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead className="table-dark">
                  <tr>
                    <th>Subject</th>
                    <th>Score</th>
                    <th>Exam Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {student.marks &&
                    student.marks.map((mark) => (
                      <tr key={mark.id}>
                        <td>
                          {mark.subject_name} ({mark.subject_code})
                        </td>
                        <td>{mark.score}</td>
                        <td>{formatDate(mark.exam_date)}</td>
                        <td>
                          <button
                            onClick={() => handleDeleteMark(mark.id)}
                            className="btn btn-sm btn-danger"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDetail;
