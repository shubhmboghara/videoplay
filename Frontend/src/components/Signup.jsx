import React, { useState } from 'react';
import DefaultAvatar from '../assets/DefaultAvatar.png';
import DefaultCover from '../assets/folder.png';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login as loginAction } from '../redux/slices/authSlice';

const steps = [
  'Account Information',
  'Upload Profile Picture',
  'Upload Cover Image',
  'Review',
];

export default function MultiStepSignup({ showPopup }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullname: '',
    username: '',
    email: '',
    avatar: null,
    avatarPreview: DefaultAvatar,
    coverImage: null,
    coverPreview: DefaultCover,
    avatarIsDefault: true,
    coverIsDefault: true,
    password: '', 
  });
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleImageChange = (e, type) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(f => ({
        ...f,
        [type]: file,
        [`${type === 'avatar' ? 'avatarPreview' : 'coverPreview'}`]: reader.result,
        [`${type === 'avatar' ? 'avatarIsDefault' : 'coverIsDefault'}`]: false,
      }));
    };
    reader.readAsDataURL(file);
  } else {
    setForm(f => ({
      ...f,
      [type]: null,
      [`${type === 'avatar' ? 'avatarPreview' : 'coverPreview'}`]: type === 'avatar' ? DefaultAvatar : DefaultCover,
      [`${type === 'avatar' ? 'avatarIsDefault' : 'coverIsDefault'}`]: true,
    }));
  } 
};


  const handleUseDefault = type => {
    setForm(f => ({
      ...f,
      [type]: null,
      [`${type}Preview`]: type === 'avatar' ? DefaultAvatar : DefaultCover,
      [`${type}IsDefault`]: true,
    }));
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (!form.fullname || !form.username || !form.email || !form.password) {
        showPopup && showPopup('All fields are required', 'error');
        setSubmitting(false);
        return;
      }
      const payload = new FormData();
      payload.append('fullname', form.fullname);
      payload.append('username', form.username);
      payload.append('email', form.email);
      payload.append('password', form.password);
      if (form.coverImage) payload.append('coverImage', form.coverImage);
      if (form.avatar) payload.append('avatar', form.avatar);
      const res = await axios.post('/api/users/signup', payload, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const userData = res.data.data.user;
      dispatch(loginAction(userData));
      navigate('/');
      showPopup && showPopup('Signup successful!', 'success');
    } catch (err) {
      showPopup && showPopup(err.response?.data?.message || 'Signup failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#18181b] p-4">
      <div className="w-full max-w-md bg-[#23232b] rounded-xl shadow-lg p-6">
        <div className="mb-6 text-center">
          <div className="text-xs text-gray-400 mb-1">Step {step} of 4</div>
          <h2 className="text-2xl font-bold text-white">{steps[step - 1]}</h2>
        </div>
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-1">Full Name</label>
                <input
                  name="fullname"
                  value={form.fullname}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Username</label>
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Choose a username"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Password</label>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <button
                type="button"
                className="w-full mt-4 py-2 rounded bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                onClick={nextStep}
                disabled={!form.fullname || !form.username || !form.email || !form.password}
              >
                Continue
              </button>
            </div>
          )}
          {step === 2 && (
            <div className="flex flex-col items-center space-y-4">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-purple-500 mb-2">
                <img src={form.avatarPreview} alt="Avatar Preview" className="object-cover w-full h-full" />
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="avatar-upload"
                onChange={e => handleImageChange(e, 'avatar')}
              />
              <div className="flex gap-2">
                <label htmlFor="avatar-upload" className="px-3 py-1 bg-gray-700 text-white rounded cursor-pointer hover:bg-gray-600">Select Image</label>
                <button type="button" className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600" onClick={() => handleUseDefault('avatar')}>Use Default</button>
              </div>
              <div className="flex w-full mt-6 gap-2">
                <button type="button" className="flex-1 py-2 rounded bg-gray-700 text-white hover:bg-gray-600" onClick={prevStep}>Back</button>
                <button type="button" className="flex-1 py-2 rounded bg-purple-600 text-white hover:bg-purple-700" onClick={nextStep}>Continue</button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="flex flex-col items-center space-y-4">
              <div className="w-full h-28 rounded-lg overflow-hidden border-4 border-purple-500 mb-2 flex items-center justify-center bg-gray-900">
                <img src={form.coverPreview} alt="Cover Preview" className="object-cover w-full h-full" />
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="cover-upload"
                onChange={e => handleImageChange(e, 'coverImage')}
              />
              <div className="flex gap-2">
                <label htmlFor="cover-upload" className="px-3 py-1 bg-gray-700 text-white rounded cursor-pointer hover:bg-gray-600">Select Image</label>
                <button type="button" className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600" onClick={() => handleUseDefault('coverImage')}>Use Default</button>
              </div>
              <div className="flex w-full mt-6 gap-2">
                <button type="button" className="flex-1 py-2 rounded bg-gray-700 text-white hover:bg-gray-600" onClick={prevStep}>Back</button>
                <button type="button" className="flex-1 py-2 rounded bg-purple-600 text-white hover:bg-purple-700" onClick={nextStep}>Continue</button>
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-gray-400 text-xs">Full Name</div>
                  <div className="text-white font-semibold">{form.fullname}</div>
                </div>
                <button type="button" className="text-blue-400 text-xs underline" onClick={() => setStep(1)}>Edit</button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-gray-400 text-xs">Username</div>
                  <div className="text-white font-semibold">{form.username}</div>
                </div>
                <button type="button" className="text-blue-400 text-xs underline" onClick={() => setStep(1)}>Edit</button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-gray-400 text-xs">Email</div>
                  <div className="text-white font-semibold">{form.email}</div>
                </div>
                <button type="button" className="text-blue-400 text-xs underline" onClick={() => setStep(1)}>Edit</button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-500">
                    <img src={form.avatarPreview} alt="Avatar Preview" className="object-cover w-full h-full" />
                  </div>
                  <span className="text-xs text-gray-400">{form.avatarIsDefault ? 'Default' : 'Custom'} Profile Picture</span>
                </div>
                <button type="button" className="text-blue-400 text-xs underline" onClick={() => setStep(2)}>Edit</button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-20 h-10 rounded-lg overflow-hidden border-2 border-purple-500">
                    <img src={form.coverPreview} alt="Cover Preview" className="object-cover w-full h-full" />
                  </div>
                  <span className="text-xs text-gray-400">{form.coverIsDefault ? 'Default' : 'Custom'} Cover Image</span>
                </div>
                <button type="button" className="text-blue-400 text-xs underline" onClick={() => setStep(3)}>Edit</button>
              </div>
              <div className="flex w-full mt-6 gap-2">
                <button type="button" className="flex-1 py-2 rounded bg-gray-700 text-white hover:bg-gray-600" onClick={prevStep}>Back</button>
                <button type="submit" className="flex-1 py-2 rounded bg-purple-600 text-white hover:bg-purple-700" disabled={submitting}>
                  {submitting ? 'Registering...' : 'Complete Registration'}
                </button>
              </div>
            </div>
          )}
        </form>
        <div className="mt-6 text-center text-gray-400 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:underline">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
