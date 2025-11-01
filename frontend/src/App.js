
import React, { useState } from "react";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
import TeacherDashboard from "./components/TeacherDashboard";
import StudentDashboard from "./components/StudentDashboard";

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => setUser(userData);

  if (!user) return <Login onLogin={handleLogin} />;

  switch (user.role) {
    case "ADMIN":
      return <AdminDashboard user={user} />;
    case "TEACHER":
      return <TeacherDashboard user={user} />;
    case "STUDENT":
      return <StudentDashboard user={user} />;
    default:
      return <Login onLogin={handleLogin} />;
  }
}

export default App;
