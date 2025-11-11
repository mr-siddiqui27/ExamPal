const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });

const College = require('../../models/College');
const Subject = require('../../models/Subject');
const Module = require('../../models/Module');
const Topic = require('../../models/Topic');

async function upsertCollege({ name, code, location, availableSubjects, templates }) {
  return College.findOneAndUpdate(
    { name },
    {
      name,
      code,
      location,
      availableSubjects,
      geminiPromptTemplates: templates
    },
    { upsert: true, new: true }
  );
}

async function upsertSubject(collegeId, s) {
  return Subject.findOneAndUpdate(
    { name: s.name, college: collegeId },
    { ...s, college: collegeId },
    { upsert: true, new: true }
  );
}

async function upsertModule(subjectId, m) {
  return Module.findOneAndUpdate(
    { subject: subjectId, number: m.number },
    {
      name: m.name,
      number: m.number,
      subject: subjectId,
      description: m.description,
      learningObjectives: m.learningObjectives
    },
    { upsert: true, new: true }
  );
}

async function upsertTopic(moduleId, t) {
  return Topic.findOneAndUpdate(
    { name: t.name, module: moduleId },
    {
      name: t.name,
      description: t.description,
      module: moduleId,
      keywords: t.keywords,
      difficulty: t.difficulty || 'beginner',
      geminiPromptTemplates: t.geminiPromptTemplates || {}
    },
    { upsert: true, new: true }
  );
}

async function seedBBD() {
  const bbd = await upsertCollege({
    name: 'BBD University',
    code: 'BBDU',
    location: 'Lucknow, Uttar Pradesh, India',
    availableSubjects: ['Computer Science', 'Mathematics', 'Physics', 'Electronics'],
    templates: {
      chat: 'You are assisting a BBD University student. Provide concise, syllabus-aligned help.',
      quiz: 'Generate short quizzes aligned with undergraduate syllabus for BBD University.',
      explain: 'Explain concepts with clarity and examples relevant to BBD University courses.',
      cheatSheet: 'Create compact cheat-sheets focusing on exam-oriented points for BBD University.'
    }
  });

  const subjectsData = [
    {
      name: 'Computer Science',
      code: 'CSE101',
      difficultyLevels: ['beginner', 'intermediate', 'advanced'],
      aiContextKeywords: ['programming', 'data structures', 'algorithms', 'OOP'],
      modules: [
        {
          number: 1,
          name: 'Programming Fundamentals',
          description: 'Basics of programming, variables, control structures, functions.',
          learningObjectives: ['Understand variables and data types', 'Apply control structures', 'Write modular code using functions'],
          topics: [
            {
              name: 'Variables and Data Types',
              description: 'Primitive types, declarations, type conversion.',
              keywords: ['variables', 'types', 'casting'],
              difficulty: 'beginner'
            },
            {
              name: 'Control Structures',
              description: 'If-else, loops, switch-case.',
              keywords: ['if', 'for', 'while', 'switch'],
              difficulty: 'beginner'
            },
            {
              name: 'Functions and Recursion',
              description: 'Functions, parameters, recursion and scope.',
              keywords: ['functions', 'recursion', 'scope'],
              difficulty: 'intermediate'
            }
          ]
        },
        {
          number: 2,
          name: 'Data Structures',
          description: 'Arrays, linked lists, stacks, queues and trees.',
          learningObjectives: ['Use arrays and linked lists', 'Understand stacks and queues', 'Introduction to trees'],
          topics: [
            { name: 'Arrays and Strings', description: 'Static/dynamic arrays, string ops.', keywords: ['array', 'string'] },
            { name: 'Linked Lists', description: 'Singly/doubly lists, ops and complexity.', keywords: ['linked list', 'node'] },
            { name: 'Stacks and Queues', description: 'Concepts and applications.', keywords: ['stack', 'queue'] }
          ]
        }
      ]
    },
    {
      name: 'Mathematics',
      code: 'MTH101',
      difficultyLevels: ['beginner', 'intermediate', 'advanced'],
      aiContextKeywords: ['calculus', 'algebra', 'probability', 'statistics'],
      modules: [
        {
          number: 1,
          name: 'Calculus I',
          description: 'Limits, derivatives, applications.',
          learningObjectives: ['Compute limits and derivatives', 'Apply differentiation'],
          topics: [
            { name: 'Limits and Continuity', description: 'Limit laws, continuity.', keywords: ['limit', 'continuity'] },
            { name: 'Differentiation', description: 'Rules and techniques.', keywords: ['derivative', 'chain rule'] }
          ]
        },
        {
          number: 2,
          name: 'Linear Algebra Basics',
          description: 'Matrices, vectors, systems of equations.',
          learningObjectives: ['Solve linear systems', 'Understand vector spaces'],
          topics: [
            { name: 'Matrices and Determinants', description: 'Operations, determinant properties.', keywords: ['matrix', 'determinant'] },
            { name: 'Vector Spaces', description: 'Basis, dimension, subspaces.', keywords: ['basis', 'dimension'] }
          ]
        }
      ]
    }
  ];

  for (const subj of subjectsData) {
    const subjectDoc = await upsertSubject(bbd._id, {
      name: subj.name,
      code: subj.code,
      difficultyLevels: subj.difficultyLevels,
      aiContextKeywords: subj.aiContextKeywords
    });

    for (const m of subj.modules) {
      const modDoc = await upsertModule(subjectDoc._id, m);
      for (const t of m.topics) {
        const topicDoc = await upsertTopic(modDoc._id, t);
        if (!modDoc.topics.find(id => id.toString() === topicDoc._id.toString())) modDoc.topics.push(topicDoc._id);
      }
      await modDoc.save();
      if (!subjectDoc.modules.find(id => id.toString() === modDoc._id.toString())) subjectDoc.modules.push(modDoc._id);
    }
    await subjectDoc.save();
  }
}

