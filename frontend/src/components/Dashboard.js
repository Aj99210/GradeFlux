import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSubmissions, gradeSubmissions, syncGrades } from '../services/api';
import './Dashboard.css';

// Mock data for testing
const MOCK_SUBMISSIONS = [
  {
    id: 'submission-1',
    studentId: 'student-1',
    studentName: 'Ajay Kumar',
    studentEmail: 'ajay.kumar@example.com',
    state: 'TURNED_IN',
    late: false,
    assignedGrade: null,
    alternateLink: '',
    answers: ['A', 'B', 'C', 'D', 'A']
  },
  {
    id: 'submission-2',
    studentId: 'student-2',
    studentName: 'Priya Sharma',
    studentEmail: 'priya.sharma@example.com',
    state: 'TURNED_IN',
    late: true,
    assignedGrade: null,
    alternateLink: '',
    answers: ['A', 'C', 'C', 'D', 'B']
  },
  {
    id: 'submission-3',
    studentId: 'student-3',
    studentName: 'Manit Patel',
    studentEmail: 'manit.patel@example.com',
    state: 'TURNED_IN',
    late: false,
    assignedGrade: null,
    alternateLink: '',
    answers: ['A', 'B', 'A', 'D', 'B']
  },
  {
    id: 'submission-4',
    studentId: 'student-4',
    studentName: 'Ashish Singh',
    studentEmail: 'ashish.singh@example.com',
    state: 'TURNED_IN',
    late: true,
    assignedGrade: null,
    alternateLink: '',
    answers: ['B', 'B', 'C', 'A', 'A']
  },
  {
    id: 'submission-5',
    studentId: 'student-5',
    studentName: 'Ritika Verma',
    studentEmail: 'ritika.verma@example.com',
    state: 'TURNED_IN',
    late: false,
    assignedGrade: null,
    alternateLink: '',
    answers: ['A', 'B', 'D', 'D', 'A']
  }
];

