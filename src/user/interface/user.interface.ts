import { Document } from 'mongoose';

export interface User extends Document {
  userName: string;
  userType: string;
  userEmail: string;
  userAddress: string;
  userPhone: string;
  alternatePhone: string;
  userAge: number;
  loginType: string;
  userPassword: string;
  otp: string;
  otpExpiration: Date; 
  role: 'user' | 'admin';
  location: {
    type: 'Point';
    coordinates: [string, string];
  };
}
