import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import "./Vitals.css";

function VitalCard({ records }) {
  if (!records || records.length === 0) {
    return <div className="vital-card">Loading vitals...</div>;
  }

  const latest = records[records.length - 1];

  const data = [
    {
      name: "Heart Rate",
      value: latest.heart_rate,
      color: "#ff4d4f",
    },
    {
      name: "SpO2",
      value: latest.spo2,
      color: "#1890ff",
    },
    {
      name: "Temperature",
      value: latest.body_temperature,
      color: "#52c41a",
    },
  ];

  return (
    <div className="vital-card white-bg">
      <h2>Patient Vitals</h2>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={data}
          margin={{ top: 30, right: 20, left: 10, bottom: 10 }}  // 👈 fix label cut
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />

          <Bar dataKey="value" barSize={35} radius={[6, 6, 0, 0]}>
            <LabelList dataKey="value" position="top" />

            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default VitalCard;