const asyncHandler = require("express-async-handler");
const User = require("../models/userModels");
const bcrypt = require("bcrypt");
require('dotenv').config();

const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password, age, gender, bloodGroup, phoneNumber } = req.body;

    // Check if all fields are provided
    if (!firstName || !lastName || !email || !password || !age || !gender || !bloodGroup || !phoneNumber) {
        res.status(400);
        throw new Error("Please add all fields");
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        age,
        gender,
        bloodGroup,
        phoneNumber
    });

    if (user) {
        res.status(201).json({
            message: "User Registered Successfully",
            user: {
                //_id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                age: user.age,
                gender: user.gender,
                bloodGroup: user.bloodGroup,
                phoneNumber: user.phoneNumber
            }
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
  
    // Check if user exists
    const user = await User.findOne({ email });
  
    if (user) {
      // Compare hashed password
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (isMatch) {
        res.status(200).json({
          message: "Login successful",
          user: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            age: user.age,
            gender: user.gender,
            bloodGroup: user.bloodGroup,
            phoneNumber: user.phoneNumber
          }
        });
      } else {
        res.status(400).json({ message: "Invalid password" });
      }
    } else {
      res.status(404).json({ message: "User does not exist" });
    }
  });

module.exports = { registerUser,loginUser};
