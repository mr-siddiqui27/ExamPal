const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/exams
 * @desc    Get available exams
 * @access  Public
 */
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { subject, difficulty, college, limit = 20 } = req.query;
    
    // Mock exam data - in real app, this would come from database
    const mockExams = [
      {
        id: '1',
        title: 'Computer Science Fundamentals',
        subject: 'Computer Science',
        difficulty: 'beginner',
        duration: 60,
        questionCount: 30,
        college: 'BBD University',
        description: 'Basic concepts of computer science and programming',
        topics: ['Programming Basics', 'Data Structures', 'Algorithms']
      },
      {
        id: '2',
        title: 'Advanced Mathematics',
        subject: 'Mathematics',
        difficulty: 'advanced',
        duration: 90,
        questionCount: 25,
        college: 'AKTU',
        description: 'Advanced mathematical concepts and problem solving',
        topics: ['Calculus', 'Linear Algebra', 'Statistics']
      },
      {
        id: '3',
        title: 'Physics Principles',
        subject: 'Physics',
        difficulty: 'intermediate',
        duration: 75,
        questionCount: 35,
        college: 'BBD University',
        description: 'Core physics principles and applications',
        topics: ['Mechanics', 'Thermodynamics', 'Electromagnetism']
      }
    ];
    
    // Filter exams based on query parameters
    let filteredExams = mockExams;
    
    if (subject) {
      filteredExams = filteredExams.filter(exam => 
        exam.subject.toLowerCase().includes(subject.toLowerCase())
      );
    }
    
    if (difficulty) {
      filteredExams = filteredExams.filter(exam => 
        exam.difficulty === difficulty
      );
    }
    
    if (college) {
      filteredExams = filteredExams.filter(exam => 
        exam.college === college
      );
    }
    
    // Apply limit
    filteredExams = filteredExams.slice(0, parseInt(limit));
    
    res.json({
      success: true,
      data: {
        exams: filteredExams,
        total: filteredExams.length,
        filters: { subject, difficulty, college }
      }
    });
  } catch (error) {
    console.error('Get exams error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Server error while fetching exams',
        statusCode: 500
      }
    });
  }
});

/**
 * @route   GET /api/exams/:id
 * @desc    Get exam details
 * @access  Public
 */
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Mock exam data - in real app, this would come from database
    const mockExam = {
      id: '1',
      title: 'Computer Science Fundamentals',
      subject: 'Computer Science',
      difficulty: 'beginner',
      duration: 60,
      questionCount: 30,
      college: 'BBD University',
      description: 'Basic concepts of computer science and programming',
      topics: ['Programming Basics', 'Data Structures', 'Algorithms'],
      instructions: [
        'Read each question carefully',
        'You have 60 minutes to complete the exam',
        'All questions are mandatory',
        'Use the back button to review your answers'
      ],
      rules: [
        'No external resources allowed',
        'Calculator is permitted',
        'Submit only when you are confident with all answers'
      ]
    };
    
    if (id !== '1') {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Exam not found',
          statusCode: 404
        }
      });
    }
    
    res.json({
      success: true,
      data: {
        exam: mockExam
      }
    });
  } catch (error) {
    console.error('Get exam error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Server error while fetching exam',
        statusCode: 500
      }
    });
  }
});

/**
 * @route   POST /api/exams/:id/start
 * @desc    Start an exam
 * @access  Private
 */
router.post('/:id/start', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Mock exam session creation
    const examSession = {
      id: `session_${Date.now()}`,
      examId: id,
      userId,
      startTime: new Date().toISOString(),
      status: 'in_progress',
      currentQuestion: 1,
      answers: {},
      timeRemaining: 3600 // 60 minutes in seconds
    };
    
    res.json({
      success: true,
      message: 'Exam started successfully',
      data: {
        session: examSession
      }
    });
  } catch (error) {
    console.error('Start exam error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Server error while starting exam',
        statusCode: 500
      }
    });
  }
});

/**
 * @route   POST /api/exams/:id/submit
 * @desc    Submit exam answers
 * @access  Private
 */
router.post('/:id/submit', protect, [
  body('answers')
    .isObject()
    .withMessage('Answers must be an object'),
  
  body('sessionId')
    .notEmpty()
    .withMessage('Session ID is required')
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
    const { answers, sessionId } = req.body;
    const userId = req.user.id;
    
    // Mock exam submission and scoring
    const totalQuestions = Object.keys(answers).length;
    const correctAnswers = Math.floor(Math.random() * totalQuestions) + Math.floor(totalQuestions * 0.6); // Mock scoring
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    
    const examResult = {
      id: `result_${Date.now()}`,
      examId: id,
      userId,
      sessionId,
      score,
      totalQuestions,
      correctAnswers,
      incorrectAnswers: totalQuestions - correctAnswers,
      timeTaken: Math.floor(Math.random() * 60) + 30, // Mock time
      submittedAt: new Date().toISOString(),
      answers,
      feedback: score >= 70 ? 'Excellent performance!' : score >= 50 ? 'Good effort, keep practicing!' : 'More practice needed'
    };
    
    // Update user stats (in real app, this would update the database)
    console.log(`User ${userId} completed exam ${id} with score ${score}%`);
    
    res.json({
      success: true,
      message: 'Exam submitted successfully',
      data: {
        result: examResult
      }
    });
  } catch (error) {
    console.error('Submit exam error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Server error while submitting exam',
        statusCode: 500
      }
    });
  }
});

/**
 * @route   GET /api/exams/:id/results
 * @desc    Get exam results
 * @access  Private
 */
router.get('/:id/results', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Mock exam results - in real app, this would come from database
    const mockResults = [
      {
        id: 'result_1',
        examId: id,
        userId,
        score: 85,
        totalQuestions: 30,
        correctAnswers: 25,
        incorrectAnswers: 5,
        timeTaken: 45,
        submittedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        feedback: 'Excellent performance!'
      },
      {
        id: 'result_2',
        examId: id,
        userId,
        score: 72,
        totalQuestions: 30,
        correctAnswers: 22,
        incorrectAnswers: 8,
        timeTaken: 52,
        submittedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        feedback: 'Good effort, keep practicing!'
      }
    ];
    
    res.json({
      success: true,
      data: {
        results: mockResults,
        total: mockResults.length,
        averageScore: Math.round(mockResults.reduce((sum, result) => sum + result.score, 0) / mockResults.length)
      }
    });
  } catch (error) {
    console.error('Get exam results error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Server error while fetching exam results',
        statusCode: 500
      }
    });
  }
});

module.exports = router;
