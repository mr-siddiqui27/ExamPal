const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect, optionalAuth, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/resources
 * @desc    Get educational resources
 * @access  Public
 */
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { subject, type, college, limit = 20 } = req.query;
    
    // Mock resources data - in real app, this would come from database
    const mockResources = [
      {
        id: '1',
        title: 'Programming Fundamentals Guide',
        type: 'study_guide',
        subject: 'Computer Science',
        college: 'BBD University',
        description: 'Comprehensive guide covering basic programming concepts',
        content: 'This guide covers variables, loops, functions, and basic data structures...',
        difficulty: 'beginner',
        tags: ['programming', 'basics', 'computer-science'],
        author: 'Dr. Smith',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        rating: 4.5,
        downloads: 1250
      },
      {
        id: '2',
        title: 'Calculus Practice Problems',
        type: 'practice_set',
        subject: 'Mathematics',
        college: 'AKTU',
        description: 'Collection of calculus problems with step-by-step solutions',
        content: 'Practice problems covering limits, derivatives, and integrals...',
        difficulty: 'intermediate',
        tags: ['calculus', 'mathematics', 'practice'],
        author: 'Prof. Johnson',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        rating: 4.2,
        downloads: 890
      },
      {
        id: '3',
        title: 'Physics Lab Manual',
        type: 'lab_manual',
        subject: 'Physics',
        college: 'BBD University',
        description: 'Complete laboratory manual for physics experiments',
        content: 'Step-by-step instructions for conducting physics experiments...',
        difficulty: 'intermediate',
        tags: ['physics', 'laboratory', 'experiments'],
        author: 'Dr. Williams',
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        rating: 4.7,
        downloads: 2100
      },
      {
        id: '4',
        title: 'Data Structures Cheat Sheet',
        type: 'cheat_sheet',
        subject: 'Computer Science',
        college: 'BBD University',
        description: 'Quick reference for data structures and algorithms',
        content: 'Arrays, linked lists, stacks, queues, trees, and graphs...',
        difficulty: 'intermediate',
        tags: ['data-structures', 'algorithms', 'reference'],
        author: 'Prof. Brown',
        createdAt: new Date(Date.now() - 345600000).toISOString(),
        rating: 4.8,
        downloads: 3100
      }
    ];
    
    // Filter resources based on query parameters
    let filteredResources = mockResources;
    
    if (subject) {
      filteredResources = filteredResources.filter(resource => 
        resource.subject.toLowerCase().includes(subject.toLowerCase())
      );
    }
    
    if (type) {
      filteredResources = filteredResources.filter(resource => 
        resource.type === type
      );
    }
    
    if (college) {
      filteredResources = filteredResources.filter(resource => 
        resource.college === college
      );
    }
    
    // Apply limit
    filteredResources = filteredResources.slice(0, parseInt(limit));
    
    res.json({
      success: true,
      data: {
        resources: filteredResources,
        total: filteredResources.length,
        filters: { subject, type, college }
      }
    });
  } catch (error) {
    console.error('Get resources error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Server error while fetching resources',
        statusCode: 500
      }
    });
  }
});

/**
 * @route   GET /api/resources/:id
 * @desc    Get resource details
 * @access  Public
 */
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Mock resource data - in real app, this would come from database
    const mockResource = {
      id: '1',
      title: 'Programming Fundamentals Guide',
      type: 'study_guide',
      subject: 'Computer Science',
      college: 'BBD University',
      description: 'Comprehensive guide covering basic programming concepts',
      content: `# Programming Fundamentals Guide

## Introduction
This guide covers the essential concepts of programming that every computer science student should know.

## Variables and Data Types
Variables are containers for storing data values. In most programming languages, you need to declare variables before using them.

### Common Data Types:
- **Integer**: Whole numbers (e.g., 1, 2, 3, -1, -2)
- **Float**: Decimal numbers (e.g., 3.14, 2.718)
- **String**: Text (e.g., "Hello, World!")
- **Boolean**: True or false values
- **Array**: Collection of values

## Control Structures
Control structures determine the flow of program execution.

### Conditional Statements
\`\`\`javascript
if (condition) {
    // code to execute if condition is true
} else {
    // code to execute if condition is false
}
\`\`\`

### Loops
\`\`\`javascript
for (let i = 0; i < 10; i++) {
    console.log(i);
}
\`\`\`

## Functions
Functions are reusable blocks of code that perform specific tasks.

\`\`\`javascript
function add(a, b) {
    return a + b;
}
\`\`\`

## Best Practices
1. Use meaningful variable names
2. Comment your code
3. Keep functions small and focused
4. Test your code regularly
5. Follow coding conventions

## Conclusion
Mastering these fundamentals will provide a solid foundation for advanced programming concepts.`,
      difficulty: 'beginner',
      tags: ['programming', 'basics', 'computer-science'],
      author: 'Dr. Smith',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      rating: 4.5,
      downloads: 1250,
      fileSize: '2.5 MB',
      format: 'markdown',
      lastUpdated: new Date(Date.now() - 43200000).toISOString()
    };
    
    if (id !== '1') {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Resource not found',
          statusCode: 404
        }
      });
    }
    
    res.json({
      success: true,
      data: {
        resource: mockResource
      }
    });
  } catch (error) {
    console.error('Get resource error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Server error while fetching resource',
        statusCode: 500
      }
    });
  }
});

