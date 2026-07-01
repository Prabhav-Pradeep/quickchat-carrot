import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import {Toaster} from "react-hot-toast"
import { AuthContext } from '../context/AuthContext'
import bgImage from './assets/bgImage.svg';

const App = () => {
  const { authUser, loading } = useContext(AuthContext); // ⬅ pull loading too

  if (loading) {
    return (
      <div className='h-screen w-screen flex items-center justify-center bg-black text-white'>
        Loading...
      </div>
    );
  }

  return (
    <div 
    style={{ backgroundImage: `url(${bgImage})` }}
    className = 'bg-contain'>
      <Toaster/>
      <Routes>
        <Route path = '/' element = {authUser ? <HomePage/> : <Navigate to = "/login"></Navigate>}/>
        <Route path = '/login' element = {!authUser ? <LoginPage/> : <Navigate to = "/"></Navigate>}/>
        <Route path = '/profile' element = {authUser ? <ProfilePage/> : <Navigate to = "/login"/>}/>
      </Routes>
    </div>
  )
}
export default App