import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./Dashboard.css";
import Navbar from '../Navbar';
import API from "../../api/axios.js";

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchRepositories = async () => {
      try {
        if (!userId) return;
        const response = await API.get(`/repo/user/${userId}`);
        const repoData = response.data.repositories || [];
        setRepositories(repoData);
        setSearchResults(repoData);
      } catch (err) {
        console.error("Error while fetching repositories: ", err);
        setRepositories([]);
      }
    };

    

    const fetchSuggestedRepositories = async () => {
      try {
        const response = await API.get("/repo/all");
        setSuggestedRepositories(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Error during fetching suggested repos: ", err);
        setSuggestedRepositories([]);
      }
    };

    fetchRepositories();
    fetchSuggestedRepositories();
  }, []);

  // Search Filter Handler
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(repositories);
    } else {
      const filteredRepo = repositories.filter((repo) =>
        repo?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredRepo);
    }
  }, [searchQuery, repositories]);

  // Delete Repo Handler
  const handleDelete = async (repoId) => {
    const confirmDelete = window.confirm("DO YOU CONFIRM DELETE THIS REPOSITORY?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/repo/delete/${repoId}`);
      
      // UI update bina page reload kiye
      setRepositories((prev) => prev.filter((repo) => repo._id !== repoId));
      setSearchResults((prev) => prev.filter((repo) => repo._id !== repoId));
    } catch (err) {
      console.error("Error deleting repository:", err);
      alert("Repository delete nahi ho payi.");
    }
  };

  return (
    <>
      <Navbar />
      <section id="dashboard">
        {/* Left Sidebar: Suggested Repositories */}
        <aside>
          <h3>Suggested Repositories</h3>
          {suggestedRepositories?.length > 0 ? (
            suggestedRepositories.map((repo) => (
              <div key={repo._id} className="repo-card">
                <h4>
                  <Link to={`/repo/${repo._id}`}>{repo.name}</Link>
                </h4>
                <p>{repo.description || "No description"}</p>
              </div>
            ))
          ) : (
            <p>No suggested repositories</p>
          )}
        </aside>

        {/* Main Section: Your Repositories & Delete Action */}
        <main>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Your Repositories</h2>
            <Link to="/repo/create">
              {/* <button style={{ padding: '6px 12px', cursor: 'pointer' }}>+ New</button> */}
            </Link>
          </div>

          <div id="search">
            <input
              type="text"
              value={searchQuery}
              placeholder="Search..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

        {/* Main Section ke andar searchResults.map me */}
<div className="repo-list">
  {searchResults?.length > 0 ? (
    searchResults.map((repo) => (
      <div 
        key={repo._id} 
        className="repo-item" 
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
      >
        {/* Repo Info */}
        <div>
          <h4>
            <Link to={`/repo/${repo._id}`}>{repo.name}</Link>
            <span style={{ fontSize: "12px", marginLeft: "10px", color: "gray" }}>
              ({repo.visibility ? "Public" : "Private"})
            </span>
          </h4>
          <p>{repo.description}</p>
        </div>

        {/* Action Buttons (Issues + Delete) */}
        <div style={{ display: 'flex', gap: '8px' }}>
          
          {/* 👉 YAHAN LAGEGA ISSUES BUTTON 👈 */}
          <Link to={`/repo/${repo._id}/issues`}>
            <button
              style={{
                backgroundColor: '#0366d6',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Issues
            </button>
          </Link>

          {/* Delete Button */}
          <button
            onClick={() => handleDelete(repo._id)}
            style={{
              backgroundColor: '#ff4d4f',
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Delete
          </button>

        </div>
      </div>
    ))
  ) : (
    <p>No repositories found</p>
  )}
</div>

          
        </main>

        {/* Right Sidebar */}
        <aside>
          <h3>Upcoming Events</h3>
          <ul>
            <li><p>Tech Conference Event Dec-15</p></li>
            <li><p>Tech Hackathon Dec-24</p></li>
            <li><p>Global Summit Event Jan-15</p></li>
          </ul>
        </aside>
      </section>
    </>
  );
};

export default Dashboard;







