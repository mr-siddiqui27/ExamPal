const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/progress/dashboard
 * @desc    Get user progress dashboard
 * @access  Private
 */
router.get('/dashboard', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Mock progress data - in real app, this would come from database
    const progressData = {
      overview: {
        totalExamsTaken: 15,
        averageScore: 78,
        studyStreak: 7,
        totalStudyTime: 45, // hours
        profileCompletion: 85
      },
      recentActivity: [
        {
          id: '1',
          type: 'exam_completed',
          title: 'Computer Science Fundamentals',
          score: 85,
          date: new Date(Date.now() - 86400000).toISOString(),
          subject: 'Computer Science'
        },
        {
          id: '2',
          type: 'resource_downloaded',
          title: 'Data Structures Cheat Sheet',
          date: new Date(Date.now() - 172800000).toISOString(),
          subject: 'Computer Science'
        },
        {
          id: '3',
          type: 'ai_chat',
          title: 'Asked about algorithms',
          date: new Date(Date.now() - 259200000).toISOString(),
          subject: 'Computer Science'
        }
      ],
      subjects: [
        {
          name: 'Computer Science',
          progress: 75,
          examsTaken: 8,
          averageScore: 82,
          lastStudied: new Date(Date.now() - 43200000).toISOString()
        },
        {
          name: 'Mathematics',
          progress: 60,
          examsTaken: 5,
          averageScore: 70,
          lastStudied: new Date(Date.now() - 86400000).toISOString()
        },
        {
          name: 'Physics',
          progress: 45,
          examsTaken: 2,
          averageScore: 65,
          lastStudied: new Date(Date.now() - 172800000).toISOString()
        }
      ],
      achievements: [
        {
          id: '1',
          title: 'First Exam',
          description: 'Completed your first exam',
          icon: '🎯',
          unlockedAt: new Date(Date.now() - 259200000).toISOString()
        },
        {
          id: '2',
          title: 'Study Streak',
          description: 'Maintained a 7-day study streak',
          icon: '🔥',
          unlockedAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: '3',
          title: 'Subject Master',
          description: 'Achieved 80%+ in Computer Science',
          icon: '🏆',
          unlockedAt: new Date(Date.now() - 172800000).toISOString()
        }
      ],
      goals: [
        {
          id: '1',
          title: 'Complete 20 exams',
          current: 15,
          target: 20,
          progress: 75,
          deadline: new Date(Date.now() + 2592000000).toISOString() // 30 days
        },
        {
          id: '2',
          title: 'Achieve 85% average score',
          current: 78,
          target: 85,
          progress: 92,
          deadline: new Date(Date.now() + 1728000000).toISOString() // 20 days
        }
      ]
    };
    
    res.json({
      success: true,
      data: {
        progress: progressData
      }
    });
  } catch (error) {
    console.error('Get progress dashboard error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Server error while fetching progress dashboard',
        statusCode: 500
      }
    });
  }
});

/**
 * @route   GET /api/progress/subjects
 * @desc    Get detailed progress for specific subjects
 * @access  Private
 */
router.get('/subjects', protect, async (req, res) => {
  try {
    const { subject } = req.query;
    const userId = req.user.id;
    
    // Mock subject progress data
    const subjectProgress = {
      'Computer Science': {
        name: 'Computer Science',
        overallProgress: 75,
        topics: [
          {
            name: 'Programming Basics',
            progress: 90,
            examsTaken: 3,
            averageScore: 88,
            lastStudied: new Date(Date.now() - 43200000).toISOString()
          },
          {
            name: 'Data Structures',
            progress: 70,
            examsTaken: 3,
            averageScore: 75,
            lastStudied: new Date(Date.now() - 86400000).toISOString()
          },
          {
            name: 'Algorithms',
            progress: 60,
            examsTaken: 2,
            averageScore: 70,
            lastStudied: new Date(Date.now() - 172800000).toISOString()
          }
        ],
        totalExams: 8,
        averageScore: 82,
        studyTime: 25, // hours
        resourcesUsed: 12
      },
      'Mathematics': {
        name: 'Mathematics',
        overallProgress: 60,
        topics: [
          {
            name: 'Calculus',
            progress: 75,
            examsTaken: 2,
            averageScore: 78,
            lastStudied: new Date(Date.now() - 86400000).toISOString()
          },
          {
            name: 'Linear Algebra',
            progress: 50,
            examsTaken: 2,
            averageScore: 65,
            lastStudied: new Date(Date.now() - 172800000).toISOString()
          },
          {
            name: 'Statistics',
            progress: 45,
            examsTaken: 1,
            averageScore: 60,
            lastStudied: new Date(Date.now() - 259200000).toISOString()
          }
        ],
        totalExams: 5,
        averageScore: 70,
        studyTime: 15,
        resourcesUsed: 8
      }
    };
    
    if (subject && subjectProgress[subject]) {
      res.json({
        success: true,
        data: {
          subject: subjectProgress[subject]
        }
      });
    } else if (subject) {
      res.status(404).json({
        success: false,
        error: {
          message: 'Subject not found',
          statusCode: 404
        }
      });
    } else {
      res.json({
        success: true,
        data: {
          subjects: Object.values(subjectProgress)
        }
      });
    }
  } catch (error) {
    console.error('Get subject progress error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Server error while fetching subject progress',
        statusCode: 500
      }
    });
  }
});

