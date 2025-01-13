import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import {setUserData} from './redux/features/userSlice'
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from './pages/Home'
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";


axios.defaults.withCredentials = true;

function App() {

  const dispatch = useDispatch()
  const userData = useSelector((state)=>state.user.userData)
  useEffect(()=>{
    axios.get('http://localhost:5000/fetchuserdata')
    .then((response) => {
      dispatch(setUserData(response.data));
    })
    .catch((error) => {
      console.error('Error fetching user data:', error);
    });
  },[]) 

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={userData?.role=='user' ? <Navigate to="/home" /> : <Navigate to="/login" />} />
          <Route path="/login" element={!userData ? <Login/> : userData.role=="admin" ? <Navigate to="/admin" /> : <Navigate to="/home" />  } />
          <Route path="/signup" element={!userData ? <Signup/> : <Navigate to="/home" />} />
          <Route path="/home" element={userData && userData?.role === "user" ? <Home /> : <Navigate to="/login" />} />
          <Route path="/profile" element={userData ?userData.role=='user'?  <Profile />:<Navigate to="/login" /> : <Navigate to="/" />}/>
          <Route path="/admin" element={userData?.role=='admin'?<Admin />:<Navigate to="/login" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
