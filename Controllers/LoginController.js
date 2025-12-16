const User = require('../Models/SignupModel.js');

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        
        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        
        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                username: `${user.firstname} ${user.lastname}`,
                role: user.role,
                subscription: user.subscription
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Error logging in user", error: err.message });
    }
};

module.exports = { loginUser };