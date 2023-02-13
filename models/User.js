import mongoose from 'mongoose';

// User's Schema
const UserSchema = new mongoose.Schema({

    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      //email must be unique
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
   avatarUrl: String,
}, {
  // Date of creating user
   timestamps: true,
});

// Exporting User Model
export default mongoose.model('User', UserSchema);