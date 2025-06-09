import React, { useState, useEffect } from 'react';
import { updateVideo } from '../hooks/video';
import { Button, Input } from './index';

const EditVideoModal = ({ isOpen, onClose, video, onVideoUpdated }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [thumbnail, setThumbnail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);

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
        setUploadProgress(0);



        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        if (thumbnail) {
            formData.append('thumbnail', thumbnail);
        }

        try {
            await updateVideo(video._id, formData, (progressEvent) => {
                const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadProgress(percent);
            });
            onVideoUpdated();
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to update video.');
        } finally {
            setLoading(false);
            setUploadProgress(0);
        }
    };

    if (!isOpen || !video) return null;

    return (


        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-2">
            <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-lg w-full max-w-md text-white relative  lg:left-25 top-10">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl">&times;</button>
                <div className="flex items-center mb-4">
                    <div className="bg-[#262626] p-2 rounded-full mr-3">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M12 6C12.5523 6 13 6.44772 13 7V11H17C17.5523 17 18 17.4477 18 18C18 18.5523 17.5523 19 17 19H7C6.44772 19 6 18.5523 6 18C6 17.4477 6.44772 17 7 17H11V7C11 6.44772 11.4477 6 12 6Z" fill="currentColor" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold">Edit video</h2>
                </div>
                <p className="text-gray-400 mb-4">Update your video details and thumbnail.</p>
                {error && <p className="text-red-500 mb-4">{error}</p>}

                {/* Progress Bar */}
                {loading && (
                    <div className="w-full bg-gray-800 rounded-full h-3 mb-4 overflow-hidden">
                        <div
                            className="bg-purple-600 h-full transition-all duration-300 ease-out"
                            style={{ width: `${uploadProgress}%` }}
                        />
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4 border border-gray-600 p-4 rounded-lg text-center cursor-pointer">
                        <label htmlFor="thumbnail-upload" className="block text-gray-400 mb-2">
                            <svg className="mx-auto mb-2" width="48" height="48" viewBox="0 0 24 24" fill="none">
                                <path d="M12 6C12.5523 6 13 6.44772 13 7V11H17C17.5523 17 18 17.4477 18 18C18 18.5523 17.5523 19 17 19H7C6.44772 19 6 18.5523 6 18C6 17.4477 6.44772 17 7 17H11V7C11 6.44772 11.4477 6 12 6Z" fill="currentColor" />
                            </svg>
                            Click to upload or drag and drop
                        </label>
                        <p className="text-sm text-gray-500">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                        <Input
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
                            placeholder="Enter your video title"
                            className="bg-[#262626] text-white border border-gray-600 rounded-lg py-2 px-3 w-full"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="description" className="block text-gray-400 text-sm font-bold mb-2">Description*</label>
                        <Input
                            id="description"
                            type="textarea"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter video description"
                            rows="4"
                            className="bg-[#262626] text-white border border-gray-600 rounded-lg py-2 px-3 w-full"
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
                            className="bg-[#6e2ec1] hover:bg-[#9B6ADF] text-white py-2 px-4 rounded-lg"
                            disabled={loading}
                        >
                            {loading ? `Updating (${uploadProgress}%)` : 'Finish'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditVideoModal;