function Dashboard({ token, course, assignment }) {
  const [submissions, setSubmissions] = useState([]);
  const [gradedSubmissions, setGradedSubmissions] = useState([]);
  const [answerKey, setAnswerKey] = useState(['A', 'B', 'C', 'D', 'A']); // Default answer key for testing
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [grading, setGrading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncComplete, setSyncComplete] = useState(false);
  const [useMockData, setUseMockData] = useState(true); // Use mock data for testing
  const [gradingStats, setGradingStats] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // For tab navigation - all, scored, unscored
  
  const navigate = useNavigate();
  
  // Fetch submissions when component mounts
  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!token || !course || !assignment) {
        console.error("Missing required props:", { token: !!token, course: !!course, assignment: !!assignment });
        setError("Missing required information. Please go back and try again.");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        console.log(`Fetching submissions for course ${course.id}, assignment ${assignment.id}`);
        
        if (useMockData) {
          // Use mock data for testing
          setTimeout(() => {
            setSubmissions(MOCK_SUBMISSIONS);
            setLoading(false);
          }, 500);
        } else {
          // Use real API
          const submissionsData = await getSubmissions(token, course.id, assignment.id);
          setSubmissions(submissionsData);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching submissions:', err);
        setError('Failed to load submissions. Please try again.');
        setLoading(false);
      }
    };
    
    fetchSubmissions();
  }, [token, course, assignment, useMockData]);
  
  // Handle answer key change
  const handleAnswerKeyChange = (index, value) => {
    const newAnswerKey = [...answerKey];
    newAnswerKey[index] = value;
    setAnswerKey(newAnswerKey);
  };
  
  // Add a new answer to the key
  const addAnswerToKey = () => {
    setAnswerKey([...answerKey, '']);
  };
  
  // Remove an answer from the key
  const removeAnswerFromKey = (index) => {
    const newAnswerKey = [...answerKey];
    newAnswerKey.splice(index, 1);
    setAnswerKey(newAnswerKey);
  };
  
  // Calculate grading statistics
  const calculateStats = (gradedSubmissions) => {
    if (!gradedSubmissions || gradedSubmissions.length === 0) return null;
    
    const scores = gradedSubmissions.map(sub => {
      const [correct, total] = sub.score.split('/').map(Number);
      return (correct / total) * 100;
    });
    
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    
    const highest = Math.max(...scores);
    const lowest = Math.min(...scores);
    
    // Count students in each grade range
    const ranges = {
      'A (90-100%)': 0,
      'B (80-89%)': 0,
      'C (70-79%)': 0,
      'D (60-69%)': 0,
      'F (0-59%)': 0
    };
    
    scores.forEach(score => {
      if (score >= 90) ranges['A (90-100%)']++;
      else if (score >= 80) ranges['B (80-89%)']++;
      else if (score >= 70) ranges['C (70-79%)']++;
      else if (score >= 60) ranges['D (60-69%)']++;
      else ranges['F (0-59%)']++;
    });
    
    return {
      average: average.toFixed(1),
      highest: highest.toFixed(1),
      lowest: lowest.toFixed(1),
      ranges
    };
  };
  
  // Grade submissions
  const handleGradeSubmissions = async () => {
    if (!answerKey || answerKey.length === 0 || answerKey.some(answer => !answer.trim())) {
      setError('Please provide a complete answer key before grading.');
      return;
    }
    
    try {
      setGrading(true);
      console.log("Grading submissions with answer key:", answerKey);
      const result = await gradeSubmissions(submissions, answerKey);
      setGradedSubmissions(result.gradedSubmissions);
      setGradingStats(calculateStats(result.gradedSubmissions));
      setGrading(false);
    } catch (err) {
      console.error('Error grading submissions:', err);
      setError('Failed to grade submissions. Please try again.');
      setGrading(false);
    }
  };
  
  // Update feedback for a submission
  const handleFeedbackChange = (studentId, newFeedback) => {
    const updatedSubmissions = gradedSubmissions.map(submission => {
      if (submission.studentId === studentId) {
        return { ...submission, feedback: newFeedback };
      }
      return submission;
    });
    
    setGradedSubmissions(updatedSubmissions);
  };
  
  // Sync grades back to Google Classroom
  const handleSyncGrades = async () => {
    try {
      setSyncing(true);
      console.log("Syncing grades to Google Classroom");
      await syncGrades(token, course.id, assignment.id, gradedSubmissions);
      setSyncing(false);
      setSyncComplete(true);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setSyncComplete(false);
      }, 3000);
    } catch (err) {
      console.error('Error syncing grades:', err);
      setError('Failed to sync grades. Please try again.');
      setSyncing(false);
    }
  };
  
  // Toggle between mock data and real API
  const toggleMockData = () => {
    setUseMockData(!useMockData);
    setGradedSubmissions([]);
    setGradingStats(null);
  };
  
  // Go back to assignment selection
  const handleBack = () => {
    navigate('/assignments');
  };
  
  // Filter submissions based on active tab
  const getFilteredSubmissions = () => {
    if (activeTab === 'all') return gradedSubmissions;
    if (activeTab === 'perfect') {
      return gradedSubmissions.filter(sub => {
        const [correct, total] = sub.score.split('/').map(Number);
        return correct === total;
      });
    }
    if (activeTab === 'failing') {
      return gradedSubmissions.filter(sub => {
        const [correct, total] = sub.score.split('/').map(Number);
        return (correct / total) * 100 < 60;
      });
    }
    return gradedSubmissions;
  };
  
  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading assignment data...</div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="dashboard">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3 className="error-title">Error</h3>
          <p className="error-message">{error}</p>
          <button className="error-button" onClick={() => setError(null)}>Dismiss</button>
        </div>
      </div>
    );
  }

  // Format assignment date if available
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-header-left">
          <button className="back-button" onClick={handleBack}>
            <span className="back-button-icon"></span>
            Back
          </button>
          <div className="assignment-info">
            <h2 className="dashboard-title">{assignment.title}</h2>
            <div className="assignment-meta">
              <div className="assignment-meta-item">
                <span className="assignment-meta-icon">📚</span>
                {course?.name || 'Course'}
              </div>
              {assignment.dueDate && (
                <div className="assignment-meta-item">
                  <span className="assignment-meta-icon">📅</span>
                  Due: {formatDate(assignment.dueDate)}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="dashboard-actions">
          <button onClick={toggleMockData} className="mock-data-button">
            <span className="mock-data-button-icon">🔄</span>
            {useMockData ? 'Use Real API' : 'Use Mock Data'}
          </button>
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="dashboard-2col">
          <div className="answer-key-section card">
            <div className="card-header">
              <h3 className="card-title">Answer Key</h3>
            </div>
            <div className="card-content">
              <p className="card-subtitle">Enter the correct answers for each question to grade submissions.</p>
              
              <div className="answer-key-form">
                {answerKey.map((answer, index) => (
                  <div key={index} className="answer-key-item">
                    <label>Q{index + 1}:</label>
                    <input
                      type="text"
                      value={answer}
                      onChange={(e) => handleAnswerKeyChange(index, e.target.value)}
                      placeholder="Enter answer"
                    />
                    <button 
                      className="remove-answer-btn"
                      onClick={() => removeAnswerFromKey(index)}
                      title="Remove question"
                      disabled={answerKey.length <= 1}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                
                <button className="add-answer-btn" onClick={addAnswerToKey}>
                  <span className="add-answer-btn-icon">+</span>
                  Add Question
                </button>
              </div>
              
              <button 
                className="grade-btn action-button"
                onClick={handleGradeSubmissions}
                disabled={answerKey.length === 0 || grading}
              >
                {grading ? 'Grading...' : 'Grade Submissions'}
              </button>
            </div>
          </div>
          
          <div className="grading-results">
            {gradedSubmissions.length > 0 ? (
              <>
                {gradingStats && (
                  <div className="grading-stats">
                    <div className="stats-grid">
                      <div className="stat-card">
                        <div className="stat-value">{gradingStats.average}%</div>
                        <div className="stat-label">Class Average</div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-value">{gradingStats.highest}%</div>
                        <div className="stat-label">Highest Score</div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-value">{gradingStats.lowest}%</div>
                        <div className="stat-label">Lowest Score</div>
                      </div>
                    </div>
                    
                    <div className="grade-distribution card">
                      <div className="card-header">
                        <h3 className="chart-header">Grade Distribution</h3>
                      </div>
                      <div className="card-content">
                        <div className="distribution-bars">
                          {Object.entries(gradingStats.ranges).map(([range, count]) => (
                            <div key={range} className="distribution-item">
                              <div className="range-label">{range}</div>
                              <div className="range-bar-container">
                                <div 
                                  className="range-bar" 
                                  style={{ 
                                    width: `${(count / gradedSubmissions.length) * 100}%`
                                  }}
                                ></div>
                              </div>
                              <div className="range-count">{count}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="graded-submissions-section card">
                  <div className="card-header">
                    <h3 className="card-title">Graded Submissions</h3>
                  </div>
                  <div className="card-content">
                    <p className="card-subtitle">Review and customize feedback before syncing to Google Classroom.</p>
                    
                    <div className="tab-navigation">
                      <button 
                        className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveTab('all')}
                      >
                        All Submissions
                      </button>
                      <button 
                        className={`tab-button ${activeTab === 'perfect' ? 'active' : ''}`}
                        onClick={() => setActiveTab('perfect')}
                      >
                        Perfect Scores
                      </button>
                      <button 
                        className={`tab-button ${activeTab === 'failing' ? 'active' : ''}`}
                        onClick={() => setActiveTab('failing')}
                      >
                        Failing
                      </button>
                    </div>
                    
                    <div className="submissions-table">
                      <table>
                        <thead>
                          <tr>
                            <th>Student</th>
                            <th>Score</th>
                            <th>Feedback</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getFilteredSubmissions().map((submission) => {
                            const student = submissions.find(s => s.studentId === submission.studentId);
                            const [correct, total] = submission.score.split('/').map(Number);
                            const percentage = (correct / total) * 100;
                            
                            let scoreClass = '';
                            if (percentage >= 90) scoreClass = 'excellent';
                            else if (percentage >= 80) scoreClass = 'good';
                            else if (percentage >= 70) scoreClass = 'average';
                            else if (percentage >= 60) scoreClass = 'below-average';
                            else scoreClass = 'poor';
                            
                            return (
                              <tr key={submission.studentId}>
                                <td>
                                  <div className="student-info">
                                    <div className="student-avatar">
                                      {student?.studentName.charAt(0) || '?'}
                                    </div>
                                    <div className="student-details">
                                      <div className="student-name">{student?.studentName || 'Unknown'}</div>
                                      <div className="student-email">{student?.studentEmail || ''}</div>
                                      <div className="status-badges">
                                        {student?.late && <span className="status-badge late-badge">Late</span>}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className="score-container">
                                    <div className="score-display">{submission.score}</div>
                                    <div className="score-bar-container">
                                      <div 
                                        className={`score-bar ${scoreClass}`}
                                        style={{ width: `${percentage}%` }}
                                      ></div>
                                    </div>
                                    <div className={`score-percentage ${scoreClass}`}>
                                      {percentage.toFixed(0)}%
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <textarea
                                    className="feedback-textarea"
                                    value={submission.feedback || ''}
                                    onChange={(e) => handleFeedbackChange(submission.studentId, e.target.value)}
                                    placeholder="Enter feedback for student"
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="sync-section">
                      <button 
                        className="sync-btn"
                        onClick={handleSyncGrades}
                        disabled={syncing}
                      >
                        <span className="sync-btn-icon">↑</span>
                        {syncing ? 'Syncing...' : 'Sync to Google Classroom'}
                      </button>
                      
                      {syncComplete && (
                        <div className="sync-success">
                          <span className="sync-success-icon">✓</span>
                          Grades and feedback successfully synced to Google Classroom!
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h3 className="empty-title">No Graded Submissions</h3>
                <p className="empty-message">
                  Complete the answer key on the left and click "Grade Submissions" to begin.
                </p>
              </div>
            )}
          </div>
        </div>
        
        {submissions.length === 0 && !loading && (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3 className="empty-title">No Submissions Found</h3>
            <p className="empty-message">
              There are no submissions for this assignment yet.
            </p>
            <button className="empty-button" onClick={handleBack}>
              Back to Assignments
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard; 