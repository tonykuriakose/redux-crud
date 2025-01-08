const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const User = require("../models/user");

const postSignup = async (req, res) => {
  try {
    const Existuser = await User.findOne({ email: req.body.email });
    if (Existuser) {
      return res.json({ error: "user already exists" });
    } else {
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(req.body.Password, salt);

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        role: "user",
        password: hashedPassword,
        profile: "./src/assets/profileimg.jpg",
      });

      const savedUser = await newUser.save();
      const JWT_SECRET = process.env.JWT_SECRET;

      const token = jwt.sign({ user: savedUser._id }, JWT_SECRET);

      res
        .cookie("token", token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24,
        })
        .json({ success: true });
    }
  } catch (error) {
    console.error("error while signup:", error);
  }
};


const login = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (!existingUser) {
      return res.json({ emailerr: "User not found" });
    }
    const passwordCorrect =await bcrypt.compare(
      req.body.password,
      existingUser.password
    );

    if (!passwordCorrect) {
      return res.json({ passworderr: "Wrong password" });
    } else {
      const token = jwt.sign(
        {
          user: existingUser._id,
        },
        process.env.JWT_SECRET,{
          expiresIn:"30d"
        }
      );

      res
        .cookie("token", token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24,
        })
        .json({ success: true });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const logout = (req, res) => {
  res.clearCookie("token").send({ something: "here" });
};



const fetchData = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized1" });
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) {
      return res.status(401).json({ error: "Unauthorized2" });
    }
    const data = await User.findById(verified.user);
    if (!data) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(data);
  } catch (error) {
    console.error("error while fetch data:", error);
  }
};


const editProfile = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    const userId = verified.user; 

    const { name, currentpassword, newpassword } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let updateFields = { name };

    if (currentpassword && newpassword) {
      const passwordCorrect = await bcrypt.compare(currentpassword, user.password);
      if (!passwordCorrect) {
        return res.status(400).json({ error: "Incorrect current password" });
      }
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(newpassword, salt);
    }

    await User.updateOne({ _id: userId }, { $set: updateFields });
    res.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error during profile update:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const uploadImage = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    const userId = verified.user; 

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const oldImage = user.profile;
    if (oldImage && oldImage !== "./src/assets/profileimg.jpg") {
      const imageName = path.basename(oldImage);
      const imagePath = path.join(__dirname, "../public/profileimages", imageName);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const newImagePath = `${process.env.IMAGE_PATH}profileimages/${req.file.filename}`;
    user.profile = newImagePath;
    await user.save();

    res.json({ success: true, message: "Profile image updated", imagePath: newImagePath });
  } catch (error) {
    console.error("Error during image upload:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = {
  postSignup,
  fetchData,
  login,
  logout,
  editProfile,
  uploadImage,
};
