
import React, { useEffect, useState } from "react";

export default function TeacherDashboard({ user }) {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ username: '', password: '', marks: '' });
  const [message, setMessage] = useState('');

  useEffect(() => { fetchStudents(); }, []);

  const fetchStudents = async () => {
    const res = await fetch((process.env.REACT_APP_API_URL || "http://localhost:8080") + '/api/auth/teacher/students');
    const data = await res.json();
    setStudents(data);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addStudent = async () => {
    const body = { username: form.username, password: form.password, marks: form.marks ? parseInt(form.marks) : null };
    const res = await fetch((process.env.REACT_APP_API_URL || "http://localhost:8080") + '/api/auth/teacher/student', {
      method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body)
    });
    const data = await res.json();
    if (data.status) { setMessage('Student added'); fetchStudents(); } else setMessage(data.error || 'Error');
  };

  return (
    <div className="dashboard teacher">
      <h2>Welcome, {user.username} 👩‍🏫</h2>
      <div>
        <h3>Add Student</h3>
        <input name="username" placeholder="username" onChange={handleChange} />
        <input name="password" placeholder="password" onChange={handleChange} />
        <input name="marks" placeholder="marks" onChange={handleChange} />
        <button onClick={addStudent}>Add</button>
        <p>{message}</p>
      </div>
      <div>
        <h3>Students & Marks</h3>
        <ul>
          {students.map(s => (
            <li key={s.id}>{s.username} - Marks: {s.marks || 'N/A'}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
