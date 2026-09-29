import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['BUSINESS_USER', 'LMO_OFFICER', 'GATC', 'ADMIN'],
      default: 'BUSINESS_USER',
      index: true,
    },
    organizationName: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    state: {
      type: String,
      default: 'Delhi',
    },
    district: {
      type: String,
      default: 'Central Delhi',
    },
    designation: {
      type: String,
      default: '',
    },
    department: {
      type: String,
      default: 'Legal Metrology Department',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
