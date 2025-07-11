import { useState } from 'react'
import './App.css'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Home from "./pages/Home"
import UserLogin from './pages/userLogin'
import CoachLogin from './pages/coachLogin'
import UserRegistration from './pages/UserRegistration'
import VODPage from './pages/VODpage'
import Explore from './pages/ExplorePage'
import ErrPage from './pages/404'
function App() {

  return (
    <Router>
      <div>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login/user' element={<UserLogin />}/>
          {/* <Route path='/login/coach' element={<CoachLogin />}/> */}
          <Route path='registration/user' element={<UserRegistration/>}/>
          <Route path='/VODS' element={<VODPage/>}/>
          <Route path='/explore' element={<Explore/>}></Route>
          <Route path='*' element={<ErrPage/>}></Route>
        </Routes>
      </div>
    </Router>
  ) 
}

export default App
