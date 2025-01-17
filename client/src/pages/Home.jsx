import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {setUserData} from '../redux/features/userSlice'
import Navbar from "../Components/Navbar";
import {Navigate} from 'react-router-dom'
 


const HomeContent = () => {
  return (
    <div className="container mx-auto p-2 max-w-2xl mt-10">
      <h1 className="text-3xl font-bold mb-4 text-center text-customeLightBlue">Home Page</h1>
    </div>
  );
};



const Home = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userData);

  useEffect(() => {
    axios.get("http://localhost:5000/fetchuserdata").then((response) => {
      dispatch(setUserData(response.data));
    });
  }, [dispatch]);

  if (!userData || !userData.role) {
    return <Navigate to="/login" />;
  }

  return (
    <>
            <Navbar/>
            <HomeContent />
    </>
)
};

export default Home;
