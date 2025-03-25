# GradeFlux

![GradeFlux Logo](https://via.placeholder.com/150x50/4a6cf7/ffffff?text=GradeFlux)

GradeFlux is an AI-powered teacher assistant designed to automate grading and provide personalized feedback. It integrates seamlessly with Google Classroom to streamline workflows and save valuable time for educators.

## ✨ Features

- **Automated MCQ Grading**: Instantly grade multiple-choice questions with customizable answer keys
- **Personalized Feedback**: Generate tailored feedback for students based on their performance
- **Google Classroom Integration**: Seamlessly fetch assignments and sync grades back to Google Classroom
- **Interactive Dashboard**: Visualize class performance with statistics and grade distribution charts
- **Modern UI/UX**: Enjoy a beautiful, responsive interface with smooth animations and transitions
- **Test Mode**: Use mock data to explore all features without setting up Google authentication

## 🖥️ Screenshots

### Login Screen
![Login Screen](https://ibb.co/BVDMR6Yf)

### Course Selection
![Course Selection](https://ibb.co/MKs5Y6p)

### Grading Dashboard
![Grading Dashboard](https://ibb.co/60XpjPFs)

## 🛠️ Technologies Used

### Frontend
- **React.js**: Modern component-based UI library
- **React Router**: For navigation between different views
- **CSS3**: Custom styling with animations and responsive design
- **Google OAuth**: Secure authentication with Google accounts
- **Axios**: For API communication with the backend

### Backend
- **Python**: Core backend language
- **Flask**: Lightweight web framework
- **Google Classroom API**: For fetching and updating classroom data
- **Google App Engine**: For hosting the backend service

### Optional
- **Spline**: For 3D interactive elements (toggle between 2D and 3D views)
- **Firebase**: For hosting and database (optional)

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- Python (v3.9+)
- Google account with access to Google Classroom
- Google Cloud Platform account (for API access)

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your Google API credentials:
   ```
   REACT_APP_GOOGLE_CLIENT_ID=your_client_id_here
   REACT_APP_API_URL=http://localhost:8080
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. The application will be available at `http://localhost:3000`

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```
   export GOOGLE_CLIENT_ID=your_client_id_here
   export GOOGLE_CLIENT_SECRET=your_client_secret_here
   ```

5. Run the development server:
   ```bash
   python main.py
   ```

6. The API will be available at `http://localhost:8080`

## 🎨 UI Features

GradeFlux features a modern, responsive UI with:

- **Consistent Color Scheme**: Professional blue-based palette with accent colors
- **Card-Based Design**: Clean, shadow-based cards for content organization
- **Interactive Elements**: Hover effects, transitions, and animations
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **Data Visualization**: Charts and statistics for grade analysis
- **Accessibility**: High contrast text and intuitive navigation

## 🔄 Workflow

1. **Login**: Authenticate with Google or use the test login
2. **Select Course**: Choose from available courses
3. **Select Assignment**: Pick an assignment to grade
4. **Set Answer Key**: Enter the correct answers for each question
5. **Grade Submissions**: Automatically grade all submissions
6. **Review & Edit**: Review grades and customize feedback
7. **Sync to Classroom**: Push grades and feedback back to Google Classroom

## 🧪 Test Mode

GradeFlux includes a test mode that uses mock data, allowing you to explore all features without setting up Google authentication:

1. Click the "Test Login" button on the login screen
2. Browse mock courses and assignments
3. Use the grading dashboard with simulated student submissions
4. Toggle between mock data and real API with the button in the dashboard

## 📱 Responsive Design

GradeFlux is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

The layout automatically adjusts to provide the best experience on any device.

## 🔮 Future Enhancements

- **AI-Powered Essay Grading**: Extend beyond MCQs to grade written responses
- **Advanced Analytics**: More detailed insights into student performance
- **Batch Processing**: Grade multiple assignments simultaneously
- **Custom Rubrics**: Create and save custom grading rubrics
- **Offline Mode**: Work without internet connection and sync later

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributors

- Your Name - Initial work and development

## 🙏 Acknowledgments

- Google Classroom API
- React.js community
- All the teachers who provided feedback during development 
