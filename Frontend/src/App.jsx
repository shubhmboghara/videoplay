import { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import Loginpage from './pages/Loginpage'
import Video from './pages/Video'
import './App.css'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Home from './pages/Home'
import Signuppage from './pages/Signup-page'
import AuthLoader from './components/AuthLoader'
import { VideoDetails, Sidebar } from './components'
import Errorpopups from './components/Errorpopups'
import LikedVideos from './pages/LikedVideos'
import VideosHistory from './pages/VideosHistory'
import Subscriptions from './pages/Subscriptions'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import PlaylistsPage from './pages/PlaylistsPage'




function App() {
  const [loading, setLoading] = useState(false);
  const [popupMessage, setPopupMessage] = useState(null);
  const [popupType, setPopupType] = useState('error'); 

  const showPopup = (message, type = 'error') => {
    setPopupMessage(message);
    setPopupType(type);
  };

  const closePopup = () => {
    setPopupMessage(null);
  };

  return !loading ? (
    <AuthLoader>

      <div className="min-h-screen flex flex-wrap content-between  items-center ">
        <div className="w-full">
          <Navbar />
          <div className="mb-20 mt-16">
            <Sidebar />

          </div>

          <main>

            <Routes>

              <Route path='/' element={<Home showPopup={showPopup} />} />
              <Route path='/login' element={<Loginpage showPopup={showPopup} />} />
              <Route path='/signup' element={<Signuppage showPopup={showPopup} />} />
              <Route path="/video/:id" element={<Video showPopup={showPopup} />} />
              <Route path="/video/:id" element={<VideoDetails showPopup={showPopup} />} />
              <Route path="/likedvideos" element={<ProtectedRoute>  <LikedVideos showPopup={showPopup} /></ProtectedRoute>} />
              <Route path="/history" element={<ProtectedRoute>  <VideosHistory showPopup={showPopup} /></ProtectedRoute>} />
              <Route path="/subscriptions" element={<ProtectedRoute>  <Subscriptions showPopup={showPopup} /></ProtectedRoute>} />
              <Route path="/my-content" element={<ProtectedRoute>  <Dashboard showPopup={showPopup} /></ProtectedRoute>} />
              <Route path="/playlists" element={<ProtectedRoute>  <PlaylistsPage showPopup={showPopup} /></ProtectedRoute>} />

            </Routes>

          </main>

        </div>
      </div>
      <Errorpopups message={popupMessage} type={popupType} onClose={closePopup} />
    </AuthLoader>

  ) : null
}

export default App
