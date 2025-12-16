const User = require('../Models/SignupModel.js');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password');
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: "Error fetching users", error: err.message });
    }
};

const createUser = async (req, res) => {
    try {
        const { firstname, lastname, phone, email, password, role } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }
        
        const newUser = new User({
            firstname,
            lastname,
            email,
            phone,
            password,
            role: role || 'user'
        });
        
        const savedUser = await newUser.save();
        const { password: _, ...userWithoutPassword } = savedUser.toObject();
        res.status(201).json({ message: "User created successfully", user: userWithoutPassword });
    } catch (err) {
        res.status(500).json({ message: "Error creating user", error: err.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        if (updateData.email) {
            const existingUser = await User.findOne({ email: updateData.email, _id: { $ne: id } });
            if (existingUser) {
                return res.status(400).json({ message: "Email already exists" });
            }
        }
        
        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (err) {
        res.status(500).json({ message: "Error updating user", error: err.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting user", error: err.message });
    }
};

module.exports = { getAllUsers, createUser, updateUser, deleteUser };