/**
 * @route   POST /api/resources
 * @desc    Create new educational resource
 * @access  Private (Teachers and Admins only)
 */
router.post('/', protect, authorize('teacher', 'admin'), [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  
  body('type')
    .isIn(['study_guide', 'practice_set', 'lab_manual', 'cheat_sheet', 'video', 'presentation'])
    .withMessage('Invalid resource type'),
  
  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Subject is required')
    .isLength({ max: 100 })
    .withMessage('Subject cannot exceed 100 characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required'),
  
  body('difficulty')
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Difficulty must be beginner, intermediate, or advanced'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
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

    const { title, type, subject, description, content, difficulty, tags = [] } = req.body;
    const authorId = req.user.id;
    
    // Mock resource creation - in real app, this would save to database
    const newResource = {
      id: `resource_${Date.now()}`,
      title,
      type,
      subject,
      college: req.user.college,
      description,
      content,
      difficulty,
      tags,
      author: req.user.name,
      authorId,
      createdAt: new Date().toISOString(),
      rating: 0,
      downloads: 0,
      status: 'published'
    };
    
    console.log(`New resource created: ${title} by ${req.user.name}`);
    
    res.status(201).json({
      success: true,
      message: 'Resource created successfully',
      data: {
        resource: newResource
      }
    });
  } catch (error) {
    console.error('Create resource error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Server error while creating resource',
        statusCode: 500
      }
    });
  }
});

/**
 * @route   PUT /api/resources/:id
 * @desc    Update educational resource
 * @access  Private (Resource author and Admins only)
 */
router.put('/:id', protect, [
  body('title')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  
  body('content')
    .optional()
    .trim(),
  
  body('difficulty')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Difficulty must be beginner, intermediate, or advanced'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
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
    const updateFields = {};
    const allowedFields = ['title', 'description', 'content', 'difficulty', 'tags'];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    });
    
    // Mock resource update - in real app, this would update database
    console.log(`Resource ${id} updated by user ${req.user.id}`);
    
    res.json({
      success: true,
      message: 'Resource updated successfully',
      data: {
        resourceId: id,
        updatedFields: Object.keys(updateFields)
      }
    });
  } catch (error) {
    console.error('Update resource error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Server error while updating resource',
        statusCode: 500
      }
    });
  }
});

/**
 * @route   DELETE /api/resources/:id
 * @desc    Delete educational resource
 * @access  Private (Resource author and Admins only)
 */
router.delete('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Mock resource deletion - in real app, this would delete from database
    console.log(`Resource ${id} deleted by user ${req.user.id}`);
    
    res.json({
      success: true,
      message: 'Resource deleted successfully'
    });
  } catch (error) {
    console.error('Delete resource error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Server error while deleting resource',
        statusCode: 500
      }
    });
  }
});

/**
 * @route   POST /api/resources/:id/rate
 * @desc    Rate a resource
 * @access  Private
 */
router.post('/:id/rate', protect, [
  body('rating')
    .isFloat({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Comment cannot exceed 500 characters')
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
    const { rating, comment } = req.body;
    const userId = req.user.id;
    
    // Mock rating submission - in real app, this would save to database
    console.log(`User ${userId} rated resource ${id} with ${rating} stars`);
    
    res.json({
      success: true,
      message: 'Rating submitted successfully',
      data: {
        resourceId: id,
        rating,
        comment: comment || null
      }
    });
  } catch (error) {
    console.error('Rate resource error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Server error while submitting rating',
        statusCode: 500
      }
    });
  }
});

module.exports = router;