async function seedAKTU() {
  const aktu = await upsertCollege({
    name: 'AKTU',
    code: 'AKTU',
    location: 'Lucknow, Uttar Pradesh, India',
    availableSubjects: ['Computer Science', 'Electronics', 'Mathematics', 'Physics'],
    templates: {
      chat: 'You are assisting an AKTU student. Tailor answers to typical AKTU undergraduate curriculum.',
      quiz: 'Generate concise AKTU-aligned quizzes testing understanding and application.',
      explain: 'Provide structured explanations aligned to AKTU modules and exam patterns.',
      cheatSheet: 'Provide exam-focused summaries based on AKTU topics.'
    }
  });

  // Realistic, commonly found AKTU UG subjects (representative, not exhaustive)
  const subjectsData = [
    {
      name: 'Programming in C',
      code: 'AKTU-CSE101',
      difficultyLevels: ['beginner'],
      aiContextKeywords: ['C programming', 'pointers', 'arrays', 'functions'],
      modules: [
        {
          number: 1,
          name: 'C Basics',
          description: 'Syntax, data types, operators, I/O.',
          learningObjectives: ['Write basic C programs', 'Use operators and I/O'],
          topics: [
            { name: 'Data Types and Operators', description: 'Primitive types, ops precedence.', keywords: ['int', 'float', 'operator'] },
            { name: 'Control Flow in C', description: 'If-else, loops, switch.', keywords: ['if', 'for', 'while'] }
          ]
        },
        {
          number: 2,
          name: 'Functions and Pointers',
          description: 'Functions, scope, pointers, arrays.',
          learningObjectives: ['Apply functions', 'Manipulate arrays with pointers'],
          topics: [
            { name: 'Functions in C', description: 'Declaration, definition, call by value.', keywords: ['function', 'parameter'] },
            { name: 'Pointers and Arrays', description: 'Pointer arithmetic, arrays.', keywords: ['pointer', 'array'] }
          ]
        }
      ]
    },
    {
      name: 'Engineering Mathematics I',
      code: 'AKTU-MTH101',
      difficultyLevels: ['beginner', 'intermediate'],
      aiContextKeywords: ['calculus', 'series', 'differential'],
      modules: [
        {
          number: 1,
          name: 'Differential Calculus',
          description: 'Limits, continuity, derivatives, applications.',
          learningObjectives: ['Compute derivatives', 'Apply maxima-minima'],
          topics: [
            { name: 'Limits and Continuity', description: 'Limit evaluation and continuity.', keywords: ['limit', 'continuity'] },
            { name: 'Derivatives and Applications', description: 'Maxima-minima, curve sketching.', keywords: ['derivative', 'extrema'] }
          ]
        },
        {
          number: 2,
          name: 'Integral Calculus',
          description: 'Definite/indefinite integrals and applications.',
          learningObjectives: ['Evaluate integrals', 'Area under curves'],
          topics: [
            { name: 'Integration Techniques', description: 'Substitution, parts, partial fractions.', keywords: ['integration'] },
            { name: 'Applications of Integrals', description: 'Area, volume.', keywords: ['area', 'volume'] }
          ]
        }
      ]
    },
    {
      name: 'Data Structures using C',
      code: 'AKTU-CSE201',
      difficultyLevels: ['intermediate'],
      aiContextKeywords: ['data structures', 'stacks', 'queues', 'trees'],
      modules: [
        {
          number: 1,
          name: 'Linear Structures',
          description: 'Arrays, linked lists, stacks, queues.',
          learningObjectives: ['Implement linear structures', 'Analyze operations'],
          topics: [
            { name: 'Arrays and Linked Lists', description: 'Operations and complexities.', keywords: ['array', 'linked list'] },
            { name: 'Stacks and Queues', description: 'Implementation and use-cases.', keywords: ['stack', 'queue'] }
          ]
        },
        {
          number: 2,
          name: 'Non-Linear Structures',
          description: 'Trees and graphs basics.',
          learningObjectives: ['Understand trees/graphs basics'],
          topics: [
            { name: 'Trees Basics', description: 'Binary trees, traversals.', keywords: ['tree', 'traversal'] },
            { name: 'Graphs Basics', description: 'Representation and traversal.', keywords: ['graph', 'BFS', 'DFS'] }
          ]
        }
      ]
    }
  ];

  for (const subj of subjectsData) {
    const subjectDoc = await upsertSubject(aktu._id, {
      name: subj.name,
      code: subj.code,
      difficultyLevels: subj.difficultyLevels,
      aiContextKeywords: subj.aiContextKeywords
    });

    for (const m of subj.modules) {
      const modDoc = await upsertModule(subjectDoc._id, m);
      for (const t of m.topics) {
        const topicDoc = await upsertTopic(modDoc._id, t);
        if (!modDoc.topics.find(id => id.toString() === topicDoc._id.toString())) modDoc.topics.push(topicDoc._id);
      }
      await modDoc.save();
      if (!subjectDoc.modules.find(id => id.toString() === modDoc._id.toString())) subjectDoc.modules.push(modDoc._id);
    }
    await subjectDoc.save();
  }
}

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
    console.log('MongoDB connected for seeding');

    await seedBBD();
    console.log('Seeded BBD University');

    await seedAKTU();
    console.log('Seeded AKTU');

    console.log('All seed data inserted successfully');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

run();
