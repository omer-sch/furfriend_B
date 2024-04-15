// // controllers/userLocation.controller.js
// import UserLocation from '../models/location_model';

// const userLocationController = {
// createUserLocation: async (req, res) => {
//     try {
//       const { userId, coordinates } = req.body;
//       const userLocation = new UserLocation({ user: userId, coordinates });
//       await userLocation.save();
//       res.status(201).json(userLocation);
//     } catch (error) {
//       console.error('Error creating user location:', error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   },
//   getUserLocation: async (req, res) => {
//     try {
//       const userId = req.params.userId;
//       const userLocation = await UserLocation.findOne({ userId });
//       if (!userLocation) {
//         return res.status(404).json({ message: 'User location not found' });
//       }
//       res.status(200).json(userLocation);
//     } catch (error) {
//       console.error('Error fetching user location:', error);
//       res.status(500).json({ message: 'Failed to fetch user location' });
//     }
//   },
//   updateUserLocation: async (req, res) => {
//     try {
//       const userId = req.params.userId;
//       const { latitude, longitude } = req.body;
//       let userLocation = await UserLocation.findOne({ userId });
//       if (!userLocation) {
//         userLocation = new UserLocation({ userId, latitude, longitude });
//       } else {
//         userLocation.latitude = latitude;
//         userLocation.longitude = longitude;
//       }
//       await userLocation.save();
//       res.status(200).json({ message: 'User location updated successfully' });
//     } catch (error) {
//       console.error('Error updating user location:', error);
//       res.status(500).json({ message: 'Failed to update user location' });
//     }
//   },
//   deleteUserLocation: async (req, res) => {
//     try {
//       const userId = req.params.userId;
//       await UserLocation.deleteOne({ userId });
//       res.status(200).json({ message: 'User location deleted successfully' });
//     } catch (error) {
//       console.error('Error deleting user location:', error);
//       res.status(500).json({ message: 'Failed to delete user location' });
//     }
//   }

// };


// export default userLocationController;
