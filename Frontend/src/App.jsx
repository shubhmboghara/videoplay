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
import LikedVideos from './pages/LikedVideos'
import VideosHistory from './pages/VideosHistory'
import Subscriptions from './pages/Subscriptions'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'




function App() {
  const [loading, setLoading] = useState(false)

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
              <Route path='/' element={<Home />} />
              <Route path='/login' element={<Loginpage />} />
              <Route path='/signup' element={<Signuppage />} />
              <Route path="/video/:id" element={<Video />} />
              <Route path="/video/:id" element={<VideoDetails />} />
              <Route path="/likedvideos" element={<ProtectedRoute><LikedVideos /></ProtectedRoute>} />
              <Route path="/history" element={<ProtectedRoute><VideosHistory /></ProtectedRoute>} />
              <Route path="/subscriptions" element={<ProtectedRoute><Subscriptions /></ProtectedRoute>} />
              <Route path="/my-content" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

             

            </Routes>

          </main>

        </div>
      </div>
    </AuthLoader>

  ) : null
}

export default App
