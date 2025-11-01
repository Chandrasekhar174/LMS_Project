
import React, { useEffect, useState } from "react";

export default function AdminDashboard({ user }) {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ username: '', password: '', marks: '' });
  const [message, setMessage] = useState('');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    const res = await fetch((process.env.REACT_APP_API_URL || "http://localhost:8080") + '/api/auth/admin/users');
    const data = await res.json();
    setStudents(data.filter(u => u.role === 'STUDENT'));
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addStudent = async () => {
    const body = { username: form.username, password: form.password, marks: form.marks ? parseInt(form.marks): null };
    const res = await fetch((process.env.REACT_APP_API_URL || "http://localhost:8080") + '/api/auth/admin/student', {
      method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body)
    });
    const data = await res.json();
    if (data.status) { setMessage('Student added'); fetchAll(); } else setMessage(data.error || 'Error');
  };

  const deleteStudent = async (id) => {
    await fetch((process.env.REACT_APP_API_URL || "http://localhost:8080") + '/api/auth/admin/student/' + id, { method: 'DELETE' });
    fetchAll();
  };

  return (
    <div className="dashboard admin">
      <h2>Welcome, {user.username} 👑</h2>
      <div>
        <h3>Add Student</h3>
        <input name="username" placeholder="username" onChange={handleChange} />
        <input name="password" placeholder="password" onChange={handleChange} />
        <input name="marks" placeholder="marks" onChange={handleChange} />
        <button onClick={addStudent}>Add</button>
        <p>{message}</p>
      </div>
      <div>
        <h3>Students</h3>
        <ul>
          {students.map(s => (
            <li key={s.id}>{s.username} - Marks: {s.marks || 'N/A'} <button onClick={() => deleteStudent(s.id)}>Delete</button></li>
          ))}
        </ul>
      </div>
    </div>
  );
}
