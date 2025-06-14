import React, { useState, useEffect } from 'react';
import { publishAVideo } from '../hooks/video';

const UploadVideoModal = ({ isOpen, onClose, onVideoUploaded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [uploadedSize, setUploadedSize] = useState('0 MB');

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => (document.body.style.overflow = 'auto');
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (e.target.name === 'video' && file?.type.startsWith('video/')) {
      setVideoFile(file);
      if (!title && file.name) {
        setTitle(file.name.split('.').slice(0, -1).join('.'));
      }
      setError('');
    } else if (e.target.name === 'thumbnail' && file?.type.startsWith('image/')) {
      setThumbnail(file);
      setError('');
    } else {
      setError('Invalid file type selected.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('video/')) {
      setVideoFile(file);
      if (!title && file.name) {
        setTitle(file.name.split('.').slice(0, -1).join('.'));
      }
      setError('');
    } else {
      setError('Please drop a valid video file.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setProgress(0);
    setUploadedSize('0 MB');

    if (!videoFile) {
      setError('Please select a video file.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('video', videoFile);
    if (thumbnail) formData.append('thumbnail', thumbnail);

    try {
      await publishAVideo(formData, (event) => {
        const percent = Math.round((event.loaded * 100) / event.total);
        const sizeMB = (event.loaded / (1024 * 1024)).toFixed(2);
        const sizeGB = (event.loaded / (1024 * 1024 * 1024)).toFixed(2);
        setProgress(percent);
        setUploadedSize(parseFloat(sizeMB) > 1000 ? `${sizeGB} GB` : `${sizeMB} MB`);
      });

      onVideoUploaded();
      handleClose();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to upload video.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setVideoFile(null);
    setThumbnail(null);
    setLoading(false);
    setError('');
    setProgress(0);
    setUploadedSize('0 MB');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-2 xl:left-50 ">


      <div className="w-full max-w-3xl bg-[#1a1a1a] rounded-lg p-6 relative mx-4 sm:mx-6 md:mx-auto max-h-[85vh] modal-scroll  overflow-y-auto  mt-15 ">
        <button
          onClick={handleClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-white text-2xl"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">Upload Video</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-400 mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              className="w-full p-3 rounded bg-[#2a2a2a] text-white border border-[#3a3a3a] focus:outline-none focus:border-purple-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-400 mb-2">
              Description
            </label>
            <textarea
              id="description"
              className="w-full p-3 rounded bg-[#2a2a2a] text-white border border-[#3a3a3a] focus:outline-none focus:border-purple-500 h-24"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter video description"
            />
          </div>

          <label
            htmlFor="video-upload"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="mb-4 block border border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-purple-500 transition-colors duration-200 cursor-pointer"
          >
            <p className="text-gray-400 mb-2">
              Drag and drop your video here or <span className="text-purple-500 underline">click to upload</span>
            </p>
            <input
              id="video-upload"
              name="video"
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {videoFile && <p className="text-white mt-2">Selected: {videoFile.name}</p>}
          </label>

          {videoFile && (
            <div className="mb-4">
              <video
                src={URL.createObjectURL(videoFile)}
                controls
                className="w-full max-h-64 object-cover rounded-lg"
              />
            </div>
          )}

          <label
            htmlFor="thumbnail-upload"
            className="mb-4 block border border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-purple-500 transition-colors duration-200 cursor-pointer"
          >
            <p className="text-gray-400 mb-2">Thumbnail (optional)</p>
            <input
              id="thumbnail-upload"
              name="thumbnail"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {thumbnail && (
              <div className="mt-4">
                <img
                  src={URL.createObjectURL(thumbnail)}
                  alt="Thumbnail preview"
                  className="w-full max-h-48 object-cover rounded"
                />
              </div>
            )}
          </label>

          {loading && (
            <div className="mb-4">
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-purple-600 h-2.5 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-gray-300 text-sm mt-1">
                {progress}% uploaded ({uploadedSize})
              </p>
            </div>
          )}

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <button
            type="submit"
            className="w-full bg-purple-600 text-white p-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-200"
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Upload Video'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadVideoModal;
