const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });

const College = require('../../models/College');
const Subject = require('../../models/Subject');
const Module = require('../../models/Module');
const Topic = require('../../models/Topic');

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000
    });

    console.log('Connected to MongoDB');

    // Create BBD University
    const bbd = await College.findOneAndUpdate(
      { name: 'BBD University' },
      {
        name: 'BBD University',
        code: 'BBDU',
        location: 'Lucknow, Uttar Pradesh, India',
        availableSubjects: ['Computer Science', 'Mathematics', 'Physics', 'Electronics'],
        geminiPromptTemplates: {
          chat: 'You are assisting a BBD University student. Provide concise, syllabus-aligned help.',
          quiz: 'Generate short quizzes aligned with undergraduate syllabus for BBD University.',
          explain: 'Explain concepts with clarity and examples relevant to BBD University courses.',
          cheatSheet: 'Create compact cheat-sheets focusing on exam-oriented points for BBD University.'
        }
      },
      { upsert: true, new: true }
    );

    // Subjects
    const subjectsData = [
      {
        name: 'Computer Science',
        code: 'CSE101',
        difficultyLevels: ['beginner', 'intermediate', 'advanced'],
        aiContextKeywords: ['programming', 'data structures', 'algorithms', 'OOP']
      },
      {
        name: 'Mathematics',
        code: 'MTH101',
        difficultyLevels: ['beginner', 'intermediate', 'advanced'],
        aiContextKeywords: ['calculus', 'algebra', 'probability', 'statistics']
      },
      {
        name: 'Physics',
        code: 'PHY101',
        difficultyLevels: ['beginner', 'intermediate', 'advanced'],
        aiContextKeywords: ['mechanics', 'thermodynamics', 'optics', 'electricity']
      }
    ];

    const subjects = [];
    for (const s of subjectsData) {
      const subject = await Subject.findOneAndUpdate(
        { name: s.name, college: bbd._id },
        { ...s, college: bbd._id },
        { upsert: true, new: true }
      );
      subjects.push(subject);
    }

    // Modules and Topics for Computer Science
    const cse = subjects.find(s => s.name === 'Computer Science');
    const cseModulesData = [
      {
        name: 'Programming Fundamentals',
        number: 1,
        description: 'Basics of programming, variables, control structures, functions.',
        learningObjectives: [
          'Understand variables and data types',
          'Apply control structures',
          'Write modular code using functions'
        ],
        topics: [
          {
            name: 'Variables and Data Types',
            description: 'Primitive types, declarations, type conversion.',
            keywords: ['variables', 'types', 'casting'],
            difficulty: 'beginner',
            geminiPromptTemplates: {
              explain: 'Explain variables and data types with examples for first-year students.',
              quiz: 'Create MCQs on data types and variables.',
              cheatSheet: 'Summarize data types and variable rules.'
            }
          },
          {
            name: 'Control Structures',
            description: 'If-else, loops, switch-case.',
            keywords: ['if', 'for', 'while', 'switch'],
            difficulty: 'beginner',
            geminiPromptTemplates: {
              explain: 'Explain control structures with simple code snippets.',
              quiz: 'Generate MCQs on loops and conditionals.',
              cheatSheet: 'List common control structures with syntax.'
            }
          },
          {
            name: 'Functions and Scope',
            description: 'Functions, parameters, scope and recursion.',
            keywords: ['functions', 'scope', 'recursion'],
            difficulty: 'intermediate',
            geminiPromptTemplates: {
              explain: 'Explain functions and recursion with examples.',
              quiz: 'Generate practice questions on functions and scope.',
              cheatSheet: 'Function definitions, parameters, return values.'
            }
          }
        ]
      },
      {
        name: 'Data Structures',
        number: 2,
        description: 'Arrays, linked lists, stacks, queues and trees.',
        learningObjectives: [
          'Use arrays and linked lists',
          'Understand stacks and queues',
          'Introduction to trees'
        ],
        topics: [
          {
            name: 'Arrays and Strings',
            description: 'Static arrays, dynamic arrays, string operations.',
            keywords: ['array', 'string', 'dynamic array'],
            difficulty: 'intermediate',
            geminiPromptTemplates: {
              explain: 'Explain arrays and common operations with examples.',
              quiz: 'Generate MCQs on array and string operations.',
              cheatSheet: 'Array methods and common patterns.'
            }
          },
          {
            name: 'Linked Lists',
            description: 'Singly and doubly linked lists, operations and complexity.',
            keywords: ['linked list', 'pointer', 'node'],
            difficulty: 'intermediate',
            geminiPromptTemplates: {
              explain: 'Explain linked list operations for undergrads.',
              quiz: 'Create questions on list insertion and deletion.',
              cheatSheet: 'Linked list operations and complexities.'
            }
          },
          {
            name: 'Stacks and Queues',
            description: 'Stack (LIFO) and Queue (FIFO) concepts and applications.',
            keywords: ['stack', 'queue', 'LIFO', 'FIFO'],
            difficulty: 'intermediate',
            geminiPromptTemplates: {
              explain: 'Explain stacks/queues with real-life analogies.',
              quiz: 'MCQs on stack/queue operations.',
              cheatSheet: 'Operations and time complexities.'
            }
          }
        ]
      }
    ];

    for (const m of cseModulesData) {
      const mod = await Module.findOneAndUpdate(
        { subject: cse._id, number: m.number },
        {
          name: m.name,
          number: m.number,
          subject: cse._id,
          description: m.description,
          learningObjectives: m.learningObjectives
        },
        { upsert: true, new: true }
      );

      for (const t of m.topics) {
        const topic = await Topic.findOneAndUpdate(
          { name: t.name, module: mod._id },
          {
            name: t.name,
            description: t.description,
            module: mod._id,
            keywords: t.keywords,
            difficulty: t.difficulty,
            geminiPromptTemplates: t.geminiPromptTemplates
          },
          { upsert: true, new: true }
        );
        if (!mod.topics.includes(topic._id)) {
          mod.topics.push(topic._id);
        }
      }
      await mod.save();

      if (!cse.modules.includes(mod._id)) {
        cse.modules.push(mod._id);
      }
    }

    await cse.save();

    console.log('Seed complete: BBD University with subjects/modules/topics');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

run();
