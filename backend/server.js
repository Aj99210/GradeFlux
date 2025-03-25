const express = require('express');
const cors = require('cors');
const { OAuth2Client } = require('google-auth-library');
const app = express();
const PORT = 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data for testing
const mockCourses = [
  { id: 'course1', name: 'Mathematics 101', description: 'Introduction to Mathematics' },
  { id: 'course2', name: 'Physics 101', description: 'Introduction to Physics' },
  { id: 'course3', name: 'Chemistry 101', description: 'Introduction to Chemistry' }
];

const mockAssignments = {
  'course1': [
    { id: 'assignment1', title: 'Quiz 1', description: 'Multiple choice quiz on algebra', dueDate: '2023-12-01' },
    { id: 'assignment2', title: 'Quiz 2', description: 'Multiple choice quiz on geometry', dueDate: '2023-12-15' }
  ],
  'course2': [
    { id: 'assignment3', title: 'Quiz 1', description: 'Multiple choice quiz on mechanics', dueDate: '2023-12-05' }
  ],
  'course3': [
    { id: 'assignment4', title: 'Quiz 1', description: 'Multiple choice quiz on elements', dueDate: '2023-12-10' }
  ]
};

const mockSubmissions = {
  'assignment1': [
    { id: 'sub1', studentId: 'student1', studentName: 'John Doe', answers: ['A', 'B', 'C', 'D'], late: false },
    { id: 'sub2', studentId: 'student2', studentName: 'Jane Smith', answers: ['A', 'B', 'D', 'D'], late: true }
  ],
  'assignment2': [
    { id: 'sub3', studentId: 'student1', studentName: 'John Doe', answers: ['B', 'B', 'C', 'A'], late: false }
  ]
};

// Helper function to grade MCQs
function gradeMcq(studentAnswers, answerKey) {
  const score = studentAnswers.filter((answer, index) => answer === answerKey[index]).length;
  const total = answerKey.length;
  const percentage = (score / total) * 100;
  
  let feedback;
  if (percentage >= 90) {
    feedback = "Excellent work! You've mastered this material.";
  } else if (percentage >= 80) {
    feedback = "Great job! You have a solid understanding of the concepts.";
  } else if (percentage >= 70) {
    feedback = "Good work! Review the questions you missed to improve further.";
  } else if (percentage >= 60) {
    feedback = "You're on the right track. Focus on reviewing the concepts you missed.";
  } else {
    feedback = "Let's work on improving your understanding. Review the material and try again.";
  }
  
  return { score: `${score}/${total}`, feedback };
}

// Routes
app.get('/', (req, res) => {
  res.json({ status: 'GradeFlux API is running' });
});

// Get courses
app.get('/api/courses', (req, res) => {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({ error: 'No authorization token provided' });
  }
  
  // For real implementation, verify the token with Google
  // For now, just return mock data
  console.log('Returning courses');
  res.json({ courses: mockCourses });
});

// Get assignments for a course
app.get('/api/courses/:courseId/assignments', (req, res) => {
  const token = req.headers.authorization;
  const { courseId } = req.params;
  
  if (!token) {
    return res.status(401).json({ error: 'No authorization token provided' });
  }
  
  const assignments = mockAssignments[courseId] || [];
  console.log(`Returning ${assignments.length} assignments for course ${courseId}`);
  res.json({ assignments });
});

// Get submissions for an assignment
app.get('/api/courses/:courseId/assignments/:assignmentId/submissions', (req, res) => {
  const token = req.headers.authorization;
  const { assignmentId } = req.params;
  
  if (!token) {
    return res.status(401).json({ error: 'No authorization token provided' });
  }
  
  const submissions = mockSubmissions[assignmentId] || [];
  console.log(`Returning ${submissions.length} submissions for assignment ${assignmentId}`);
  res.json({ submissions });
});

// Sync grades back to Google Classroom
app.post('/api/courses/:courseId/assignments/:assignmentId/sync', (req, res) => {
  const token = req.headers.authorization;
  const { courseId, assignmentId } = req.params;
  const { gradedSubmissions } = req.body;
  
  if (!token) {
    return res.status(401).json({ error: 'No authorization token provided' });
  }
  
  if (!gradedSubmissions) {
    return res.status(400).json({ error: 'No graded submissions provided' });
  }
  
  console.log(`Syncing grades for ${gradedSubmissions.length} submissions`);
  // In a real implementation, this would update Google Classroom
  
  res.json({ 
    success: true, 
    result: gradedSubmissions.map(sub => ({ id: sub.id, status: 'synced' })) 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`GradeFlux API server running on port ${PORT}`);
}); 