import User from '../models/User.js';
import { sendSuccess, sendError } from '../utils/response.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const user = await User.create({
      username,
      email,
      password
    });

    if (user) {
      sendSuccess(res, {
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id)
      }, 'User registered successfully', 201);
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      sendSuccess(res, {
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id)
      }, "Logged in successfully");
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      sendSuccess(res, {
        _id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        location: user.location,
        birthday: user.birthday,
        avatarUrl: user.avatarUrl
      }, "User profile retrieved");
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
      user.bio = req.body.bio ?? user.bio;
      user.location = req.body.location ?? user.location;
      user.birthday = req.body.birthday ?? user.birthday;
      user.avatarUrl = req.body.avatarUrl ?? user.avatarUrl;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      sendSuccess(res, {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        bio: updatedUser.bio,
        location: updatedUser.location,
        birthday: updatedUser.birthday,
        avatarUrl: updatedUser.avatarUrl,
        token: generateToken(updatedUser._id),
      }, "Profile updated successfully");
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user profile
// @route   DELETE /api/users/profile
// @access  Private
export const deleteUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      await User.deleteOne({ _id: user._id });
      sendSuccess(res, {}, "User account deleted successfully");
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users for discovery
// @route   GET /api/users
// @access  Private
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select('username avatarUrl followers');
    sendSuccess(res, users, 'Users retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Follow a user
// @route   POST /api/users/follow/:id
// @access  Private
export const followUser = async (req, res, next) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow) {
      res.status(404);
      throw new Error('User not found');
    }

    if (currentUser.following.includes(userToFollow._id)) {
      res.status(400);
      throw new Error('Already following this user');
    }

    currentUser.following.push(userToFollow._id);
    userToFollow.followers.push(currentUser._id);

    await currentUser.save();
    await userToFollow.save();

    sendSuccess(res, null, `You are now following ${userToFollow.username}`);
  } catch (error) {
    next(error);
  }
};

// @desc    Unfollow a user
// @route   POST /api/users/unfollow/:id
// @access  Private
export const unfollowUser = async (req, res, next) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToUnfollow) {
      res.status(404);
      throw new Error('User not found');
    }

    currentUser.following = currentUser.following.filter(id => id.toString() !== userToUnfollow._id.toString());
    userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== currentUser._id.toString());

    await currentUser.save();
    await userToUnfollow.save();

    sendSuccess(res, null, `Unfollowed ${userToUnfollow.username}`);
  } catch (error) {
    next(error);
  }
};
