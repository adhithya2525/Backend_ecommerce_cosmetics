const User = require('../Models/SignupModel.js');

const updateSubscription = async (req, res) => {
    try {
        const { userId, subscription } = req.body;
        
        const user = await User.findByIdAndUpdate(
            userId, 
            { subscription }, 
            { new: true }
        ).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.status(200).json({ message: "Subscription updated successfully", user });
    } catch (err) {
        res.status(500).json({ message: "Error updating subscription", error: err.message });
    }
};

module.exports = { updateSubscription };