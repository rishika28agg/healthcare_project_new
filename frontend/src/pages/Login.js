import React, { useState } from "react";
import axios from "axios";

function Login({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/token/",
        { username, password }
      );

      localStorage.setItem("token", res.data.access);
      setToken(res.data.access);
    } catch {
      alert("Login failed");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Login</h2>

        <input
          className="input"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="input"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn btn-primary" onClick={login}>
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;