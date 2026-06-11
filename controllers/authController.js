const User = require("../models/User");

const registerUser = async (req, res) => {
    res.json({ message: "Register route working" });
}

module.exports = {registerUser};