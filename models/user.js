const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// User schema
const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, "Please use a valid email address."]
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6
  },
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Password hashing before saving user
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare password during login
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Export as 'User'
const User = mongoose.model("User", userSchema);
module.exports = User;

