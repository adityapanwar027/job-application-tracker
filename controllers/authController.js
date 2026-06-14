const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { unsubscribe } = require("../routes/authRoutes");

// Register User
const registerUser = asyncHandler ( async (req, res) => {
  
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({
            message: "Please provide all fields",
        });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 character",
      });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Please enter a valid mail",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User created successfully",
      user,
    });
});

// Login User
const loginUser = asyncHandler (async (req, res) => {
  
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Please provide email and password"
        })
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Candidate",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Candidate",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Login successfully",
      token,
    });
 
});


// Get user profile 
const getUserProfile = asyncHandler (async(req, res) => {
    
        
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
        return res.status(400).json({
            message: "User not found",
        });
    }

    res.status(200).json(user);
    
});

// Update User Profile API
const updateUserProfile = asyncHandler (async (req, res) => {
    
   const user = await User.findById(req.user.id);

   if (req.body.email) {
     const emailRegex = /^\S+@\.\S+$/;
     
     if (!emailRegex.test(req.body.email)) {
       return res.status(400).json({
        message: "Please provide a valid email"
       })
     }
   }
   
   if (!user) {
     return res.status(400).json({
      message: "User not found",
     });
   }

   user.name = req.body.name || user.name;
   user.email = req.body.email || user.email;

   if (req.body.password) {
     if (req.body.password.length < 6) {
       return res.status(400).json({
        message: "Password must be at least characters",
       });
     }
     user.password = await bcrypt.hash(req.body.password, 10);
   }

   await user.save();

   res.status(200).json({
    message: "Profile updated succesfully",
   });

});


module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};