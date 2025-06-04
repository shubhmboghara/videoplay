import React, { useState, useEffect } from 'react';
import { updateVideo } from '../hooks/video';
import { Button, Input } from './index';

const EditVideoModal = ({ isOpen, onClose, video, onVideoUpdated }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [thumbnail, setThumbnail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (video) {
            setTitle(video.title || '');
            setDescription(video.description || '');
            setThumbnail(null); // Reset thumbnail input
        }
    }, [video]);

    const handleFileChange = (e) => {
        setThumbnail(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!title || !description) {
            setError('Please fill in all required fields.');
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        if (thumbnail) {
            formData.append('thumbnail', thumbnail);
        }

        try {
            console.log("Editing video with ID:", video._id);
            console.log("Form Data:", Object.fromEntries(formData.entries()));
            await updateVideo(video._id, formData);
            onVideoUpdated();
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to update video.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !video) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-lg w-full max-w-md text-white relative">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl">&times;</button>
                <div className="flex items-center mb-4">
                    <div className="bg-[#262626] p-2 rounded-full mr-3">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 6C12.5523 6 13 6.44772 13 7V11H17C17.5523 17 18 17.4477 18 18C18 18.5523 17.5523 19 17 19H7C6.44772 19 6 18.5523 6 18C6 17.4477 6.44772 17 7 17H11V7C11 6.44772 11.4477 6 12 6Z" fill="currentColor"/>
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold">Edit video</h2>
                </div>
                <p className="text-gray-400 mb-4">Share where you've worked on your profile.</p>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4 border border-gray-600 p-4 rounded-lg text-center cursor-pointer">
                        <label htmlFor="thumbnail-upload" className="block text-gray-400 mb-2">
                            <svg className="mx-auto mb-2" width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 6C12.5523 6 13 6.44772 13 7V11H17C17.5523 17 18 17.4477 18 18C18 18.5523 17.5523 19 17 19H7C6.44772 19 6 18.5523 6 18C6 17.4477 6.44772 17 7 17H11V7C11 6.44772 11.4477 6 12 6Z" fill="currentColor"/>
                            </svg>
                            Click to upload or drag and drop
                        </label>
                        <p className="text-sm text-gray-500">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                        <input
                            id="thumbnail-upload"
                            type="file"
                            name="thumbnail"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-gray-400 text-sm font-bold mb-2">Title*</label>
                        <Input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="What is your title?"
                            className="bg-[#262626] text-white border border-gray-600 rounded-lg py-2 px-3 w-full leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-gray-400 text-sm font-bold mb-2">Description*</label>
                        <Input
                            id="description"
                            type="textarea"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g. I joined Stripe's Customer Success team to help them scale their checkout product. I focused mainly on onboarding new customers and resolving complaints."
                            rows="4"
                            className="bg-[#262626] text-white border border-gray-600 rounded-lg py-2 px-3 w-full leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                        <Button
                            type="button"
                            onClick={onClose}
                            className="bg-transparent hover:bg-gray-700 text-white border border-gray-600 py-2 px-4 rounded-lg"
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-[#AE7EEB] hover:bg-[#9B6ADF] text-white py-2 px-4 rounded-lg"
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Finish'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditVideoModal;