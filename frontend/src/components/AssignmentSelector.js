import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCourses, getAssignments } from '../services/api';
import './AssignmentSelector.css';

function AssignmentSelector({ type, courses, course, assignments, onCourseSelect, onAssignmentSelect, onBackClick }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [view, setView] = useState('list'); // 'list' or '3d'
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [animationLoaded, setAnimationLoaded] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    // Trigger animations after component mounts
    setTimeout(() => {
      setAnimationLoaded(true);
    }, 100);
    
    // Add parallax effect
    const handleMouseMove = (e) => {
      const cards = document.querySelectorAll('.course-item, .assignment-item');
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (x > 0 && x < rect.width && y > 0 && y < rect.height) {
          const rotateY = (x / rect.width - 0.5) * 5;
          const rotateX = (y / rect.height - 0.5) * -5;
          
          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        } else {
          card.style.transform = '';
        }
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [type, courses, assignments]);
  
  // Handle card hover
  const handleCardHover = (id) => {
    setHoveredCard(id);
  };
  
  const handleCardLeave = () => {
    setHoveredCard(null);
  };
  
  // Handle course selection
  const handleCourseClick = (course) => {
    console.log("Course clicked:", course);
    if (typeof onCourseSelect === 'function') {
      // Add slight animation delay for visual feedback
      const card = document.querySelector(`[data-id="${course.id}"]`);
      if (card) {
        card.classList.add('card-clicked');
        setTimeout(() => {
          onCourseSelect(course);
        }, 150);
      } else {
        onCourseSelect(course);
      }
    } else {
      console.error('onCourseSelect is not a function');
    }
  };
  
  // Handle assignment selection
  const handleAssignmentClick = (assignment) => {
    console.log("Assignment clicked:", assignment);
    if (typeof onAssignmentSelect === 'function') {
      // Add slight animation delay for visual feedback
      const card = document.querySelector(`[data-id="${assignment.id}"]`);
      if (card) {
        card.classList.add('card-clicked');
        setTimeout(() => {
          onAssignmentSelect(assignment);
        }, 150);
      } else {
        onAssignmentSelect(assignment);
      }
    } else {
      console.error('onAssignmentSelect is not a function');
    }
  };
  
  // Toggle view between list and 3D
  const toggleView = () => {
    // Add transition effect when switching views
    const container = document.querySelector('.courses-grid, .assignments-grid, .courses-showcase, .assignments-showcase');
    if (container) {
      container.classList.add('view-transitioning');
      setTimeout(() => {
        setView(view === 'list' ? '3d' : 'list');
        setTimeout(() => {
          const newContainer = document.querySelector('.courses-grid, .assignments-grid, .courses-showcase, .assignments-showcase');
          if (newContainer) {
            newContainer.classList.remove('view-transitioning');
          }
        }, 50);
      }, 150);
    } else {
      setView(view === 'list' ? '3d' : 'list');
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString.toString();
    }
  };

  // Filter courses based on search term
  const filteredCourses = courses?.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'active' && course.isActive) return matchesSearch;
    if (filter === 'archived' && !course.isActive) return matchesSearch;
    
    return matchesSearch;
  }) || [];
  
  // Filter assignments based on search term
  const filteredAssignments = assignments?.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (assignment.description && assignment.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'active' && !assignment.isCompleted) return matchesSearch;
    if (filter === 'completed' && assignment.isCompleted) return matchesSearch;
    
    return matchesSearch;
  }) || [];

  // Get random gradient colors for course cards
  const getRandomGradient = (index) => {
    const gradients = [
      'linear-gradient(135deg, #4a6cf7, #8e9efc)',
      'linear-gradient(135deg, #f06292, #fa8fb4)',
      'linear-gradient(135deg, #ffa726, #ffc166)',
      'linear-gradient(135deg, #66bb6a, #8aeeb0)',
      'linear-gradient(135deg, #42a5f5, #86c6f9)',
      'linear-gradient(135deg, #ab47bc, #c586d1)',
      'linear-gradient(135deg, #ec407a, #f47eaa)',
      'linear-gradient(135deg, #26c6da, #7fd7e6)'
    ];
    
    return gradients[index % gradients.length];
  };
  
  // Get course/assignment status
  const getItemStatus = (item, isAssignment = false) => {
    if (isAssignment) {
      if (item.isCompleted) return 'completed';
      
      if (item.dueDate) {
        const dueDate = new Date(item.dueDate);
        const today = new Date();
        const diffTime = dueDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return 'overdue';
        if (diffDays <= 3) return 'due-soon';
      }
      
      return 'active';
    } else {
      return item.isActive ? 'active' : 'archived';
    }
  };
  
  if (loading) {
    return (
      <div className="assignment-selector-container">
        <div className="fancy-loader">
          <div className="fancy-loader-spinner"></div>
          <p>Loading your content...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="assignment-selector-container">
        <div className="error-container">
          <div className="error-icon"></div>
          <h3>Something went wrong</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`assignment-selector-container ${animationLoaded ? 'animate' : ''}`}>
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      
      {type === 'courses' ? (
        <div className="courses-dashboard">
          <div className="dashboard-header">
            <div className="header-left">
              <h2 className="dashboard-title">Your Courses</h2>
              <p className="dashboard-subtitle">Select a course to view assignments</p>
            </div>
            
            <div className="header-right">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <div className="search-icon"></div>
              </div>
              
              <div className="filter-container">
                <select 
                  value={filter} 
                  onChange={(e) => setFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Courses</option>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              
              <button className="view-toggle-button" onClick={toggleView}>
                <span className="toggle-icon"></span>
                {view === 'list' ? 'Card View' : 'Grid View'}
              </button>
            </div>
          </div>
          
          {view === 'list' ? (
            <div className="courses-grid">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course, index) => {
                  const status = getItemStatus(course);
                  const isHovered = hoveredCard === course.id;
                  
                  return (
                    <div
                      key={course.id}
                      data-id={course.id}
                      className={`course-item ${status} ${isHovered ? 'hovered' : ''}`}
                      onClick={() => handleCourseClick(course)}
                      onMouseEnter={() => handleCardHover(course.id)}
                      onMouseLeave={handleCardLeave}
                      style={{'--accent-gradient': getRandomGradient(index)}}
                    >
                      <div className="course-header">
                        <div className="course-icon">{course.name.charAt(0)}</div>
                        <div className="course-status">
                          <span className="status-indicator"></span>
                          <span className="status-text">{status === 'active' ? 'Active' : 'Archived'}</span>
                        </div>
                      </div>
                      
                      <h3 className="course-title">{course.name}</h3>
                      
                      <div className="course-details">
                        <span className="course-section">{course.section || 'No Section'}</span>
                        {course.room && <span className="course-room">Room {course.room}</span>}
                      </div>
                      
                      <p className="course-description">{course.description || 'No description available'}</p>
                      
                      <div className="course-stats">
                        <div className="stat-item">
                          <span className="stat-value">{course.studentCount || 0}</span>
                          <span className="stat-label">Students</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-value">{course.assignmentCount || 0}</span>
                          <span className="stat-label">Assignments</span>
                        </div>
                      </div>
                      
                      <div className="course-action">
                        <span>View Assignments</span>
                        <div className="action-arrow"></div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="empty-state">
                  <div className="empty-illustration courses-empty"></div>
                  <h3>No courses found</h3>
                  <p>Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          ) : (
            <div className="courses-showcase">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course, index) => {
                  const status = getItemStatus(course);
                  const isHovered = hoveredCard === course.id;
                  
                  return (
                    <div
                      key={course.id}
                      data-id={course.id}
                      className={`course-card ${status} ${isHovered ? 'hovered' : ''}`}
                      onClick={() => handleCourseClick(course)}
                      onMouseEnter={() => handleCardHover(course.id)}
                      onMouseLeave={handleCardLeave}
                      style={{'--accent-gradient': getRandomGradient(index)}}
                    >
                      <div className="card-background"></div>
                      <div className="card-pattern"></div>
                      <div className="card-shine"></div>
                      <div className="card-content">
                        <h3>{course.name}</h3>
                        <p>{course.section || 'No Section'}</p>
                        <span className="card-status">{status === 'active' ? 'Active' : 'Archived'}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="empty-state">
                  <div className="empty-illustration courses-empty"></div>
                  <h3>No courses found</h3>
                  <p>Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="assignments-dashboard">
          <div className="dashboard-header">
            <div className="header-left">
              <div className="breadcrumb">
                <button onClick={onBackClick} className="back-button">
                  <span className="back-icon"></span>
                  <span>Back to Courses</span>
                </button>
              </div>
              <h2 className="dashboard-title">{course?.name || 'Unknown Course'}</h2>
              <p className="dashboard-subtitle">Select an assignment to start grading</p>
            </div>
            
            <div className="header-right">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search assignments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <div className="search-icon"></div>
              </div>
              
              <div className="filter-container">
                <select 
                  value={filter} 
                  onChange={(e) => setFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Assignments</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              <button className="view-toggle-button" onClick={toggleView}>
                <span className="toggle-icon"></span>
                {view === 'list' ? 'Card View' : 'Grid View'}
              </button>
            </div>
          </div>
          
          {view === 'list' ? (
            <div className="assignments-grid">
              {filteredAssignments.length > 0 ? (
                filteredAssignments.map((assignment, index) => {
                  const status = getItemStatus(assignment, true);
                  const isHovered = hoveredCard === assignment.id;
                  
                  return (
                    <div
                      key={assignment.id}
                      data-id={assignment.id}
                      className={`assignment-item ${status} ${isHovered ? 'hovered' : ''}`}
                      onClick={() => handleAssignmentClick(assignment)}
                      onMouseEnter={() => handleCardHover(assignment.id)}
                      onMouseLeave={handleCardLeave}
                      style={{'--accent-gradient': getRandomGradient(index)}}
                    >
                      <div className="assignment-status">
                        <span className="status-indicator"></span>
                        <span className="status-text">
                          {status === 'completed' ? 'Completed' : 
                           status === 'overdue' ? 'Overdue' : 
                           status === 'due-soon' ? 'Due Soon' : 'Active'}
                        </span>
                      </div>
                      
                      <h3 className="assignment-title">{assignment.title}</h3>
                      
                      <p className="assignment-description">{assignment.description || 'No description available'}</p>
                      
                      <div className="assignment-details">
                        <div className="detail-item">
                          <span className="detail-icon points-icon"></span>
                          <span className="detail-text">{assignment.maxPoints || 0} points</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-icon date-icon"></span>
                          <span className="detail-text">{formatDate(assignment.dueDate)}</span>
                        </div>
                      </div>
                      
                      <div className="assignment-action">
                        <span>Grade Assignment</span>
                        <div className="action-arrow"></div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="empty-state">
                  <div className="empty-illustration assignments-empty"></div>
                  <h3>No assignments found</h3>
                  <p>Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          ) : (
            <div className="assignments-showcase">
              {filteredAssignments.length > 0 ? (
                filteredAssignments.map((assignment, index) => {
                  const status = getItemStatus(assignment, true);
                  const isHovered = hoveredCard === assignment.id;
                  
                  return (
                    <div
                      key={assignment.id}
                      data-id={assignment.id}
                      className={`assignment-card ${status} ${isHovered ? 'hovered' : ''}`}
                      onClick={() => handleAssignmentClick(assignment)}
                      onMouseEnter={() => handleCardHover(assignment.id)}
                      onMouseLeave={handleCardLeave}
                      style={{'--accent-gradient': getRandomGradient(index)}}
                    >
                      <div className="card-background"></div>
                      <div className="card-pattern"></div>
                      <div className="card-shine"></div>
                      <div className="card-content">
                        <h3>{assignment.title}</h3>
                        <p>{formatDate(assignment.dueDate)}</p>
                        <span className="card-status">
                          {status === 'completed' ? 'Completed' : 
                           status === 'overdue' ? 'Overdue' : 
                           status === 'due-soon' ? 'Due Soon' : 'Active'}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="empty-state">
                  <div className="empty-illustration assignments-empty"></div>
                  <h3>No assignments found</h3>
                  <p>Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AssignmentSelector; 