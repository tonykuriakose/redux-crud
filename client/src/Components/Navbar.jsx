import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUserData } from "../redux/features/userSlice";
import axios from "axios";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user.userData);
  const logout = () => {
    axios.get('http://localhost:5000/logout/')
      .then(() => {
        dispatch(setUserData(null));
        navigate('/login');
      })
      .catch((error) => {
        console.error('Logout error:', error);
      });
  };
  return (
    <>
      <nav className="bg-blue-500 p-5 flex justify-between items-center">
        <div className="flex items-center">
        {userData.profile && (
            <img
              src={userData.profile}
              alt="Profile"
              className="rounded-full h-8 w-8 mr-2"
            />
          )}
          <input type="checkbox" id="check" className="hidden" />
          <label htmlFor="check" className="checkbtn">
            <i className="fas fa-bars text-white"></i>
          </label>
          <label className="logo text-white text-2xl font-bold">{userData.name}</label>
        </div>
        <div className="flex items-center space-x-4">
          <span onClick={()=>navigate('/home')} className="text-white cursor-pointer">Home</span>
          <span onClick={()=>navigate('/profile')} className="text-white cursor-pointer">Profile</span>
          <button onClick={logout} className="text-white text-xl cursor-pointer">Logout</button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
