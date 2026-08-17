import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/axios";
import "./IssueList.css"
const IssueList = () => {
  const { repoId } = useParams(); // URL se repoId milegi
  const [issues, setIssues] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. Fetch all issues for current repository
  const fetchIssues = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/issue/all/${repoId}`);
      setIssues(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching issues:", err);
      setIssues([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (repoId) {
      fetchIssues();
    }
  }, [repoId]);

  // 2. Create New Issue
  const handleCreateIssue = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    try {
      const response = await API.post(`/issue/create/${repoId}`, {
        title,
        description,
      });

      setIssues((prev) => [response.data, ...prev]);
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error("Error creating issue:", err);
      alert("Issue create karne me error aaya.");
    }
  };

  // 3. Toggle Status (Open <-> Close)
  const handleToggleStatus = async (issue) => {
    const newStatus = issue.status === "open" ? "close" : "open";
    try {
      const response = await API.put(`/issue/update/${issue._id}`, {
        title: issue.title,
        description: issue.description,
        status: newStatus,
      });

      setIssues((prev) =>
        prev.map((item) => (item._id === issue._id ? response.data.issue : item))
      );
    } catch (err) {
      console.error("Error updating issue status:", err);
    }
  };

  // 4. Delete Issue
  const handleDeleteIssue = async (issueId) => {
    if (!window.confirm("Are you sure you want to delete this issue?")) return;

    try {
      await API.delete(`/issue/delete/${issueId}`);
      setIssues((prev) => prev.filter((item) => item._id !== issueId));
    } catch (err) {
      console.error("Error deleting issue:", err);
      alert("Issue delete karne me error aaya.");
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "30px auto", padding: "20px" }}>
      <h2>Repository Issues</h2>

      {/* Create Issue Form */}
      <form
        onSubmit={handleCreateIssue}
        style={{
          border: "1px solid #ddd",
          padding: "15px",
          borderRadius: "6px",
          marginBottom: "30px",
        }}
      >
        <h3>Create a New Issue</h3>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Issue Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <textarea
            placeholder="Leave a comment / description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={3}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>
        <button
          type="submit"
          style={{
            backgroundColor: "#2ea44f",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Submit new issue
        </button>
      </form>

      <hr />

      {/* Issues List */}
      <h3>All Issues ({issues.length})</h3>
      {loading ? (
        <p>Loading issues...</p>
      ) : issues.length === 0 ? (
        <p>No issues found for this repository.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {issues.map((issue) => (
            <div
              key={issue._id}
              style={{
                border: "1px solid #e1e4e8",
                borderRadius: "6px",
                padding: "15px",
                backgroundColor: issue.status === "open" ? "#ffffff" : "#f6f8fa",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h4 style={{ margin: "0 0 5px 0" }}>{issue.title}</h4>
                  <span
                    style={{
                      fontSize: "12px",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      color: "white",
                      backgroundColor: issue.status === "open" ? "#28a745" : "#6c757d",
                    }}
                  >
                    {issue.status.toUpperCase()}
                  </span>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => handleToggleStatus(issue)}
                    style={{
                      padding: "4px 10px",
                      cursor: "pointer",
                      borderRadius: "4px",
                    }}
                  >
                    Mark as {issue.status === "open" ? "Closed" : "Open"}
                  </button>

                  <button
                    onClick={() => handleDeleteIssue(issue._id)}
                    style={{
                      backgroundColor: "#cb2431",
                      color: "white",
                      border: "none",
                      padding: "4px 10px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <p style={{ marginTop: "10px", color: "#586069" }}>{issue.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IssueList;