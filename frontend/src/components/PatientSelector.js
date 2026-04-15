import React from "react";

function PatientSelector({ patientId, setPatientId }) {
  const handleChange = (e) => {
    const value = e.target.value;

    setPatientId(
      value === "" ? "" : Number(value)
    );
  };

  return (
    <div className="patient-selector">
      <div className="patient-selector-header">
        <span className="selector-dot"></span>
        <label htmlFor="patientIdInput">
          Select Patient
        </label>
      </div>

      <div className="patient-field">
        <span className="patient-id-badge">ID</span>

        <input
          id="patientIdInput"
          type="number"
          min="1"
          step="1"
          value={patientId}
          onChange={handleChange}
          placeholder="Enter ID"
          className="patient-selector-input"
        />
      </div>
    </div>
  );
}

export default PatientSelector;