const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

/**
 * @route   GET /api/users/leaderboard
 * @desc    Get leaderboard of top performing students
 * @access  Public
 */
router.get('/leaderboard', async (req, res) => {
  try {
    const { limit = 10, college } = req.query;
    
    let query = { isActive: true };
    if (college) {
      query.college = college;
    }
    
    const leaderboard = await User.find(query)
      .select('name college averageScore studyStreak totalExamsTaken')
      .sort({ averageScore: -1, studyStreak: -1 })
      .limit(parseInt(limit));
    
    res.json({
      success: true,
      data: {
        leaderboard,
        total: leaderboard.length
      }
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Server error while fetching leaderboard',
        statusCode: 500
      }
    });
  }
});

/**
 * @route   GET /api/users/stats
 * @desc    Get user statistics
 * @access  Private
 */
router.get('/stats', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    const stats = {
      totalExamsTaken: user.totalExamsTaken,
      averageScore: user.averageScore,
      studyStreak: user.studyStreak,
      profileCompletion: user.profileCompletion,
      lastStudyDate: user.lastStudyDate
    };
    
    res.json({
      success: true,
      data: {
        stats
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Server error while fetching stats',
        statusCode: 500
      }
    });
  }
});

/**
 * @route   GET /api/users/search
 * @desc    Search users by name or college
 * @access  Private (Admin only)
 */
router.get('/search', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, college, role, limit = 20 } = req.query;
    
    let query = {};
    
    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }
    
    if (college) {
      query.college = college;
    }
    
    if (role) {
      query.role = role;
    }
    
    const users = await User.find(query)
      .select('-password')
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: {
        users,
        total: users.length
      }
    });
  } catch (error) {
    console.error('User search error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Server error while searching users',
        statusCode: 500
      }
    });
  }
});

/**
 * @route   PUT /api/users/:id/status
 * @desc    Update user account status
 * @access  Private (Admin only)
 */
router.put('/:id/status', protect, authorize('admin'), async (req, res) => {
  try {
    const { isActive } = req.body;
    
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'isActive must be a boolean value',
          statusCode: 400
        }
      });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'User not found',
          statusCode: 404
        }
      });
    }
    
    res.json({
      success: true,
      message: `User account ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        user
      }
    });
  } catch (error) {
    console.error('User status update error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Server error while updating user status',
        statusCode: 500
      }
    });
  }
});

module.exports = router;
