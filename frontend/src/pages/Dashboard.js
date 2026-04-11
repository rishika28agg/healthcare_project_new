import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import PatientSelector from "../components/PatientSelector";
import VitalCard from "../components/VitalCard";

function Dashboard({ setToken }) {
  const [patientId, setPatientId] = useState(1);
  const [records, setRecords] = useState([]);
  const [integrity, setIntegrity] = useState(null);

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/patient/${patientId}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRecords(res.data);
    } catch {
      alert("Access denied");
    }
  };

  const verify = async () => {
    const res = await axios.get(
      `http://127.0.0.1:8000/api/verify/${patientId}/`
    );
    setIntegrity(res.data.integrity);
  };

  return (
    <>
      <Navbar setToken={setToken} />

      <div className="container">
        <h2>Dashboard</h2>

        <PatientSelector
          patientId={patientId}
          setPatientId={setPatientId}
        />

        <div className="card">
          <button className="btn btn-primary" onClick={fetchData}>
            Load Data
          </button>{" "}
          <button className="btn btn-secondary" onClick={verify}>
            Verify Integrity
          </button>
        </div>

        {integrity !== null && (
          <div className="card">
            <h3>Integrity Status</h3>
            <div className="status">
              {integrity ? (
                <span className="verified">✔ Verified</span>
              ) : (
                <span className="tampered">✖ Tampered</span>
              )}
            </div>
          </div>
        )}

        <div className="card">
          <h3>Patient Vitals</h3>

          <VitalCard records={records} />
        </div>
      </div>
    </>
  );
}

export default Dashboard;