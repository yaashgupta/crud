import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

const App = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8081/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    const user = { name, email, age };

    if (selectedUser) {
      // Update user
      try {
        await axios.put(`http://localhost:8081/users/${selectedUser.id}`, user);
        fetchUsers();
        setSelectedUser(null);
      } catch (error) {
        console.error("Error updating user", error);
      }
    } else {
      // Create user
      try {
        await axios.post("http://localhost:8081/users", user);
        fetchUsers();
      } catch (error) {
        console.error("Error creating user", error);
      }
    }

    // Reset the form fields
    setName("");
    setEmail("");
    setAge("");
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setName(user.name);
    setEmail(user.email);
    setAge(user.age);
  };

  return (
    <div className="container">
      <h1>CRUD Application</h1>

      <form onSubmit={handleUserSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Age:</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </div>
        <button type="submit">
          {selectedUser ? "Update User" : "Create User"}
        </button>
      </form>

      <h2>Users List</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.age}</td>
              <td>
                <button onClick={() => handleEditUser(user)}>Edit</button>
                <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
