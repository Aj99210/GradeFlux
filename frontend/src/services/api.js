import axios from 'axios';

// Base URL for API calls
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Configure axios with default headers
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
const addAuthHeader = (token) => {
  return {
    headers: {
      Authorization: token
    }
  };
};

// Mock data for testing
const MOCK_COURSES = [
  {
    id: 'course-1',
    name: 'Mathematics 101',
    description: 'Introduction to basic mathematical concepts and problem-solving techniques.',
    section: 'Section A',
    room: 'Room 201',
    ownerId: 'teacher-1'
  },
  {
    id: 'course-2',
    name: 'Physics 101',
    description: 'Fundamentals of physics including mechanics, thermodynamics, and electromagnetism.',
    section: 'Section B',
    room: 'Room 305',
    ownerId: 'teacher-1'
  },
  {
    id: 'course-3',
    name: 'Computer Science Basics',
    description: 'Introduction to programming concepts, algorithms, and data structures.',
    section: 'Section C',
    room: 'Lab 102',
    ownerId: 'teacher-1'
  }
];

const MOCK_ASSIGNMENTS = [
  {
    id: 'assignment-1',
    courseId: 'course-1',
    title: 'Midterm Exam',
    description: 'Multiple choice questions covering chapters 1-5.',
    dueDate: '2023-10-15',
    maxPoints: 100,
    state: 'PUBLISHED'
  },
  {
    id: 'assignment-2',
    courseId: 'course-1',
    title: 'Quiz 1',
    description: 'Short quiz on algebraic expressions and equations.',
    dueDate: '2023-09-30',
    maxPoints: 50,
    state: 'PUBLISHED'
  },
  {
    id: 'assignment-3',
    courseId: 'course-2',
    title: 'Physics MCQ Test',
    description: 'Multiple choice questions on Newton\'s laws and mechanics.',
    dueDate: '2023-10-20',
    maxPoints: 75,
    state: 'PUBLISHED'
  }
];

const MOCK_SUBMISSIONS = [
  {
    id: 'submission-1',
    studentId: 'student-1',
    studentName: 'John Smith',
    studentEmail: 'john.smith@example.com',
    state: 'TURNED_IN',
    late: false,
    assignedGrade: null,
    alternateLink: '',
    answers: ['A', 'B', 'C', 'D', 'A']
  },
  {
    id: 'submission-2',
    studentId: 'student-2',
    studentName: 'Jane Doe',
    studentEmail: 'jane.doe@example.com',
    state: 'TURNED_IN',
    late: true,
    assignedGrade: null,
    alternateLink: '',
    answers: ['A', 'C', 'C', 'D', 'B']
  },
  {
    id: 'submission-3',
    studentId: 'student-3',
    studentName: 'Bob Johnson',
    studentEmail: 'bob.johnson@example.com',
    state: 'TURNED_IN',
    late: false,
    assignedGrade: null,
    alternateLink: '',
    answers: ['A', 'B', 'A', 'D', 'B']
  }
];

// Helper function to determine if we should use mock data
const shouldUseMockData = (token) => {
  // Only use mock data if the token is specifically 'test-token'
  return token === 'test-token';
};

// Helper function to make authenticated API requests
const fetchWithAuth = async (endpoint, token, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': token
  };

  try {
    console.log(`Making API request to ${endpoint}`);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      let errorMessage = `API request failed with status ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        // If we can't parse the error as JSON, just use the status message
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error);
    throw error;
  }
};

// Get courses from Google Classroom
export const getCourses = async (token) => {
  console.log('Fetching courses with token:', token ? 'Token exists' : 'No token');
  console.log('Using mock data?', shouldUseMockData(token));
  
  if (shouldUseMockData(token)) {
    console.log('Using mock course data');
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_COURSES;
  }
  
  try {
    // Real API call
    console.log('Making real API call to fetch courses');
    const data = await fetchWithAuth('/api/courses', token);
    console.log('API response for courses:', data);
    return data.courses || [];
  } catch (error) {
    console.error('Error fetching courses:', error);
    // Don't fallback to mock data on error, throw the error instead
    throw error;
  }
};

// Get assignments for a course
export const getAssignments = async (token, courseId) => {
  console.log(`Fetching assignments for course ${courseId}`);
  console.log('Using mock data?', shouldUseMockData(token));
  
  if (shouldUseMockData(token)) {
    console.log('Using mock assignment data');
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_ASSIGNMENTS.filter(a => a.courseId === courseId);
  }
  
  try {
    // Real API call
    console.log('Making real API call to fetch assignments');
    const data = await fetchWithAuth(`/api/courses/${courseId}/assignments`, token);
    console.log('API response for assignments:', data);
    return data.assignments || [];
  } catch (error) {
    console.error('Error fetching assignments:', error);
    // Don't fallback to mock data on error, throw the error instead
    throw error;
  }
};

// Get submissions for an assignment
export const getSubmissions = async (token, courseId, assignmentId) => {
  console.log(`Fetching submissions for course ${courseId}, assignment ${assignmentId}`);
  console.log('Using mock data?', shouldUseMockData(token));
  
  if (shouldUseMockData(token)) {
    console.log('Using mock submission data');
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_SUBMISSIONS;
  }
  
  try {
    // Real API call
    console.log('Making real API call to fetch submissions');
    const data = await fetchWithAuth(`/api/courses/${courseId}/assignments/${assignmentId}/submissions`, token);
    console.log('API response for submissions:', data);
    return data.submissions || [];
  } catch (error) {
    console.error('Error fetching submissions:', error);
    // Don't fallback to mock data on error, throw the error instead
    throw error;
  }
};

// Grade submissions based on answer key
export const gradeSubmissions = async (submissions, answerKey) => {
  console.log('Grading submissions with answer key:', answerKey);
  
  try {
    // This could be a real API call to a backend grading service
    // For now, we'll grade locally
    const gradedSubmissions = submissions.map(submission => {
      const correctAnswers = submission.answers.filter((answer, index) => 
        index < answerKey.length && answer === answerKey[index]
      ).length;
      const totalQuestions = Math.min(submission.answers.length, answerKey.length);
      const percentage = (correctAnswers / totalQuestions) * 100;
      
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
      
      return {
        studentId: submission.studentId,
        score: `${correctAnswers}/${totalQuestions}`,
        feedback: feedback
      };
    });
    
    return { gradedSubmissions };
  } catch (error) {
    console.error('Error grading submissions:', error);
    throw error;
  }
};

// Sync grades back to Google Classroom
export const syncGrades = async (token, courseId, assignmentId, gradedSubmissions) => {
  console.log(`Syncing grades for course ${courseId}, assignment ${assignmentId}`);
  console.log('Grades to sync:', gradedSubmissions);
  console.log('Using mock data?', shouldUseMockData(token));
  
  if (shouldUseMockData(token)) {
    console.log('Using mock sync (no actual sync)');
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
  }
  
  try {
    // Real API call
    console.log('Making real API call to sync grades');
    const data = await fetchWithAuth(`/api/courses/${courseId}/assignments/${assignmentId}/sync`, token, {
      method: 'POST',
      body: JSON.stringify({ gradedSubmissions })
    });
    console.log('API response for sync:', data);
    return data;
  } catch (error) {
    console.error('Error syncing grades:', error);
    throw error;
  }
}; 