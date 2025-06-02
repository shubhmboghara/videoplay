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
              <Route path="/likedvideos" element={<LikedVideos />} />
              <Route path="/history" element={<VideosHistory />} />





            </Routes>

          </main>

        </div>
      </div>
    </AuthLoader>

  ) : null
}

export default App
