import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/axios";

const RepoDetail = () => {
  const { id } = useParams();
  const [repo, setRepo] = useState(null);
  const [newContent, setNewContent] = useState("");
  const [description, setDescription] = useState("");

  const fetchRepo = async () => {
    try {
      const res = await API.get(`/repo/${id}`);
      // Backend find() returns array
      const data = Array.isArray(res.data) ? res.data[0] : res.data;
      setRepo(data);
      setDescription(data?.description || "");
    } catch (err) {
      console.error("Error fetching repository:", err);
    }
  };

  useEffect(() => {
    fetchRepo();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put(`/repo/update/${id}`, {
        content: newContent,
        description: description,
      });
      setRepo(res.data.repository);
      setNewContent("");
      alert("Repository Updated!");
    } catch (err) {
      alert("Update failed");
    }
  };

  if (!repo) return <p>Loading repository details...</p>;

  return (
    <div style={{ padding: "30px", maxWidth: "800px", margin: "auto" }}>
      <h2>{repo.name}</h2>
      <p><strong>Owner:</strong> {repo.owner?.username || "User"}</p>
      <p><strong>Status:</strong> {repo.visibility ? "Public" : "Private"}</p>
      
      <h4>Files / Content:</h4>
      <ul>
        {repo.content?.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <hr />

      <h3>Update / Push Content</h3>
      <form onSubmit={handleUpdate}>
        <div style={{ marginBottom: "10px" }}>
          <label>Update Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Add File/Commit Name:</label>
          <input
            type="text"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="e.g. index.js"
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default RepoDetail;