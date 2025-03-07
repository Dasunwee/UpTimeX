import { useState, useEffect } from "react";
import UserList from './components/UserList';

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users from the backend
  const fetchUsers = () => {
    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));
  };

  // Handle form submission to create a new user
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      if (res.ok) {
        setName("");
        setEmail("");
        fetchUsers(); // Refresh user list after adding
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  // Handle user deletion
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/user/${id}`, { method: "DELETE" });
      fetchUsers(); // Refresh users after deletion
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div>
      <h1>UpTimeX Frontend</h1>
      <h2>API Response:</h2>
      <ul>
        {users.length > 0 ? (
          users.map((user) => (
            <li key={user._id}>
              {user.name} - {user.email}{" "}
              <button onClick={() => handleDelete(user._id)}>Delete</button>
            </li>
          ))
        ) : (
          <p>No users found.</p>
        )}
      </ul>

      <h2>Add a User</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Add User</button>
      </form>
    
     <h1>UpTimeX Frontend</h1>
      <UserList />
     
      

    </div>
      
      
  
);

  
}

export default App;
