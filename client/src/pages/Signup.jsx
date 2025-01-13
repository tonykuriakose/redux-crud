import React, { useState } from 'react';
import {isEmpty,isPasswordValid,isEmailValid,passwordcheck,} from '../../helper/validation';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/features/userSlice';
import { useNavigate } from 'react-router-dom';



const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [error, setError] = useState({
    emailred: false,
    namered: false,
    passwordred: false,
    confirmpasswordred: false,
  });
  const [errordef, seterrordef] = useState({
    emailerr: '',
    nameerr: '',
    passworderr: '',
    confirmpassworderr: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [userData, setUserDataLocal] = useState({
    name: '',
    email: '',
    Password: '',
    confirmpassword: '',
  });

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword((prevShowPassword) => !prevShowPassword);
    } else if (field === 'confirmpassword') {
      setShowConfirmPassword((prevShowConfirmPassword) => !prevShowConfirmPassword);
    }
  };

  const handleChange = (event) => {
    setUserDataLocal({
      ...userData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    let errors = {
      emailred: false,
      namered: false,
      passwordred: false,
      confirmpasswordred: false,
    };

    let errorMessages = {
      emailerr: '',
      nameerr: '',
      passworderr: '',
      confirmpassworderr: '',
    };

    if (isEmpty(userData.email)) {
      errors.emailred = true;
      errorMessages.emailerr = "Email can't be empty";
    } else if (isEmailValid(userData.email)) {
      errors.emailred = true;
      errorMessages.emailerr = 'Enter a valid email';
    }

    if (isEmpty(userData.name)) {
      errors.namered = true;
      errorMessages.nameerr = "Name can't be empty";
    }
    if (isEmpty(userData.Password)) {
      errors.passwordred = true;
      errorMessages.passworderr = "Password can't be empty";
    } else if (isPasswordValid(userData.Password)) {
      errors.passwordred = true;
      errorMessages.passworderr = 'Password is too weak';
    }

    if (isEmpty(userData.confirmpassword)) {
      errors.confirmpasswordred = true;
      errorMessages.confirmpassworderr = "Confirm password can't be empty";
    } else if (passwordcheck(userData.Password, userData.confirmpassword)) {
      errors.confirmpasswordred = true;
      errorMessages.confirmpassworderr = "Passwords don't match";
    }

    setError(errors);
    seterrordef(errorMessages);

    if (!errors.emailred && !errors.namered && !errors.passwordred && !errors.confirmpasswordred) {
      try {
        const response = await axios.post('http://localhost:5000/signup', userData);
        if (response.data.success) {
          const userResponse = await axios.get('http://localhost:5000/fetchuserdata');
          dispatch(setUserData(userResponse.data));
          navigate('/home');
        } else if (response.data.error) {
          setError((prev) => ({
            ...prev,
            emailred: true,
          }));
          seterrordef((prev) => ({
            ...prev,
            emailerr: response.data.error,
          }));
        }
      } catch (error) {
        console.error('Signup error:', error);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-4xl font-bold mb-4 text-center">Signup</h2>
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Name:</label>
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              placeholder="Name"
            />
            {error.namered && <div className="text-red-500 mt-1">{errordef.nameerr}</div>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Email:</label>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              placeholder="Email"
            />
            {error.emailred && <div className="text-red-500 mt-1">{errordef.emailerr}</div>}
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-600">Password:</label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="Password"
              value={userData.Password}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              placeholder="Password"
            />
            {error.passwordred && <div className="text-red-500 mt-1">{errordef.passworderr}</div>}
            <button
              type="button"
              className="absolute right-2 bottom-2"
              onClick={() => togglePasswordVisibility('password')}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'} 
            </button>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-600">Confirm Password:</label>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmpassword"
              value={userData.confirmpassword}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              placeholder="Confirm Password"
            />
            {error.confirmpasswordred && (
              <div className="text-red-500 mt-1">{errordef.confirmpassworderr}</div>
            )}
            <button
              type="button"
              className="absolute right-2 bottom-2"
              onClick={() => togglePasswordVisibility('confirmpassword')}
            >
              {showConfirmPassword ? '👁️' : '👁️‍🗨️'}👁️
            </button>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Signup
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate('/login')}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;

