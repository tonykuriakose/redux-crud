const User = require("../models/user");
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');


const fetchUserDetails = async (req, res) => {
  try {
    const { search } = req.query;
    let query = { role: { $ne: "admin" } };
    if (search) {
      query.name = { $regex: new RegExp(search, 'i') };
    }
    const data = await User.find(query);

    res.json({ data: data });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error in the fetchuser to admin',
    });
  }
};

//delete user
const deleteUser = async (req, res) => {
  try {
    const id = req.body.id;

    if (!id) {
      return res
        .status(400)
        .json({ error: "User ID is required in the request body" });
    }
    await User.deleteOne({ _id: id });
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

///edit user
const editUser = async (req, res) => {
  try {
    if (req.body.value.length) {
      // console.log(req.body,"********");
      const id = req.body.user_id;
      console.log(id);
      const newvalue = req.body.value;
      await User.updateOne({ _id: id }, { $set: { name: newvalue } });
    }
    res.json({ success: true });
  } catch (error) {
    console.log(error);
  }
};
 
// add user
const addUser = async (req, res) => {
  try {
    console.log("reached");
    const Existuser = await User.findOne({ email: req.body.email });
    if (Existuser) {
      return res.json({ error: "user already exist" });
    }
    const salt = await bcrypt.genSalt();

    const hashedpassword = await bcrypt.hash(req.body.Password, salt);
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      role: "user",
      password: hashedpassword,
      profile: "./src/assets/profileimg.jpg",
    });
    const savedUser = await newUser.save();
    res.json({ success: true });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { fetchUserDetails, deleteUser, editUser, addUser };
