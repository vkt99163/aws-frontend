// import React, { useState, useEffect } from "react";
// // import axios from "axios";
// import API from "../../api/axios.js";
// import { useAuth } from "../../authContext";

// import { PageHeader,  Button } from "@primer/react";
// import "./auth.css";

// import logo from "../../assets/github-mark-white.svg";
// import { Link } from "react-router-dom";

// const Login = () => {

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const { setCurrentUser } = useAuth();

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {
//       setLoading(true);
//       const res = await API.post("http://localhost:3000/login", {
//         email: email,
//         password: password,
//       });

//       localStorage.setItem("token", res.data.token);
//       localStorage.setItem("userId", res.data.userId);

//       setCurrentUser(res.data.userId);
//       setLoading(false);

//       window.location.href = "/";
//     } catch (err) {
//       console.error(err);
//       alert("Login Failed!");
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
//                 <PageHeader.Title>Sign In</PageHeader.Title>
//               </PageHeader.TitleArea>
//             </PageHeader>
//           </div>
//         </div>
//         <div className="login-box">
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
//             onClick={handleLogin}
//           >
//             {loading ? "Loading..." : "Login"}
//           </Button>
//         </div>
//         <div className="pass-box">
//           <p>
//             New to GitHub? <Link to="/signup">Create an account</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;


import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import "./auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="auth-wrapper">
      {/* GitHub Logo */}
      <div className="auth-logo-container">
        <img
          src="https://www.github.com/images/modules/logos_page/GitHub-Mark.png"
          alt="GitHub"
          className="auth-logo"
        />
        <h1 className="auth-title">Sign in to GitHub</h1>
      </div>

      {/* Error Message */}
      {error && <div className="auth-error-box">{error}</div>}

      {/* Main Login Card */}
      <div className="auth-card">
        <form onSubmit={handleLogin}>
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
            <div className="label-row">
              <label htmlFor="password">Password</label>
            </div>
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
            Sign in
          </button>
        </form>
      </div>

      {/* Sign Up Redirect Box */}
      <div className="auth-footer-box">
        <p>
          New to GitHub? <Link to="/signup">Create an account</Link>.
        </p>
      </div>
    </div>
  );
};

export default Login;