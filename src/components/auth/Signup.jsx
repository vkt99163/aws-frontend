// import React, { useState, useEffect } from "react";
// // import axios from "axios";
// import API from "../../api/axios.js";
// import { useAuth } from "../../authContext";

// import { PageHeader,  Button } from "@primer/react";
// import "./auth.css";

// import logo from "../../assets/github-mark-white.svg";
// import { Link } from "react-router-dom";

// const Signup = () => {
//   const [email, setEmail] = useState("");
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const { setCurrentUser } = useAuth();

//   const handleSignup = async (e) => {
//     e.preventDefault();

//     try {
//       setLoading(true);
//       const res = await API.post("http://localhost:3000/signup", {
//         email: email,
//         password: password,
//         username: username,
//       });

//       localStorage.setItem("token", res.data.token);
//       localStorage.setItem("userId", res.data.userId);

//       setCurrentUser(res.data.userId);
//       setLoading(false);

//       window.location.href = "/";
//     } catch (err) {
//       console.error(err);
//       alert("Signup Failed!");
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-wrapper">
//       <div className="login-logo-container">
//         <img className="logo-login" src={logo} alt="Logo" />
//       </div>

//       <div className="login-box-wrapper">
//         <div className="login-heading">
//           <div sx={{ padding: 1 }}>
//             <PageHeader>
//               <PageHeader.TitleArea variant="large">
//                 <PageHeader.Title>Sign Up</PageHeader.Title>
//               </PageHeader.TitleArea>
//             </PageHeader>
//           </div>
//         </div>

//         <div className="login-box">
//           <div>
//             <label className="label">Username</label>
//             <input
//               autoComplete="off"
//               name="Username"
//               id="Username"
//               className="input"
//               type="text"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//             />
//           </div>

//           <div>
//             <label className="label">Email address</label>
//             <input
//               autoComplete="off"
//               name="Email"
//               id="Email"
//               className="input"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>

//           <div className="div">
//             <label className="label">Password</label>
//             <input
//               autoComplete="off"
//               name="Password"
//               id="Password"
//               className="input"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>

//           <Button
//             variant="primary"
//             className="login-btn"
//             disabled={loading}
//             onClick={handleSignup}
//           >
//             {loading ? "Loading..." : "Signup"}
//           </Button>
//         </div>

//         <div className="pass-box">
//           <p>
//             Already have an account? <Link to="/auth">Login</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;






import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import "./auth.css";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/signup", { username, email, password });
      // Signup success ke baad direct login page ya auto-login
      navigate("/auth");
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="auth-wrapper">
      {/* GitHub Logo */}
      <div className="auth-logo-container">
        <img
          src="https://www.github.com/images/modules/logos_page/GitHub-Mark.png"
          alt="GitHub Logo"
          className="auth-logo"
        />
        <h1 className="auth-title">Sign up to GitHub</h1>
      </div>

      {/* Error Banner */}
      {error && <div className="auth-error-box">{error}</div>}

      {/* Main Signup Form Card */}
      <div className="auth-card">
        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              required
              className="auth-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              required
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-auth-submit">
            Sign up
          </button>
        </form>
      </div>

      {/* Sign In Footer Box */}
      <div className="auth-footer-box">
        <p>
          Already have an account? <Link to="/auth">Sign in</Link>.
        </p>
      </div>
    </div>
  );
};

export default Signup;