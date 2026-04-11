import React, { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import "./App.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  return !token ? (
    <Login setToken={setToken} />
  ) : (
    <Dashboard setToken={setToken} />
  );
}

export default App;