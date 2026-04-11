import React from "react";

function PatientSelector({ patientId, setPatientId }) {
  return (
    <div className="card">
      <h3>Select Patient</h3>
      <input
        className="input"
        type="number"
        placeholder="Enter Patient ID"
        value={patientId}
        onChange={(e) => setPatientId(e.target.value)}
      />
    </div>
  );
}

export default PatientSelector;