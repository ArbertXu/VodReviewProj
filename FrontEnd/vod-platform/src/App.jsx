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
import ProfilePage from "./pages/profile"
import VodPost from "./pages/VodPost"
import { ToastContainer, toast } from 'react-toastify'; 
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
          <Route path="/profile/:userID" element={<ProfilePage />} />
          <Route path="/vod/:vod_id" element={<VodPost/>} />
        </Routes>
        <ToastContainer/>
      </div>
    </Router>
  ) 
}

export default App
