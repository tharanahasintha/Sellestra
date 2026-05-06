import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { User, Settings, ShoppingBag } from 'lucide-react';
import api from '../../services/api';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const [profileData, setProfileData] = useState({ name: 'Sellestra User', phone: '+123456789' });
  const [isEditing, setIsEditing] = useState(false);

  // Mock fetching profile data
  useEffect(() => {
    // api.user.get(`/users/${user.id}`).then(...)
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    toast.success("Profile updated successfully!");
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete your account? This cannot be undone.")) {
      toast.info("Account deleted successfully.");
      logout();
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <h2 className="text-3xl font-serif mb-8 text-slate-900 border-b pb-4">My Account</h2>
      
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-1/4">
          <ul className="space-y-2">
            <li>
              <button className="w-full text-left flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-lg font-medium">
                <User size={18} /> Profile Overview
              </button>
            </li>
            <li>
              <button className="w-full text-left flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 transition rounded-lg font-medium">
                <ShoppingBag size={18} /> Order History
              </button>
            </li>
            <li>
              <button className="w-full text-left flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 transition rounded-lg font-medium">
                <Settings size={18} /> Settings
              </button>
            </li>
          </ul>
        </div>

        {/* Content */}
        <div className="w-full md:w-3/4">
          <div className="bg-white border text-left border-slate-200 rounded-xl p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Personal Information</h3>
              <button 
                className="text-primary hover:underline text-sm font-medium"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      className="w-full border rounded-lg px-3 py-2"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">Phone</label>
                    <input 
                      type="text" 
                      className="w-full border rounded-lg px-3 py-2"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Email <span className="text-xs text-slate-400">(immutable)</span></label>
                  <input type="email" disabled value={user?.email || ''} className="w-full border bg-slate-50 rounded-lg px-3 py-2 text-slate-500" />
                </div>
                <button type="submit" className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg transition font-medium">
                  Save Changes
                </button>
              </form>
            ) : (
              <div className="grid grid-cols-2 gap-y-6">
                <div>
                  <div className="text-sm text-slate-500 mb-1">Full Name</div>
                  <div className="font-medium">{profileData.name}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500 mb-1">Email Address</div>
                  <div className="font-medium">{user?.email || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500 mb-1">Phone Number</div>
                  <div className="font-medium">{profileData.phone}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500 mb-1">Role</div>
                  <div className="font-medium">{user?.role}</div>
                </div>
              </div>
            )}
            
            <div className="mt-12 pt-6 border-t border-red-100">
              <h3 className="text-lg font-semibold text-red-600 mb-2">Danger Zone</h3>
              <p className="text-sm text-slate-600 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
              <button 
                onClick={handleDelete}
                className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-600 hover:text-white transition"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
