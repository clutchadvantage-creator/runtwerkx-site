import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AegisOne from './pages/AegisOne'
import FileRouter from './pages/FileRouter'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/aegisone" element={<AegisOne />} />
      <Route path="/file-router" element={<FileRouter />} />
    </Routes>
  )
}