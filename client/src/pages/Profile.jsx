import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/features/userSlice";
import Navbar from "../Components/Navbar";
import { isEmpty, isPasswordValid } from "../../helper/validation";
import { useNavigate } from "react-router-dom";

Modal.setAppElement("#root");

const Profile = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isNameInputClicked, setNameInputClicked] = useState(false);
  const [isPasswordInputClicked, setPasswordInputClicked] = useState(false);
  const [isProfileInputClicked, setProfileInputClicked] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userData);
  console.log(userData, "&&&&&");
  const [selectedFile, setSelectedFile] = useState(null);
  
  const [userdata, setUserdata] = useState({
    ...userData,
    currentpassword: "",
    newpassword: "",
  });
  
  const [previewImage, setPreviewImage] = useState(userData.profile);

  //errors state
  const [errorst, setErrorst] = useState({
    name: false,
    currentpassword: false,
    newpassword: false,
  });

  const [errdef, setErrDef] = useState({
    name: "",
    currentpassword: "",
    newpassword: "",
  });

  const handleEditClick = () => {
    setModalOpen(true);
  };

  const handleNameInputClick = () => {
    setNameInputClicked(true);
  };

  const handleProfileInputClick=()=>{
    setProfileInputClicked(true)
  }
  const handlePasswordInputClick=()=>{
    setPasswordInputClicked(true)
  }

  const handleChange = (event) => {
    setUserdata((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setSelectedFile(selectedFile);
    const previewImageUrl = URL.createObjectURL(selectedFile);
    setPreviewImage(previewImageUrl);
    console.log(previewImageUrl,"##########");
  };

  const handleCloseModal = () => {
    setErrorst({
      name: false,
      currentpassword: false,
      newpassword: false,
    });
    setErrDef({
      name: "",
      currentpassword: "",
      newpassword: "",
    });

    setModalOpen(false);
  };

  const handleSaveChanges = async () => {
    // console.log(userdata);
    try {
      const error = {
        name: false,
        currentpassword: false,
        newpassword: false,
      };

      const errordef = {
        name: "",
        currentpassword: "",
        newpassword: "",
      };
      let valid = true;

      if(isNameInputClicked){
        if (isEmpty(userdata.name)) {
          valid = false;
          error.name = true;
          errordef.name = "name can't be empty";
        }
      }

     if(isPasswordInputClicked){

      if (
        userdata.currentpassword.length == 0 ||
        userdata.newpassword.length == 0
      ) {
        if (isEmpty(userdata.newpassword)) {
          valid = false;
          error.newpassword = true;
          errordef.newpassword = "new password can't be empty";
          console.log("111");
        }
        if (isEmpty(userdata.currentpassword)) {
          console.log("****");
          valid = false;
          error.currentpassword = true;
          errordef.currentpassword = "current password can't be empty";
        }
      }
      if (isPasswordValid(userdata.newpassword)) {
        console.log("2222");
        valid = false;
        error.newpassword = true;
        errordef.newpassword = "password is too weak";
      }
      // console.log( error.newpassword);
      // console.log( error.newpassword,"$%^&");
      setErrorst(error);
      setErrDef(errordef);
     }

      if (valid) {
        if(isProfileInputClicked){
          const formData = new FormData();
        formData.append("profile", selectedFile);

        const imgResponse = await axios.post(
          "http://localhost:5000/uploadprofileimage/",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        }


        const response = await axios.post(
          "http://localhost:5000/editprofile",
          userdata
        );

        if (response.data.error) {
          console.log("response.data.error:",response.data.error);
          setErrDef((previous) => ({
            ...previous,
            currentpassword: response.data.error,
          }));
          setErrorst((prevErrors) => ({
            ...prevErrors,
            currentpassword: true
          }));
        } else if (response.data.success) {
          navigate("/home");
        }

        axios.get("http://localhost:5000/fetchuserdata/").then((response) => {
          dispatch(setUserData(response.data));
        });
      }
    } catch (error) {
      console.error("Error saving user data:", error);
      // setModalOpen(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto mt-24">
        <div className="flex justify-center items-center">
          <h2 className="text-4xl font-bold mb-4">PROFILE</h2>
        </div>
        <br></br>
        <br></br>
        <div className="relative mb-4 items-center justify-center flex">
          <img
            src={ userData.profile }
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover cursor-pointer"
          />
        </div>
        <br></br>
        <div className="mb-4 text-center ">
          <p className="text-lg">
            <span className="font-bold">Name:</span> {userData.name}
          </p>
          <br></br>
          <p className="text-lg">
            <span className="font-bold">Email:</span> {userData.email}
          </p>
          <br></br>
          <br></br>
          <br></br>

          <div className="flex items-center justify-center">
            <button
              onClick={handleEditClick}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
            >
              Edit Profile
            </button>
          </div>
        </div>

        <Modal
          isOpen={isModalOpen}
          onRequestClose={handleCloseModal}
          contentLabel="Edit Profile Modal"
          className="modal mt-20 p-6 bg-white rounded-md shadow-lg max-w-md mx-auto"
          overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-50 z-50"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">Edit Profile</h2>

          <div className="relative mb-4 items-center justify-center flex">
            <label className="cursor-pointer">
              <img
                src={previewImage}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover cursor-pointer"
              />

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                onClick={handleProfileInputClick}
              />
            </label>
          </div>

          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-600"
            >
              Name:
            </label>
            <input
              type="text"
              onChange={handleChange}
              onClick={handleNameInputClick}
              id="name"
              name="name"
              value={userdata.name}
              className={`mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300 ${
                errorst.name ? "border-red-500" : ""
              }`}
            />
            
            {errorst.name && (
              <p className="text-red-500 text-sm">{errdef.name}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-gray-600"
            >
              Current Password:
            </label>
            <input
              type="password"
              onChange={handleChange}
              onClick={handlePasswordInputClick}
              id="currentPassword"
              name="currentpassword"
              className={`mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300 ${
                errorst.currentpassword ? "border-red-500" : ""
              }`}
            />
            {console.log(errorst.currentpassword,errdef.currentpassword,"!@#$%^&")}
            {errorst.currentpassword && (
              <p className="text-red-500 text-sm">{errdef.currentpassword}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-600"
            >
              New Password:
            </label>
            <input
              type="password"
              onChange={handleChange}
              id="newPassword"
              name="newpassword"
              className={`mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300 ${
                errorst.newpassword ? "border-red-500" : ""
              }`}
            />
            {errorst.newpassword && (
              <p className="text-red-500 text-sm">{errdef.newpassword}</p>
            )}
          </div>

          <div className="flex items-center justify-around">
            <button
              onClick={handleSaveChanges}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300 mr-2"
            >
              Save Changes
            </button>
            <button
              onClick={handleCloseModal}
              className="text-blue-500 hover:text-blue-700 focus:outline-none"
            >
              Cancel
            </button>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default Profile;
