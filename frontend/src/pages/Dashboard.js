import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import PatientSelector from "../components/PatientSelector";
import Card from "../components/Card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const API_BASE = "http://127.0.0.1:8000/api";

export default function Dashboard({ setToken }) {
  const [patientId, setPatientId] = useState(1);
  const [vitals, setVitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [authError, setAuthError] = useState("");
  const [verification, setVerification] = useState(null);

  /* UPDATED: fetch when patient changes */
  useEffect(() => {
    if (patientId !== "" && patientId !== null) {
      fetchVitals();
    }
  }, [patientId]);

  const fetchVitals = async () => {
    setLoading(true);
    setError("");
    setAuthError("");
    setVerification(null);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_BASE}/patient/${patientId}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setVitals(response.data || []);
    } catch (err) {
      setVitals([]);

      const status = err.response?.status;

      if (status === 401 || status === 403) {
        setAuthError("Unauthorized access to this patient record.");
      } else {
        setError(
          err.response?.data?.error || "Failed to load vitals."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyLatestRecord = async () => {
    if (vitals.length === 0) {
      setError("No vitals available for verification.");
      return;
    }

    try {
      const latest = vitals[vitals.length - 1];
      const response = await axios.get(
        `${API_BASE}/verify/${latest.id}/`
      );
      setVerification(response.data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Failed to verify latest record."
      );
    }
  };

  const exportCSV = () => {
    if (vitals.length === 0) {
      setError("No vitals data to export.");
      return;
    }

    const headers = [
      "Date & Time",
      "Heart Rate (BPM)",
      "O2 Level (%)",
      "Temperature (F)",
    ];

    const rows = vitals.map((v) => [
      new Date(v.timestamp).toLocaleString(),
      v.heart_rate,
      v.spo2,
      Number(v.body_temperature).toFixed(2),
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `vitals_${
      new Date().toISOString().split("T")[0]
    }.csv`;

    a.click();
    window.URL.revokeObjectURL(url);
  };

  const printReport = () => {
    const latest = vitals[vitals.length - 1];

    const printWindow = window.open("", "_blank");

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Health Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #0d9488; }
            .stat { display: inline-block; margin: 12px 20px 12px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ccc; padding: 10px; text-align: left; }
            th { background-color: #0d9488; color: white; }
          </style>
        </head>
        <body>
          <h1>Healthcare Monitoring Report</h1>
          <p>Generated: ${new Date().toLocaleString()}</p>

          <h2>Latest Vitals</h2>

          <div class="stat">
            <strong>Heart Rate:</strong>
            ${latest?.heart_rate ?? "N/A"} BPM
          </div>

          <div class="stat">
            <strong>O2 Level:</strong>
            ${latest?.spo2 ?? "N/A"}%
          </div>

          <div class="stat">
            <strong>Temperature:</strong>
            ${
              latest?.body_temperature != null
                ? Number(latest.body_temperature).toFixed(2)
                : "N/A"
            } F
          </div>

          <h2>Vitals History</h2>

          <table>
            <tr>
              <th>Date & Time</th>
              <th>Heart Rate (BPM)</th>
              <th>O2 Level (%)</th>
              <th>Temperature (F)</th>
            </tr>

            ${vitals
              .map(
                (v) => `
                  <tr>
                    <td>${new Date(
                      v.timestamp
                    ).toLocaleString()}</td>
                    <td>${v.heart_rate}</td>
                    <td>${v.spo2}</td>
                    <td>${Number(
                      v.body_temperature
                    ).toFixed(2)}</td>
                  </tr>
                `
              )
              .join("")}
          </table>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();

    setTimeout(() => printWindow.print(), 250);
  };

  const latestVital =
    vitals.length > 0 ? vitals[vitals.length - 1] : null;

  const getHealthStatus = () => {
    if (!latestVital) {
      return {
        status: "No Data",
        colorClass: "status-normal",
        trend: "N/A",
      };
    }

    const hr = latestVital.heart_rate;
    const spo2 = latestVital.spo2;
    const temp = latestVital.body_temperature;

    if (
      hr > 130 ||
      hr < 60 ||
      spo2 < 90 ||
      temp > 100 ||
      temp < 95
    ) {
      return {
        status: "Critical",
        colorClass: "status-critical",
        trend: "Alert",
      };
    }

    if (hr > 100 || spo2 < 95 || temp > 99) {
      return {
        status: "Warning",
        colorClass: "status-warning",
        trend: "Monitor",
      };
    }

    return {
      status: "Normal",
      colorClass: "status-normal",
      trend: "Stable",
    };
  };

  const healthStatus = getHealthStatus();

  const lastCheckTime = latestVital
    ? new Date(latestVital.timestamp).toLocaleString()
    : "N/A";

  return (
    <>
      <Navbar setToken={setToken} />

      <div className="dashboard-page">
        <div className="dashboard-container">

          <div className="dashboard-header">
            <div>
              <h1>Welcome back</h1>
              <p>
                Patient ID {patientId}: Track your health
                and vitals in one place.
              </p>
            </div>

            <PatientSelector
              patientId={patientId}
              setPatientId={setPatientId}
            />
          </div>

          {/* ADDED AUTH CARD */}
          {authError && (
            <div className="dashboard-auth-box">
              <p className="auth-label">Access Status</p>
              <h2>Unauthorized</h2>
              <p>{authError}</p>
            </div>
          )}

          {error && (
            <div className="dashboard-error">{error}</div>
          )}

          {verification && (
            <div
              className={`dashboard-status ${
                verification.integrity
                  ? "status-normal"
                  : "status-critical"
              }`}
            >
              <div>
                <p className="status-label">
                  Verification result
                </p>

                <h2>
                  {verification.integrity
                    ? "Verified"
                    : "Tampered"}
                </h2>

                <p>
                  Record ID: {verification.record_id}
                </p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="dashboard-loader">
              <div className="loader-circle"></div>
              <p>Loading your vitals...</p>
            </div>
          ) : (
            <>
              <div
                className={`dashboard-status ${healthStatus.colorClass}`}
              >
                <div>
                  <p className="status-label">
                    Current health status
                  </p>

                  <h2>{healthStatus.status}</h2>

                  <p>
                    Last checked: {lastCheckTime}
                  </p>
                </div>

                <div className="status-metric">
                  {healthStatus.trend}
                </div>
              </div>

              <div className="stats-grid">
                <Card className="stat-card" title="Heart Rate">
                  <p className="stat-value">
                    {latestVital?.heart_rate ?? "N/A"}{" "}
                    <span className="stat-unit">
                      bpm
                    </span>
                  </p>

                  <p className="stat-meta">
                    Latest heart rate reading
                  </p>
                </Card>

                <Card className="stat-card" title="Oxygen Level">
                  <p className="stat-value">
                    {latestVital?.spo2 ?? "N/A"}{" "}
                    <span className="stat-unit">
                      %
                    </span>
                  </p>

                  <p className="stat-meta">
                    Current SpO2 level
                  </p>
                </Card>

                <Card
                  className="stat-card"
                  title="Temperature"
                >
                  <p className="stat-value">
                    {latestVital?.body_temperature !=
                    null
                      ? Number(
                          latestVital.body_temperature
                        ).toFixed(1)
                      : "N/A"}{" "}
                    <span className="stat-unit">
                      F
                    </span>
                  </p>

                  <p className="stat-meta">
                    Body temperature
                  </p>
                </Card>

                <Card
                  className="stat-card"
                  title="Record Count"
                >
                  <p className="stat-value">
                    {vitals.length}
                  </p>

                  <p className="stat-meta">
                    Total vitals records loaded
                  </p>
                </Card>
              </div>

              <div className="dashboard-actions">
                <button
                  className="dashboard-button primary"
                  onClick={exportCSV}
                >
                  Export CSV
                </button>

                <button
                  className="dashboard-button secondary"
                  onClick={printReport}
                >
                  Print Report
                </button>

                <button
                  className="dashboard-button outline"
                  onClick={verifyLatestRecord}
                >
                  Verify Latest Record
                </button>

                <button
                  className="dashboard-button outline"
                  onClick={fetchVitals}
                >
                  Refresh Data
                </button>
              </div>

              <div className="chart-grid">
                <Card title="Heart Rate Over Time">
                  <ResponsiveContainer
                    width="100%"
                    height={300}
                  >
                    <BarChart
                      data={vitals.slice().reverse()}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="timestamp"
                        tickFormatter={(value) =>
                          new Date(
                            value
                          ).toLocaleTimeString()
                        }
                      />
                      <YAxis />
                      <Tooltip
                        labelFormatter={(value) =>
                          new Date(
                            value
                          ).toLocaleString()
                        }
                        formatter={(value) => [
                          value,
                          "Heart Rate",
                        ]}
                      />
                      <Bar
                        dataKey="heart_rate"
                        fill="#ef4444"
                        name="Heart Rate"
                        maxBarSize={18}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>

                <Card title="Oxygen Level Over Time">
                  <ResponsiveContainer
                    width="100%"
                    height={300}
                  >
                    <BarChart
                      data={vitals.slice().reverse()}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="timestamp"
                        tickFormatter={(value) =>
                          new Date(
                            value
                          ).toLocaleTimeString()
                        }
                      />
                      <YAxis />
                      <Tooltip
                        labelFormatter={(value) =>
                          new Date(
                            value
                          ).toLocaleString()
                        }
                        formatter={(value) => [
                          value,
                          "SpO2",
                        ]}
                      />
                      <Bar
                        dataKey="spo2"
                        fill="#14b8a6"
                        name="SpO2"
                        maxBarSize={18}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>

                <Card title="Temperature Over Time">
                  <ResponsiveContainer
                    width="100%"
                    height={300}
                  >
                    <BarChart
                      data={vitals.slice().reverse()}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="timestamp"
                        tickFormatter={(value) =>
                          new Date(
                            value
                          ).toLocaleTimeString()
                        }
                      />
                      <YAxis />
                      <Tooltip
                        labelFormatter={(value) =>
                          new Date(
                            value
                          ).toLocaleString()
                        }
                        formatter={(value) => [
                          Number(value).toFixed(1),
                          "Temperature",
                        ]}
                      />
                      <Bar
                        dataKey="body_temperature"
                        fill="#f59e0b"
                        name="Temperature"
                        maxBarSize={18}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </div>

              <Card title="Vitals History">
                <div className="table-responsive">
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Date & Time</th>
                        <th>Heart Rate</th>
                        <th>O2 Level</th>
                        <th>Temperature</th>
                      </tr>
                    </thead>

                    <tbody>
                      {vitals.map((vital, idx) => (
                        <tr key={idx}>
                          <td>
                            {new Date(
                              vital.timestamp
                            ).toLocaleString()}
                          </td>

                          <td>
                            {vital.heart_rate} bpm
                          </td>

                          <td>
                            {vital.spo2}%
                          </td>

                          <td>
                            {Number(
                              vital.body_temperature
                            ).toFixed(1)}{" "}
                            F
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </>
  );
}