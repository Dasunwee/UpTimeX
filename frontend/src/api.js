import axios from 'axios';

const API_URL = 'http://localhost:5000';

// Get all users
export const getUsers = async () => {
    try {
        const response = await axios.get(`${API_URL}/users`);
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
};

// Add a new user
export const addUser = async (user) => {
    try {
        const response = await axios.post(`${API_URL}/user`, user);
        return response.data;
    } catch (error) {
        console.error("Error adding user:", error);
    }
};

// Update user
export const updateUser = async (id, user) => {
    try {
        const response = await axios.put(`${API_URL}/user/${id}`, user);
        return response.data;
    } catch (error) {
        console.error("Error updating user:", error);
    }
};

// Delete user
export const deleteUser = async (id) => {
    try {
        await axios.delete(`${API_URL}/user/${id}`);
    } catch (error) {
        console.error("Error deleting user:", error);
    }
};
