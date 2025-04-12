// src/pages/StudentList.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { studentApi } from "../services/api";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
  });

  const fetchStudents = async (page = 1) => {
    try {
      setLoading(true);
      const response = await studentApi.getAll(page, pagination.limit);
      setStudents(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching students:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load students. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (id) => {
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
        await studentApi.delete(id);
        fetchStudents(pagination.currentPage);
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Student has been deleted.",
        });
      }
    } catch (error) {
      console.error("Error deleting student:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete student. Please try again later.",
      });
    }
  };

  const handlePageChange = (page) => {
    fetchStudents(page);
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= pagination.totalPages; i++) {
      pages.push(
        <li
          key={i}
          className={`page-item ${
            pagination.currentPage === i ? "active" : ""
          }`}
        >
          <button className="page-link" onClick={() => handlePageChange(i)}>
            {i}
          </button>
        </li>
      );
    }
    return (
      <nav aria-label="Page navigation">
        <ul className="pagination justify-content-center">
          <li
            className={`page-item ${
              pagination.currentPage === 1 ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
            >
              Previous
            </button>
          </li>
          {pages}
          <li
            className={`page-item ${
              pagination.currentPage === pagination.totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  // src/pages/StudentList.js (continued)
  return (
    <div className="student-list">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Students</h2>
        <Link to="/students/add" className="btn btn-primary">
          Add New Student
        </Link>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {students.length === 0 ? (
            <div className="alert alert-info">No students found.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td>{student.id}</td>
                      <td>{`${student.first_name} ${student.last_name}`}</td>
                      <td>{student.email}</td>
                      <td>{student.phone || "-"}</td>
                      <td>
                        <div className="btn-group" role="group">
                          <Link
                            to={`/students/${student.id}`}
                            className="btn btn-sm btn-info"
                          >
                            View
                          </Link>
                          <Link
                            to={`/students/edit/${student.id}`}
                            className="btn btn-sm btn-warning"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(student.id)}
                            className="btn btn-sm btn-danger"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {pagination.totalPages > 1 && renderPagination()}
        </>
      )}
    </div>
  );
};

export default StudentList;
