import React, { useEffect, useState, useCallback } from 'react';
import { getUsers, addUser, updateUser, deleteUser } from '../api';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ name: '', email: '' });
    const [editUser, setEditUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notification, setNotification] = useState(null);

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const users = await getUsers();
            setUsers(users);
        } catch (error) {
            showNotification('Failed to fetch users', 'error');
        } finally {
            setIsLoading(false);
        }
    }, []); // Empty dependency array means this function is memoized and won't change

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]); // Include fetchUsers in the dependency array

    const handleAddUser = async () => {
        if (!newUser.name || !newUser.email) {
            showNotification('Please fill in all fields', 'warning');
            return;
        }
        
        try {
            await addUser(newUser);
            setNewUser({ name: '', email: '' });
            fetchUsers();
            showNotification('User added successfully', 'success');
        } catch (error) {
            showNotification('Failed to add user', 'error');
        }
    };

    const handleUpdateUser = async () => {
        if (!editUser || !editUser._id || !editUser.name || !editUser.email) {
            showNotification('Please fill in all fields', 'warning');
            return;
        }
        
        try {
            await updateUser(editUser._id, { name: editUser.name, email: editUser.email });
            setEditUser(null);
            fetchUsers();
            showNotification('User updated successfully', 'success');
        } catch (error) {
            showNotification('Failed to update user', 'error');
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            await deleteUser(id);
            fetchUsers();
            showNotification('User deleted successfully', 'success');
        } catch (error) {
            showNotification('Failed to delete user', 'error');
        }
    };

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
                    <h2 className="text-3xl font-bold text-white text-center">User Management</h2>
                </div>

                {notification && (
                    <div className={`p-4 mx-6 mt-4 rounded-md ${
                        notification.type === 'success' ? 'bg-green-100 text-green-700 border border-green-400' :
                        notification.type === 'error' ? 'bg-red-100 text-red-700 border border-red-400' :
                        'bg-yellow-100 text-yellow-700 border border-yellow-400'
                    }`}>
                        {notification.message}
                    </div>
                )}

                <div className="p-6">
                    {/* Add User Form */}
                    <div className="mb-8 bg-gray-50 p-4 rounded-lg shadow-sm">
                        <h3 className="text-lg font-medium text-gray-800 mb-3">Add New User</h3>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
                            <input 
                                type="text" 
                                placeholder="Name" 
                                className="border border-gray-300 p-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full" 
                                value={newUser.name} 
                                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} 
                            />
                            <input 
                                type="email" 
                                placeholder="Email" 
                                className="border border-gray-300 p-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full" 
                                value={newUser.email} 
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} 
                            />
                            <button 
                                onClick={handleAddUser} 
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-md hover:from-blue-600 hover:to-indigo-700 shadow-md transition duration-300"
                            >
                                Add User
                            </button>
                        </div>
                    </div>

                    {/* Update User Form */}
                    {editUser && (
                        <div className="mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg shadow-md border-l-4 border-yellow-400">
                            <h3 className="text-lg font-medium text-gray-800 mb-3">Edit User</h3>
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-4 md:gap-4">
                                <input 
                                    type="text" 
                                    placeholder="Name" 
                                    className="border border-gray-300 p-2 rounded-md shadow-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 w-full md:col-span-1" 
                                    value={editUser.name} 
                                    onChange={(e) => setEditUser({ ...editUser, name: e.target.value })} 
                                />
                                <input 
                                    type="email" 
                                    placeholder="Email" 
                                    className="border border-gray-300 p-2 rounded-md shadow-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 w-full md:col-span-1" 
                                    value={editUser.email} 
                                    onChange={(e) => setEditUser({ ...editUser, email: e.target.value })} 
                                />
                                <button 
                                    onClick={handleUpdateUser} 
                                    className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-md hover:from-yellow-600 hover:to-orange-600 shadow-md transition duration-300"
                                >
                                    Update
                                </button>
                                <button 
                                    onClick={() => setEditUser(null)} 
                                    className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 shadow-md transition duration-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {/* User List Table */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <h3 className="text-lg font-medium text-gray-800 p-4 bg-gray-50 border-b">User List</h3>
                        
                        {isLoading ? (
                            <div className="flex justify-center items-center p-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : users.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                No users found. Add a new user to get started.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700">
                                            <th className="border-b py-3 px-4 text-left">Name</th>
                                            <th className="border-b py-3 px-4 text-left">Email</th>
                                            <th className="border-b py-3 px-4 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user, index) => (
                                            <tr key={user._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                <td className="border-b py-3 px-4">{user.name}</td>
                                                <td className="border-b py-3 px-4">{user.email}</td>
                                                <td className="border-b py-3 px-4">
                                                    <div className="flex justify-center space-x-2">
                                                        <button 
                                                            onClick={() => setEditUser(user)} 
                                                            className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1 rounded hover:from-yellow-500 hover:to-yellow-600 shadow transition duration-300"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteUser(user._id)} 
                                                            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded hover:from-red-600 hover:to-red-700 shadow transition duration-300"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-indigo-700 to-blue-600 px-6 py-3 text-center text-white text-sm">
                    User Management Dashboard • {new Date().getFullYear()}
                </div>
            </div>
        </div>
    );
};

export default UserList;