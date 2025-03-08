import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const WebsiteList = () => {
    const [websites, setWebsites] = useState([]);
    const [newWebsite, setNewWebsite] = useState({ name: '', url: '' });
    const [notification, setNotification] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddingWebsite, setIsAddingWebsite] = useState(false);
    const [editWebsite, setEditWebsite] = useState(null);

    const fetchWebsites = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/api/websites');
            setWebsites(response.data);
        } catch (error) {
            console.error("Error fetching websites:", error);
            showNotification('Failed to fetch websites', 'error');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWebsites();
    }, [fetchWebsites]);

    const handleAddWebsite = async () => {
        if (!newWebsite.name || !newWebsite.url) {
            showNotification('Please enter both name and URL', 'warning');
            return;
        }

        setIsAddingWebsite(true);
        try {
            await axios.post('http://localhost:5000/api/websites', newWebsite);
            setNewWebsite({ name: '', url: '' });
            fetchWebsites();
            showNotification('Website added successfully', 'success');
        } catch (error) {
            console.error("Error adding website:", error);
            showNotification('Failed to add website', 'error');
        } finally {
            setIsAddingWebsite(false);
        }
    };

    const handleDeleteWebsite = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/websites/${id}`);
            
            // Animate before removing
            const updatedWebsites = websites.map(website => 
                website._id === id ? { ...website, isDeleting: true } : website
            );
            setWebsites(updatedWebsites);
            
            // Remove after animation
            setTimeout(() => {
                fetchWebsites();
            }, 500);
            
            showNotification('Website deleted successfully', 'success');
        } catch (error) {
            console.error("Error deleting website:", error);
            showNotification('Failed to delete website', 'error');
        }
    };

    const handleCheckWebsite = async (id) => {
        const websiteIndex = websites.findIndex(w => w._id === id);
        if (websiteIndex === -1) return;
        
        // Optimistic UI update - show checking status
        const updatedWebsites = [...websites];
        updatedWebsites[websiteIndex] = {
            ...updatedWebsites[websiteIndex],
            status: 'CHECKING...',
            isChecking: true
        };
        setWebsites(updatedWebsites);
        
        try {
            const response = await axios.get(`http://localhost:5000/api/websites/${id}/check`);
            const finalWebsites = [...websites];
            finalWebsites[websiteIndex] = {
                ...finalWebsites[websiteIndex],
                status: response.data.status,
                lastChecked: response.data.lastChecked,
                isChecking: false,
                justUpdated: true
            };
            setWebsites(finalWebsites);
            
            // Remove highlight effect after animation
            setTimeout(() => {
                const resetWebsites = [...finalWebsites];
                resetWebsites[websiteIndex] = {
                    ...resetWebsites[websiteIndex],
                    justUpdated: false
                };
                setWebsites(resetWebsites);
            }, 1500);
            
            showNotification('Website status updated', 'success');
        } catch (error) {
            console.error("Error checking website status:", error);
            // Revert to previous state
            fetchWebsites();
            showNotification('Failed to check website status', 'error');
        }
    };

    const handleUpdateWebsite = async () => {
        if (!editWebsite || !editWebsite._id || !editWebsite.name || !editWebsite.url) {
            showNotification('Please fill in all fields', 'warning');
            return;
        }
        
        try {
            await axios.put(`http://localhost:5000/api/websites/${editWebsite._id}`, {
                name: editWebsite.name,
                url: editWebsite.url
            });
            setEditWebsite(null);
            fetchWebsites();
            showNotification('Website updated successfully', 'success');
        } catch (error) {
            console.error("Error updating website:", error);
            showNotification('Failed to update website', 'error');
        }
    };

    const showNotification = (message, type) => {
        setNotification({ message, type, id: Date.now() });
        setTimeout(() => setNotification(null), 3000);
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'UP':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'DOWN':
                return 'bg-red-100 text-red-800 border-red-300';
            case 'CHECKING...':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
                    <h2 className="text-3xl font-bold text-white text-center">Website Uptime Monitor</h2>
                    <p className="text-indigo-200 mt-2 text-center">Track and monitor your website's availability</p>
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
                    {/* Add Website Form */}
                    <div className="mb-8 bg-gray-50 p-4 rounded-lg shadow-sm">
                        <h3 className="text-lg font-medium text-gray-800 mb-3">Add New Website</h3>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
                            <input 
                                type="text" 
                                placeholder="Website Name" 
                                value={newWebsite.name} 
                                onChange={(e) => setNewWebsite({ ...newWebsite, name: e.target.value })} 
                                className="border border-gray-300 p-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full" 
                            />
                            <input 
                                type="url" 
                                placeholder="Website URL (https://example.com)" 
                                value={newWebsite.url} 
                                onChange={(e) => setNewWebsite({ ...newWebsite, url: e.target.value })} 
                                className="border border-gray-300 p-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full" 
                            />
                            <button 
                                onClick={handleAddWebsite}
                                disabled={isAddingWebsite}
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-md hover:from-blue-600 hover:to-indigo-700 shadow-md transition duration-300"
                            >
                                {isAddingWebsite ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Adding...
                                    </span>
                                ) : 'Add Website'}
                            </button>
                        </div>
                    </div>

                    {/* Update Website Form */}
                    {editWebsite && (
                        <div className="mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg shadow-md border-l-4 border-yellow-400">
                            <h3 className="text-lg font-medium text-gray-800 mb-3">Edit Website</h3>
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-4 md:gap-4">
                                <input 
                                    type="text" 
                                    placeholder="Website Name" 
                                    className="border border-gray-300 p-2 rounded-md shadow-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 w-full md:col-span-1" 
                                    value={editWebsite.name} 
                                    onChange={(e) => setEditWebsite({ ...editWebsite, name: e.target.value })} 
                                />
                                <input 
                                    type="url" 
                                    placeholder="Website URL" 
                                    className="border border-gray-300 p-2 rounded-md shadow-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 w-full md:col-span-1" 
                                    value={editWebsite.url} 
                                    onChange={(e) => setEditWebsite({ ...editWebsite, url: e.target.value })} 
                                />
                                <button 
                                    onClick={handleUpdateWebsite} 
                                    className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-md hover:from-yellow-600 hover:to-orange-600 shadow-md transition duration-300"
                                >
                                    Update
                                </button>
                                <button 
                                    onClick={() => setEditWebsite(null)} 
                                    className="bg-gradient-to-r from-gray-400 to-gray-500 text-white px-4 py-2 rounded-md hover:from-gray-500 hover:to-gray-600 shadow-md transition duration-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Website List Table */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <h3 className="text-lg font-medium text-gray-800 p-4 bg-gray-50 border-b">Monitored Websites</h3>
                        
                        {isLoading ? (
                            <div className="flex justify-center items-center p-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : websites.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                No websites are currently being monitored. Add a website above to get started.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700">
                                            <th className="border-b py-3 px-4 text-left">Name</th>
                                            <th className="border-b py-3 px-4 text-left">URL</th>
                                            <th className="border-b py-3 px-4 text-left">Status</th>
                                            <th className="border-b py-3 px-4 text-left">Last Checked</th>
                                            <th className="border-b py-3 px-4 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {websites.map((website, index) => (
                                            <tr key={website._id} 
                                                className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${
                                                    website.isDeleting ? 'animate-fadeOut opacity-0 h-0 overflow-hidden' : 
                                                    website.justUpdated ? 'bg-purple-50 animate-pulse' : ''
                                                }`}
                                            >
                                                <td className="border-b py-3 px-4">{website.name}</td>
                                                <td className="border-b py-3 px-4">
                                                    <a href={website.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                        {website.url}
                                                    </a>
                                                </td>
                                                <td className="border-b py-3 px-4">
                                                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(website.status)}`}>
                                                        {website.status || 'UNKNOWN'}
                                                    </span>
                                                </td>
                                                <td className="border-b py-3 px-4 text-gray-600 text-sm">
                                                    {formatDate(website.lastChecked)}
                                                </td>
                                                <td className="border-b py-3 px-4">
                                                    <div className="flex justify-center space-x-2">
                                                        <button 
                                                            onClick={() => setEditWebsite(website)} 
                                                            className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1 rounded hover:from-yellow-500 hover:to-yellow-600 shadow transition duration-300"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button 
                                                            onClick={() => handleCheckWebsite(website._id)} 
                                                            disabled={website.isChecking}
                                                            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded hover:from-green-600 hover:to-green-700 shadow transition duration-300"
                                                        >
                                                            {website.isChecking ? (
                                                                <span className="flex items-center">
                                                                    <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                    </svg>
                                                                    Check
                                                                </span>
                                                            ) : 'Check'}
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteWebsite(website._id)} 
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
                    Website Uptime Monitor • {new Date().getFullYear()}
                </div>
            </div>
        </div>
    );
};

// Add these animations to your CSS or tailwind.config.js
const styleTag = document.createElement('style');
styleTag.textContent = `
@keyframes fadeIn {
    0% { opacity: 0; transform: translateY(-10px); }
    100% { opacity: 1; transform: translateY(0); }
}

@keyframes fadeOut {
    0% { opacity: 1; height: auto; }
    100% { opacity: 0; height: 0; }
}

.animate-fadeIn {
    animation: fadeIn 0.3s ease-out forwards;
}

.animate-fadeOut {
    animation: fadeOut 0.5s ease-out forwards;
}

.animate-pulse {
    animation: pulse 1.5s ease-in-out;
}

@keyframes pulse {
    0%, 100% { background-color: rgba(243, 232, 255, 0.6); }
    50% { background-color: rgba(233, 213, 255, 1); }
}
`;
document.head.appendChild(styleTag);

export default WebsiteList;