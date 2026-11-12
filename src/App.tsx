import { Routes, Route } from 'react-router-dom'
import { Navbar, NuevaPublicacion } from './components/index'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Register  from './pages/Register'
import PostDetail from './pages/PostDetail'

function App() {
  return (
    <div>
      <main className="app-main">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/register" element={<Register />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/crear-post" element={<NuevaPublicacion/>} />
        </Routes>
      </main>
    </div>
  )
}

export default App