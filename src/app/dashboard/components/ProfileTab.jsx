import React, { useState } from 'react';
import useAuthStore from '@/store/authStore';
import api from '@/lib/api';

export default function ProfileTab() {
  const { user, setUser } = useAuthStore();
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/user/profile');
        if (setUser) setUser(res.data.data);
        setProfileData({
          name: res.data.data.name || '',
          phone: res.data.data.phone || '',
        });
      } catch (err) {
        console.error('Failed to fetch profile', err);
      }
    };
    fetchProfile();
  }, [setUser]);
  
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg({ type: '', text: '' });
    try {
      const res = await api.patch('/user/profile', profileData);
      if (setUser) setUser(res.data.data);
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setProfileMsg({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return setPasswordMsg({ type: 'error', text: 'Passwords do not match' });
    }

    setPasswordLoading(true);
    try {
      await api.patch('/user/change-password', {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      setPasswordMsg({ type: 'success', text: 'Password changed successfully!' });
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setPasswordMsg({ type: 'error', text: error.response?.data?.message || 'Failed to change password' });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-black text-gray-900">Profile Settings</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">Personal Information</h3>
        
        {profileMsg.text && (
          <div className={`mb-4 p-3 rounded text-sm font-medium ${profileMsg.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
            {profileMsg.text}
          </div>
        )}

        <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
            <input type="email" value={user?.email || ''} readOnly className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed" />
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
            <input type="text" name="name" value={profileData.name} onChange={handleProfileChange} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-accent" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
            <input type="text" name="phone" value={profileData.phone} onChange={handleProfileChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-accent" />
          </div>
          <button type="submit" disabled={profileLoading} className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-sm disabled:opacity-50 mt-4">
            {profileLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {user?.provider === 'credentials' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">Change Password</h3>
          
          {passwordMsg.text && (
            <div className={`mb-4 p-3 rounded text-sm font-medium ${passwordMsg.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
              {passwordMsg.text}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Current Password</label>
              <input type="password" name="oldPassword" value={passwordData.oldPassword} onChange={handlePasswordChange} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">New Password</label>
              <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} required minLength="6" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Confirm New Password</label>
              <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} required minLength="6" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-accent" />
            </div>
            <button type="submit" disabled={passwordLoading} className="bg-accent hover:bg-accent-hover text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-sm disabled:opacity-50 mt-4">
              {passwordLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