/**
 * @route   GET /api/progress/analytics
 * @desc    Get detailed analytics and insights
 * @access  Private
 */
router.get('/analytics', protect, async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    const userId = req.user.id;
    
    // Mock analytics data
    const analytics = {
      period,
      studyTrends: {
        daily: [2, 3, 1, 4, 2, 5, 3, 2, 4, 1, 3, 2, 4, 3, 2, 1, 3, 4, 2, 3, 1, 2, 4, 3, 2, 1, 3, 4, 2, 3],
        weekly: [15, 18, 12, 20, 16, 22, 19],
        monthly: [65, 72, 58, 80, 68, 85]
      },
      performanceMetrics: {
        scoreDistribution: {
          '90-100': 3,
          '80-89': 8,
          '70-79': 12,
          '60-69': 6,
          '50-59': 2,
          'Below 50': 1
        },
        improvementRate: 12.5, // percentage
        weakestAreas: ['Algorithms', 'Statistics', 'Linear Algebra'],
        strongestAreas: ['Programming Basics', 'Calculus', 'Data Structures']
      },
      timeAnalysis: {
        averageStudySession: 45, // minutes
        peakStudyHours: [9, 14, 20], // hours of the day
        totalStudyTime: 45, // hours
        efficiency: 78 // percentage
      },
      recommendations: [
        {
          type: 'weakness',
          subject: 'Algorithms',
          action: 'Focus on algorithm complexity analysis',
          priority: 'high'
        },
        {
          type: 'strength',
          subject: 'Programming Basics',
          action: 'Help peers with programming concepts',
          priority: 'low'
        },
        {
          type: 'improvement',
          subject: 'Statistics',
          action: 'Practice more statistical problems',
          priority: 'medium'
        }
      ]
    };
    
    res.json({
      success: true,
      data: {
        analytics
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Server error while fetching analytics',
        statusCode: 500
      }
    });
  }
});

/**
 * @route   POST /api/progress/study-session
 * @desc    Record a study session
 * @access  Private
 */
router.post('/study-session', protect, [
  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Subject is required'),
  
  body('duration')
    .isInt({ min: 1, max: 480 })
    .withMessage('Duration must be between 1 and 480 minutes'),
  
  body('topics')
    .optional()
    .isArray()
    .withMessage('Topics must be an array'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          details: errors.array()
        }
      });
    }

    const { subject, duration, topics = [], notes } = req.body;
    const userId = req.user.id;
    
    // Mock study session recording
    const studySession = {
      id: `session_${Date.now()}`,
      userId,
      subject,
      duration,
      topics,
      notes: notes || null,
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + duration * 60000).toISOString(),
      efficiency: Math.floor(Math.random() * 30) + 70 // Mock efficiency score
    };
    
    console.log(`Study session recorded: User ${userId} studied ${subject} for ${duration} minutes`);
    
    res.status(201).json({
      success: true,
      message: 'Study session recorded successfully',
      data: {
        session: studySession
      }
    });
  } catch (error) {
    console.error('Record study session error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Server error while recording study session',
        statusCode: 500
      }
    });
  }
});

/**
 * @route   POST /api/progress/goal
 * @desc    Create or update a learning goal
 * @access  Private
 */
router.post('/goal', protect, [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Goal title is required')
    .isLength({ max: 200 })
    .withMessage('Goal title cannot exceed 200 characters'),
  
  body('type')
    .isIn(['exam_count', 'score_target', 'study_time', 'subject_mastery'])
    .withMessage('Invalid goal type'),
  
  body('target')
    .isFloat({ min: 1 })
    .withMessage('Target must be a positive number'),
  
  body('deadline')
    .optional()
    .isISO8601()
    .withMessage('Deadline must be a valid date'),
  
  body('subject')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Subject cannot exceed 100 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          details: errors.array()
        }
      });
    }

    const { title, type, target, deadline, subject } = req.body;
    const userId = req.user.id;
    
    // Mock goal creation
    const goal = {
      id: `goal_${Date.now()}`,
      userId,
      title,
      type,
      target,
      current: 0,
      progress: 0,
      deadline: deadline || new Date(Date.now() + 2592000000).toISOString(), // Default 30 days
      subject: subject || null,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    
    console.log(`New goal created: ${title} by user ${userId}`);
    
    res.status(201).json({
      success: true,
      message: 'Goal created successfully',
      data: {
        goal
      }
    });
  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Server error while creating goal',
        statusCode: 500
      }
    });
  }
});

/**
 * @route   PUT /api/progress/goal/:id
 * @desc    Update a learning goal
 * @access  Private
 */
router.put('/goal/:id', protect, [
  body('current')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Current value must be non-negative'),
  
  body('status')
    .optional()
    .isIn(['active', 'completed', 'paused'])
    .withMessage('Invalid status')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          details: errors.array()
        }
      });
    }

    const { id } = req.params;
    const { current, status } = req.body;
    const userId = req.user.id;
    
    // Mock goal update
    console.log(`Goal ${id} updated by user ${userId}`);
    
    res.json({
      success: true,
      message: 'Goal updated successfully',
      data: {
        goalId: id,
        updatedFields: Object.keys(req.body)
      }
    });
  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Server error while updating goal',
        statusCode: 500
      }
    });
  }
});

module.exports = router;
