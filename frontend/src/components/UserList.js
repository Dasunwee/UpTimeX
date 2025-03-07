import React, { useEffect, useState } from 'react';
import { getUsers, addUser, updateUser, deleteUser } from '../api';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ name: '', email: '' });
    const [editUser, setEditUser] = useState(null);

    // Fetch users on load
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const users = await getUsers();
        setUsers(users);
    };

    // Handle adding new user
    const handleAddUser = async () => {
        if (!newUser.name || !newUser.email) return;
        await addUser(newUser);
        setNewUser({ name: '', email: '' });
        fetchUsers();
    };

    const handleUpdateUser = async () => {
        if (!editUser || !editUser._id || !editUser.name || !editUser.email) return;
    
        await updateUser(editUser._id, { name: editUser.name, email: editUser.email });
        setEditUser(null);
        fetchUsers(); // Refresh the user list after update
    };
    

    // Handle delete
    const handleDeleteUser = async (id) => {
        await deleteUser(id);
        fetchUsers();
    };

    return (
        <div>
            <h2>User Management</h2>

            {/* Add User Form */}
            <input 
                type="text" 
                placeholder="Name" 
                value={newUser.name} 
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} 
            />
            <input 
                type="email" 
                placeholder="Email" 
                value={newUser.email} 
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} 
            />
            <button onClick={handleAddUser}>Add User</button>

            {/* Update User Form */}
            {editUser && (
                <div>
                    <input 
                        type="text" 
                        placeholder="Name" 
                        value={editUser.name} 
                        onChange={(e) => setEditUser({ ...editUser, name: e.target.value })} 
                    />
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={editUser.email} 
                        onChange={(e) => setEditUser({ ...editUser, email: e.target.value })} 
                    />
                    <button onClick={handleUpdateUser}>Update User</button>
                    <button onClick={() => setEditUser(null)}>Cancel</button>
                </div>
            )}

            {/* User List Table */}
            <table border="1">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                <button onClick={() => setEditUser(user)}>Edit</button>
                                <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;
