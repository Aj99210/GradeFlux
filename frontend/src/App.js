import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './components/Login';
import AssignmentSelector from './components/AssignmentSelector';
import Dashboard from './components/Dashboard';
import { getCourses, getAssignments } from './services/api';
import './App.css';

function AppContent() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  
  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('gradeflux_user');
    const storedToken = localStorage.getItem('gradeflux_token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);
  
  // Fetch courses when user logs in
  useEffect(() => {
    const fetchCourses = async () => {
      if (!user || !token) return;
      
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching courses with token:", token.substring(0, 10) + "...");
        const coursesData = await getCourses(token);
        setCourses(coursesData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again or use Test Login.');
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, [user, token]);
  
  // Fetch assignments when a course is selected
  useEffect(() => {
    const fetchAssignments = async () => {
      if (!selectedCourse || !token) return;
      
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching assignments for course:", selectedCourse.id);
        const assignmentsData = await getAssignments(token, selectedCourse.id);
        setAssignments(assignmentsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching assignments:', err);
        setError('Failed to load assignments. Please try again or use Test Login.');
        setLoading(false);
      }
    };
    
    fetchAssignments();
  }, [selectedCourse, token]);
  
  // Handle login success
  const handleLoginSuccess = (userData, authToken) => {
    console.log("Login successful for user:", userData.name);
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('gradeflux_user', JSON.stringify(userData));
    localStorage.setItem('gradeflux_token', authToken);
    navigate('/courses');
  };
  
  // Handle logout
  const handleLogout = () => {
    console.log("Logging out user");
    setUser(null);
    setToken(null);
    setSelectedCourse(null);
    setSelectedAssignment(null);
    setCourses([]);
    setAssignments([]);
    localStorage.removeItem('gradeflux_user');
    localStorage.removeItem('gradeflux_token');
    navigate('/');
  };
  
  // Handle course selection
  const handleCourseSelect = (course) => {
    console.log("Course selected:", course.name);
    setSelectedCourse(course);
    setSelectedAssignment(null);
    navigate('/assignments');
  };
  
  // Handle assignment selection
  const handleAssignmentSelect = (assignment) => {
    console.log("Assignment selected:", assignment.title);
    setSelectedAssignment(assignment);
    navigate('/dashboard');
  };
  
  // Handle back to courses
  const handleBackToCourses = () => {
    console.log("Navigating back to courses");
    setSelectedCourse(null);
    setAssignments([]);
    navigate('/courses');
  };
  
  // Handle logo click
  const handleLogoClick = () => {
    if (user) {
      setSelectedCourse(null);
      setSelectedAssignment(null);
      navigate('/courses');
    } else {
      navigate('/');
    }
  };
  
  // Handle error dismissal
  const handleDismissError = () => {
    setError(null);
  };
  
  return (
    <div className="App">
      <header className="App-header">
        <h1 onClick={handleLogoClick}>GradeFlux</h1>
        {user && (
          <div className="user-info">
            <span>{user.name}</span>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </header>
      
      <main>
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={handleDismissError}>Dismiss</button>
          </div>
        )}
        
        {loading && user && (
          <div className="loading">Loading data...</div>
        )}
        
        <Routes>
          <Route path="/" element={user ? <Navigate to="/courses" /> : <Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/courses" element={
            user ? 
            <AssignmentSelector 
              type="courses" 
              courses={courses} 
              onCourseSelect={handleCourseSelect} 
              loading={loading}
            /> : 
            <Navigate to="/" />
          } />
          <Route path="/assignments" element={
            user && selectedCourse ? 
            <AssignmentSelector 
              type="assignments" 
              course={selectedCourse} 
              assignments={assignments} 
              onAssignmentSelect={handleAssignmentSelect} 
              onBackClick={handleBackToCourses} 
              loading={loading}
            /> : 
            <Navigate to="/courses" />
          } />
          <Route path="/dashboard" element={
            user && selectedCourse && selectedAssignment ? 
            <Dashboard 
              token={token} 
              course={selectedCourse} 
              assignment={selectedAssignment} 
            /> : 
            <Navigate to="/assignments" />
          } />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  // Get Google Client ID from environment variables
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  
  if (!googleClientId) {
    console.error("Google Client ID is missing! Check your .env file.");
    return (
      <div className="error">
        <h2>Configuration Error</h2>
        <p>Google Client ID is missing. Please check your .env file and restart the application.</p>
      </div>
    );
  }
  
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Router>
        <AppContent />
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App; 