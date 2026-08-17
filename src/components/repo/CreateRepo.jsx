import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

const CreateRepo = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(true); // true = Public, false = Private
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");

    const owner = localStorage.getItem("userId");
    if (!owner) {
      setError("User not logged in");
      return;
    }

    try {
      await API.post("/repo/create", {
        name,
        description,
        visibility,
        owner,
        content: [],
        issues: [],
      });
      navigate("/Dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Repository creation failed");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "40px auto", padding: "20px" }}>
      <h2>Create a New Repository</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleCreate}>
        <div style={{ marginBottom: "15px" }}>
          <label>Repository Name *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>
            <input
              type="checkbox"
              checked={visibility}
              onChange={(e) => setVisibility(e.target.checked)}
            />
            {" "}Public Repository
          </label>
        </div>

      <button type="submit" style={{ padding: "10px 20px", cursor: "pointer" }}>
          Create Repository
        </button>
      </form>
    </div>
  );
};

export default CreateRepo;