const Contact = require('../Models/ContactModel');

const submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        message: 'Name, email, subject, and message are required' 
      });
    }

    // Email validation
    const emailRegex = /^[a-zA-Z]+[a-zA-Z0-9]*@[a-z]+\.[a-z]{2,3}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: 'Please enter a valid email address' 
      });
    }

    // Create new contact
    const newContact = new Contact({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      subject: subject.trim(),
      message: message.trim()
    });

    await newContact.save();

    res.status(201).json({
      message: 'Thank you for contacting us! We will get back to you soon.',
      success: true
    });

  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({ 
      message: 'Failed to submit contact form. Please try again later.' 
    });
  }
};

module.exports = { submitContact };