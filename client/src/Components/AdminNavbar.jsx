import  React, { useEffect, useState } from "react";
import { setUserData } from "../redux/features/userSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";

const AdminNavbar = ({ users, setUser, setAddModalOpen,setSearch }) => {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const [originalUserData, setOriginalUserData] = useState(users);
  
  // useEffect(()=>{
  //   setOriginalUserData(users)
  // },[users])

  // let a=[...users]
  // console.log(a,"789456123");
  // console.log("🚀 ~ Admin#########Navbar ~ users:", users)
  // console.log("🚀 ~ AdminNavbar ~ or&&&&&&&&&iginalUserData:", originalUserData)

  const handleSearch = (e) => {
    const searchTerm = e.target.value.trim().toLowerCase();
    console.log("handlesearch:",searchTerm);
    // const filteredUsers = originalUserData.filter((user) =>
    //   user.name.toLowerCase().includes(searchTerm)
    // );
    // console.log(filteredUsers,"@#$%^&");
    // setUser(filteredUsers);
    setSearch(searchTerm)
  };

  const handleLogout = () => {
    axios.get("http://localhost:5000/logout").then(() => {
      dispatch(setUserData(null));
      navigate("/login");
    });
  };

  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <div className="text-white font-bold text-2xl">Admin Dashboard</div>
        </div>

        <div className="flex items-center">
          <div className="flex justify-center items-center px-3 py-1">
            <input
              type="text"
              placeholder="Search users"
              onChange={handleSearch}
              className="ml-4 px-2 py-1 border rounded focus:outline-none focus:border-blue-500 w-full"
            />
          </div>

          <button
            onClick={() => setAddModalOpen(true)}
            className="bg-gray-500 text-white px-3 py-1 rounded mr-4"
          >
            Add User
          </button>

          <button
            className="bg-red-500 text-white px-3 py-1 rounded"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
