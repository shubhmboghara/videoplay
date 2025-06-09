
import React, { useState } from 'react';
import DefaultAvatar from '../assets/DefaultAvatar.png';
import DefaultCover from '../assets/folder.png';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login as loginAction } from '../redux/slices/authSlice';
import { Input, Button } from './index';

const steps = ['Account Information', 'Upload Profile Picture', 'Upload Cover Image', 'Review'];

export default function MultiStepSignup({ showPopup }) {
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        fullname: '',
        username: '',
        email: '',
        password: '',
        avatar: null,
        avatarPreview: DefaultAvatar,
        avatarIsDefault: true,
        coverImage: null,
        coverPreview: DefaultCover,
        coverIsDefault: true,
    });

    const updateForm = (updates) => setForm((prev) => ({ ...prev, ...updates }));

    const handleChange = (e) => updateForm({ [e.target.name]: e.target.value });

    const handleImageChange = (e, type) => {
        const file = e.target.files[0];
        const isAvatar = type === 'avatar';

        if (file) {
            if (!file.type.startsWith('image/')) {
                showPopup && showPopup('Only image files are allowed', 'error');
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                showPopup && showPopup('Image size should be under 2MB', 'error');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                updateForm({
                    [type]: file,
                    [`${isAvatar ? 'avatarPreview' : 'coverPreview'}`]: reader.result,
                    [`${isAvatar ? 'avatarIsDefault' : 'coverIsDefault'}`]: false,
                });
            };
            reader.readAsDataURL(file);
        } else {
            updateForm({
                [type]: null,
                [`${isAvatar ? 'avatarPreview' : 'coverPreview'}`]: isAvatar ? DefaultAvatar : DefaultCover,
                [`${isAvatar ? 'avatarIsDefault' : 'coverIsDefault'}`]: true,
            });
        }
    };

    const handleUseDefault = (type) => {
        const isAvatar = type === 'avatar';
        updateForm({
            [type]: null,
            [`${type}Preview`]: isAvatar ? DefaultAvatar : DefaultCover,
            [`${type}IsDefault`]: true,
        });
    };

    const nextStep = () => setStep((s) => Math.min(s + 1, 4));
    const prevStep = () => setStep((s) => Math.max(s - 1, 1));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const { fullname, username, email, password, avatar, coverImage } = form;
            if (!fullname || !username || !email || !password) {
                showPopup && showPopup('All fields are required', 'error');
                setSubmitting(false);
                return;
            }

            const payload = new FormData();
            payload.append('fullname', fullname);
            payload.append('username', username);
            payload.append('email', email);
            payload.append('password', password);
            if (avatar) payload.append('avatar', avatar);
            if (coverImage) payload.append('coverImage', coverImage);

            const res = await axios.post('/api/users/signup', payload, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const userData = res.data.data.user;
            dispatch(loginAction(userData));
            navigate('/');
            showPopup && showPopup('Signup successful!', 'success');
        } catch (err) {
            const message =
                err.response?.data?.errors?.[0]?.msg ||
                err.response?.data?.message ||
                'Signup failed';
            showPopup && showPopup(message, 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#18181b] p-4">
            <div className="w-full max-w-md bg-[#23232b] rounded-xl shadow-lg p-6">
                <div className="flex gap-2 mb-4">
                    {steps.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1 flex-1 rounded ${i < step ? 'bg-purple-600' : 'bg-gray-600'
                                }`}
                        ></div>
                    ))}
                </div>

                <div className="text-center mb-6">
                    <div className="text-xs text-gray-400 mb-1">Step {step} of 4</div>
                    <h2 className="text-2xl font-bold text-white">{steps[step - 1]}</h2>
                </div>

                <form onSubmit={handleSubmit}>
                    {step === 1 && (
                        <div className="space-y-4">
                            <Input label="Full Name" name="fullname" value={form.fullname} onChange={handleChange} placeholder="Your full name" required />
                            <Input label="Username" name="username" value={form.username} onChange={handleChange} placeholder="Choose a username" required />
                            <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email address" required />
                            <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Choose a password" required />

                            <Button
                                type="button"
                                className="w-full mt-4 py-2 rounded bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                                onClick={nextStep}
                                disabled={!form.fullname || !form.username || !form.email || !form.password}
                            >
                                Continue

                            </Button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="flex flex-col items-center space-y-4">
                            <img src={form.avatarPreview} alt={form.avatarIsDefault ? 'Default Avatar' : 'User Avatar'} className="w-24 h-24 rounded-full border-4 border-purple-500 object-cover" />
                            <Input id="avatar-upload" type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'avatar')} hidden />
                            <div className="flex gap-2">
                                <label htmlFor="avatar-upload" className="px-3 py-1 bg-gray-700 text-white rounded cursor-pointer hover:bg-gray-600">Select Image</label>
                                <button type="button" onClick={() => handleUseDefault('avatar')} className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600">Use Default</button>
                            </div>
                            <div className="flex w-full mt-6 gap-2">
                                <Button type="button" className="flex-1 py-2 rounded bg-gray-700 text-white hover:bg-gray-600 transition-colors" onClick={prevStep} variant="secondary">Back</Button>
                                <Button type="button" className="flex-1 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                                    onClick={nextStep}>Continue</Button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="flex flex-col items-center space-y-4">
                            <img src={form.coverPreview} alt={form.coverIsDefault ? 'Default Cover' : 'Custom Cover'} className="w-full h-28 object-cover border-4 border-purple-500 rounded-lg" />
                            <Input id="cover-upload" type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'coverImage')} hidden />
                            <div className="flex gap-2">
                                <label htmlFor="cover-upload" className="px-3 py-1 bg-gray-700 text-white rounded cursor-pointer hover:bg-gray-600">Select Image</label>
                                <button type="button" onClick={() => handleUseDefault('coverImage')} className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600">Use Default</button>
                            </div>
                            <div className="flex w-full mt-6 gap-2">
                                <Button type="button" className="flex-1 py-2 rounded bg-gray-700 text-white hover:bg-gray-600 transition-colors" onClick={prevStep} variant="secondary">Back</Button>
                                <Button type="button" className="flex-1 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                                    onClick={nextStep}>Continue</Button>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-6">
                            <ReviewItem label="Full Name" value={form.fullname} editStep={() => setStep(1)} />
                            <ReviewItem label="Username" value={form.username} editStep={() => setStep(1)} />
                            <ReviewItem label="Email" value={form.email} editStep={() => setStep(1)} />

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <img src={form.avatarPreview} alt="Avatar" className="w-12 h-12 rounded-full border-2 border-purple-500 object-cover" />
                                    <span className="text-xs text-gray-400">{form.avatarIsDefault ? 'Default' : 'Custom'} Avatar</span>
                                </div>
                                <button type="button" onClick={() => setStep(2)} className="text-blue-400 text-xs underline">Edit</button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <img src={form.coverPreview} alt="Cover" className="w-20 h-10 rounded border-2 border-purple-500 object-cover" />
                                    <span className="text-xs text-gray-400">{form.coverIsDefault ? 'Default' : 'Custom'} Cover</span>
                                </div>
                                <button type="button" onClick={() => setStep(3)} className="text-blue-400 text-xs underline">Edit</button>
                            </div>

                            <div className="flex w-full mt-6 gap-2">
                                <Button type="button" className="flex-1 py-2 rounded bg-gray-700 text-white hover:bg-gray-600 transition-colors" onClick={prevStep} variant="secondary">Back</Button>
                                <Button type="submit" className="flex-1 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                                    disabled={submitting}>
                                    {submitting ? 'Registering...' : 'Complete Registration'}
                                </Button>
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

const ReviewItem = ({ label, value, editStep }) => (
    <div className="flex items-center justify-between">
        <div>
            <div className="text-gray-400 text-xs">{label}</div>
            <div className="text-white font-semibold">{value}</div>
        </div>
        <button type="button" onClick={editStep} className="text-blue-400 text-xs underline">Edit</button>
    </div>
);

