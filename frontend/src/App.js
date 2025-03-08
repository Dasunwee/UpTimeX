import React, { useState, useEffect, useCallback } from 'react';
import UserList from './components/UserList';
import WebsiteList from './components/WebsiteList';
import './index.css';

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const fetchUsers = useCallback(() => {
    setIsLoading(true);
    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        showNotification("Failed to fetch users", "error");
        setIsLoading(false);
      });
  }, []); // Dependencies for fetchUsers

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]); // Include fetchUsers in the dependency array

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const res = await fetch("http://localhost:5000/user", {
            method: "POST",
            headers: { "Content-Type": "application/json" }, // Corrected line
            body: JSON.stringify({ name, email }),
        });

        if (res.ok) {
            setName("");
            setEmail("");
            fetchUsers(); // Refresh user list after adding
            showNotification("User added successfully!", "success");
        } else {
            showNotification("Failed to add user", "error");
        }
    } catch (error) {
        console.error("Error adding user:", error);
        showNotification("Error connecting to server", "error");
    }
};
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/user/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchUsers(); // Refresh users after deletion
        showNotification("User deleted successfully!", "success");
      } else {
        showNotification("Failed to delete user", "error");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      showNotification("Error connecting to server", "error");
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-lg p-6 mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white text-center">
              UpTimeX Dashboard
            </h1>
          </div>
          
          {/* Notification */}
          {notification && (
            <div className={`p-4 rounded-md shadow-md transition-all duration-300 ${
              notification.type === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' :
              notification.type === 'error' ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white' :
              'bg-gradient-to-r from-yellow-400 to-amber-500 text-white'
            }`}>
              {notification.message}
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Quick Add Form */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4">
              <h2 className="text-xl font-semibold text-white">Add a New User</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full border border-gray-300 p-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full border border-gray-300 p-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-md hover:from-blue-600 hover:to-indigo-700 transition duration-300 shadow-md"
                >
                  Add User
                </button>
              </form>
            </div>
          </div>

          {/* Right Column - User Quick List */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4">
              <h2 className="text-xl font-semibold text-white">User Quick List</h2>
            </div>
            <div className="p-6">
              {isLoading ? (
                <div className="flex justify-center items-center p-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : users.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <li key={user._id} className="py-3 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <button 
                        onClick={() => handleDelete(user._id)}
                        className="bg-gradient-to-r from-red-400 to-red-500 text-white px-3 py-1 rounded-md hover:from-red-500 hover:to-red-600 transition duration-300 shadow-sm"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="bg-gray-50 rounded-md p-8 text-center">
                  <p className="text-gray-500">No users found. Add a new user to get started.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Full User Management Section */}
        <div className="mt-8">
          <UserList />
        </div>

        {/* Website List Section */}
        <div className="mt-8">
          <WebsiteList />
        </div>
        
        {/* Footer */}
        <footer className="mt-12 text-center text-gray-600 bg-white p-4 rounded-lg shadow-md">
          <p>UpTimeX Dashboard • {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  );
}

export default App;