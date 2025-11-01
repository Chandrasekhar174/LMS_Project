
import React, { useEffect, useState } from "react";

export default function StudentDashboard({ user }) {
  const [marks, setMarks] = useState(null);

  useEffect(() => {
    fetch((process.env.REACT_APP_API_URL || "http://localhost:8080") + '/api/auth/student/' + user.username + '/marks')
      .then(res => res.json())
      .then(data => setMarks(data.marks));
  }, [user.username]);

  return (
    <div className="dashboard student">
      <h2>Welcome, {user.username} 🎒</h2>
      <p>Your Marks: {marks === null ? 'N/A' : marks}</p>
    </div>
  );
}
