import mongoose, { Document, Schema } from 'mongoose';

// Define the interface representing the schema of the UserLocation model
interface UserLocationModel extends Document {
  user: mongoose.Types.ObjectId;
  coordinates: number[]; // Assuming coordinates is an array of [latitude, longitude]
  latitude: number; // Define latitude property
  longitude: number; // Define longitude property
}

// Define the schema for the UserLocation model
const userLocationSchema = new Schema<UserLocationModel>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true
  },
  coordinates: {
    type: [Number], // Array of numbers representing latitude and longitude
    required: true
  },
  latitude: {
    type: Number, // Define latitude property
    required: true
  },
  longitude: {
    type: Number, // Define longitude property
    required: true
  }
});

// Create the UserLocation model
const UserLocation = mongoose.model<UserLocationModel>('UserLocation', userLocationSchema);

export default UserLocation;
