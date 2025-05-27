import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Home from "./pages/Home"
import UserLogin from './pages/userLogin'
import CoachLogin from './pages/coachLogin'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <div>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login/user' element={<UserLogin />}/>
          <Route path='/login/coach' element={<CoachLogin />}/>
        </Routes>
      </div>
    </Router>
  )
}

export default App
