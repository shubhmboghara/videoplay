import React, { useState, useRef } from 'react'
import axios from 'axios'
import { Button, Input,DefaultAvatar } from './index'
import { useSelector, useDispatch } from 'react-redux'
import { login } from '../redux/slices/authSlice'

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return strongPasswordRegex.test(password);
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
    if (!validateEmail(email)) {
      setError('Invalid email format.');
      return;
    }
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
    if (!validatePassword(newPassword)) {
      setError('Password must be at least 8 characters, and include uppercase, lowercase, number, and special character.');
      return;
    }
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#18181b] via-[#23232b] to-[#18181b] py-12 px-2">
      <div className="w-full max-w-2xl bg-[#23232b] rounded-3xl shadow-2xl border border-[#29293a] p-0 sm:p-10 animate-fade-in">
        <h2 className="text-3xl font-extrabold mb-2 text-center text-white tracking-tight">User Settings</h2>
        <p className="text-center text-gray-400 mb-8 text-base">Manage your account information and security</p>
        <div className="flex mb-8 gap-0.5 border-b border-gray-800">
          <button
            className={`flex-1 py-3 text-lg font-bold rounded-t-2xl transition-colors duration-200 ${activeTab === 'account' ? 'bg-gradient-to-r from-purple-700 to-purple-500 text-white shadow-lg' : 'bg-[#23232b] text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('account')}
          >
            <span className="inline-block align-middle mr-2">📝</span> Account
          </button>
          <button
            className={`flex-1 py-3 text-lg font-bold rounded-t-2xl transition-colors duration-200 ${activeTab === 'password' ? 'bg-gradient-to-r from-blue-700 to-blue-500 text-white shadow-lg' : 'bg-[#23232b] text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('password')}
          >
            <span className="inline-block align-middle mr-2">🔒</span> Password
          </button>
        </div>
        {(msg || error) && (
          <div className="mb-4 flex justify-center">
            {msg && <div className="px-4 py-2 rounded-lg bg-green-900/60 text-green-300 text-sm font-medium shadow-sm border border-green-700 animate-fade-in">{msg}</div>}
            {error && <div className="px-4 py-2 rounded-lg bg-red-900/60 text-red-300 text-sm font-medium shadow-sm border border-red-700 animate-fade-in">{error}</div>}
          </div>
        )}
        {activeTab === 'account' && (
          <form onSubmit={handleAccountUpdate} className="space-y-10 mb-10 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-center gap-8 mb-8">
              <div className="relative flex flex-col items-center">
                <img
                  src={avatar}
                  alt="avatar"
                  className="w-24 h-24 rounded-full border-4 border-purple-500 object-cover bg-gray-800 shadow-lg"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-2 right-2 bg-purple-600 hover:bg-purple-700 text-xs px-3 py-1 rounded-full shadow-lg border-2 border-white transition-all"
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
                    className="w-full mt-3 bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-800 hover:to-purple-600 text-white p-2 rounded-xl font-bold shadow-lg transition"
                    onClick={handleAvatarUpload}
                    disabled={loading}
                  >
                    {loading ? 'Uploading...' : 'Save Avatar'}
                  </Button>
                )}
              </div>
              <div className="flex-1 space-y-6 w-full">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1 ml-1">Full Name</label>
                  <Input
                    type="text"
                    value={fullname}
                    onChange={e => { setFullname(e.target.value); setChanged(true); }}
                    className="w-full p-3 rounded-xl bg-gray-800 border-2 border-purple-700 focus:ring-2 focus:ring-purple-500 placeholder-gray-400 shadow-md focus:shadow-lg text-base"
                    required
                    minLength={2}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1 ml-1">Email</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setChanged(true); }}
                    className="w-full p-3 rounded-xl bg-gray-800 border-2 border-purple-700 focus:ring-2 focus:ring-purple-500 placeholder-gray-400 shadow-md focus:shadow-lg text-base"
                    required
                    placeholder="Enter your email"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-800 hover:to-purple-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition text-lg"
                disabled={!changed || loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        )}
        {activeTab === 'password' && (
          <>
            <div className="border-t border-gray-800 mb-8"></div>
            <form onSubmit={handlePasswordUpdate} className="space-y-8 animate-fade-in">
              <div>
                <label className="block text-gray-300 font-semibold mb-1 ml-1">Old Password</label>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={oldPassword}
                  onChange={e => { setOldPassword(e.target.value); setChanged(true); }}
                  className="w-full p-3 rounded-xl bg-gray-800 border-2 border-blue-700 focus:ring-2 focus:ring-blue-500 placeholder-gray-400 shadow-md focus:shadow-lg pr-12 text-base"
                  required
                  placeholder="Enter your old password"
                />
              </div>
              <div className="relative">
                <label className="block text-gray-300 font-semibold mb-1 ml-1">New Password</label>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={e => { setNewPassword(e.target.value); setChanged(true); }}
                  className="w-full p-3 rounded-xl bg-gray-800 border-2 border-blue-700 focus:ring-2 focus:ring-blue-500 placeholder-gray-400 shadow-md focus:shadow-lg pr-12 text-base"
                  required
                  placeholder="Enter your new password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-400 hover:text-white text-xl"
                  onClick={() => setShowPassword(v => !v)}
                  tabIndex={-1}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition text-lg"
                  disabled={!oldPassword || !newPassword || loading}
                >
                  {loading ? 'Saving...' : 'Change Password'}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default UserSettings