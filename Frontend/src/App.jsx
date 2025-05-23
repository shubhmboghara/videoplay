import { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import Loginpage from './pages/Loginpage'
import Video from './pages/Video'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Signuppage from './pages/Signup-page'
import ProtectedRoute from './components/ProtectedRoute'
import AuthLoader from './components/AuthLoader'




function App() {
  const [loading, setLoading] = useState(false)

  return !loading ? (
    <AuthLoader>

      <div className="min-h-screen flex flex-wrap content-between  items-center ">
        <div className="w-full">
          <Navbar />

          <main>

            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/login' element={<Loginpage />} />
              <Route path='signup' element={<Signuppage />} />
              <Route path="/video/:id" element={<Video />} />



            </Routes>
          </main>

        </div>
      </div>
      </AuthLoader>

        ) : null
}

        export default App
