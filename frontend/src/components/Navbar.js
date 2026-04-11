import React from "react";

function Navbar({ setToken }) {
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <div className="navbar">
      <h2>Healthcare Monitor</h2>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Navbar;