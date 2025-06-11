import React, { useState, useRef } from 'react'
import axios from 'axios'
import { Button, Input } from './index'
import DefaultAvatar from '../assets/DefaultAvatar.png'
import { useSelector, useDispatch } from 'react-redux'
import { login } from '../redux/slices/authSlice'

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validatePassword(password) {
  return password.length >= 6;
}
function validateName(name) {
  return name.trim().length >= 2;
}

function UserSettings() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [fullname, setFullname] = useState(user?.fullname || '');
  const [email, setEmail] = useState(user?.email || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [avatar, setAvatar] = useState(user?.avatar || DefaultAvatar);
  const [avatarFile, setAvatarFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [changed, setChanged] = useState(false);
  const [activeTab, setActiveTab] = useState('account');
  const fileInputRef = useRef();

  // Update local state if redux user changes
  React.useEffect(() => {
    setFullname(user?.fullname || '');
    setEmail(user?.email || '');
    setAvatar(user?.avatar || DefaultAvatar);
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatar(URL.createObjectURL(file));
      setChanged(true);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;
    setLoading(true); setMsg(''); setError('');
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);
      const res = await axios.patch('/api/users/update-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAvatar(res.data.avatar || DefaultAvatar);
      dispatch(login({ ...user, avatar: res.data.avatar }));
      setMsg('Avatar updated successfully!');
      setChanged(false);
    } catch (err) {
      setError('Failed to update avatar.');
    } finally {
      setLoading(false);
    }
  };

  const handleAccountUpdate = async (e) => {
    e.preventDefault();
    setMsg(''); setError('');
    if (!validateName(fullname)) { setError('Name must be at least 2 characters.'); return; }
    if (!validateEmail(email)) { setError('Invalid email format.'); return; }
    setLoading(true);
    try {
      const res = await axios.patch('/api/users/update-account-detai1s', { fullname, email });
      dispatch(login({ ...user, fullname, email }));
      setMsg('Account details updated successfully.');
      setChanged(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update account details.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setMsg(''); setError('');
    if (!validatePassword(newPassword)) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      await axios.patch('/api/users/change-password', { oldPassword, newPassword });
      setMsg('Password updated successfully.');
      setOldPassword(''); setNewPassword('');
      setChanged(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-16 p-8 bg-[#18181b] rounded-2xl shadow-2xl text-white animate-fade-in">
      <h2 className="text-2xl font-bold mb-8 text-center">User Settings</h2>
      <div className="flex mb-8 gap-0.5 border-b border-gray-800">
        <button
          className={`flex-1 py-3 text-lg font-bold rounded-t-xl transition-colors duration-200 ${activeTab === 'account' ? 'bg-gradient-to-r from-purple-700 to-purple-500 text-white shadow-lg' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('account')}
        >
          <span className="inline-block align-middle mr-2">📝</span> Account
        </button>
        <button
          className={`flex-1 py-3 text-lg font-bold rounded-t-xl transition-colors duration-200 ${activeTab === 'password' ? 'bg-gradient-to-r from-blue-700 to-blue-500 text-white shadow-lg' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('password')}
        >
          <span className="inline-block align-middle mr-2">🔒</span> Password
        </button>
      </div>
      {msg && <div className="mb-3 text-green-400 font-semibold text-center">{msg}</div>}
      {error && <div className="mb-3 text-red-400 font-semibold text-center">{error}</div>}
      {activeTab === 'account' && (
        <form onSubmit={handleAccountUpdate} className="space-y-8 mb-10 animate-fade-in">
          <div className="flex items-center gap-6 mb-6">
            <div className="relative">
              <img
                src={avatar}
                alt="avatar"
                className="w-20 h-20 rounded-full border-4 border-purple-500 object-cover bg-gray-800"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 text-xs px-2 py-1 rounded-full shadow-lg border-2 border-white"
              >
                Change
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
              {avatarFile && (
                <Button
                  type="button"
                  className="w-full mt-2 bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-800 hover:to-purple-600 text-white p-2 rounded-xl font-bold shadow-lg transition"
                  onClick={handleAvatarUpload}
                  disabled={loading}
                >
                  {loading ? 'Uploading...' : 'Save Avatar'}
                </Button>
              )}
            </div>
            <div className="flex-1 space-y-4">
              <Input
                type="text"
                label="Full Name"
                value={fullname}
                onChange={e => { setFullname(e.target.value); setChanged(true); }}
                className="w-full p-3 rounded-xl bg-gray-800 border-2 border-purple-700 focus:ring-2 focus:ring-purple-500 placeholder-gray-400 shadow-md focus:shadow-lg"
                required
                minLength={2}
              />
              <Input
                type="email"
                label="Email"
                value={email}
                onChange={e => { setEmail(e.target.value); setChanged(true); }}
                className="w-full p-3 rounded-xl bg-gray-800 border-2 border-purple-700 focus:ring-2 focus:ring-purple-500 placeholder-gray-400 shadow-md focus:shadow-lg"
                required
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-800 hover:to-purple-600 text-white p-3 rounded-xl font-bold shadow-lg transition"
            disabled={!changed || loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      )}
      {activeTab === 'password' && (
        <form onSubmit={handlePasswordUpdate} className="space-y-6 animate-fade-in">
          <div>
            <Input
              type={showPassword ? 'text' : 'password'}
              label="Old Password"
              value={oldPassword}
              onChange={e => { setOldPassword(e.target.value); setChanged(true); }}
              className="w-full p-3 rounded-xl bg-gray-800 border-2 border-blue-700 focus:ring-2 focus:ring-blue-500 placeholder-gray-400 shadow-md focus:shadow-lg pr-12"
              minLength={6}
              required
            />
          </div>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              label="New Password"
              value={newPassword}
              onChange={e => { setNewPassword(e.target.value); setChanged(true); }}
              className="w-full p-3 rounded-xl bg-gray-800 border-2 border-blue-700 focus:ring-2 focus:ring-blue-500 placeholder-gray-400 shadow-md focus:shadow-lg pr-12"
              minLength={6}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              onClick={() => setShowPassword(v => !v)}
              tabIndex={-1}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white p-3 rounded-xl font-bold shadow-lg transition"
            disabled={!oldPassword || !newPassword || loading}
          >
            {loading ? 'Saving...' : 'Change Password'}
          </Button>
        </form>
      )}
    </div>
  )
}

export default UserSettings