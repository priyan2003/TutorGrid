# 🧑‍🏫 TutorGrid – Online Tutoring Platform

TutorGrid is a full-stack web application that connects students and tutors through an interactive, secure, and scalable platform. It features role-based dashboards, secure authentication, real-time payment integration, and dynamic course management — designed to streamline online learning.

## 🚀 Features

- 🧑‍🎓 **Student and Tutor Dashboards** – Separate panels for students and tutors with relevant data views
- 🔐 **Secure Authentication** – JWT-based login and protected routes
- 💳 **Payment Gateway** – Stripe integration for secure course/session payments
- 📚 **Course & Lecture Management** – Tutors can create, update, and manage course content
- 🌐 **Responsive UI** – Mobile-first, fast, and clean interface built with Tailwind CSS
- 📈 **Admin Controls** – Role-based access and user management
- 🔍 **Advanced Search** – Filter courses by category, price, rating, and more
- ⭐ **Rating & Review System** – Students can rate and review courses
- 📊 **Analytics Dashboard** – Track enrollment, revenue, and performance metrics
- 💬 **Real-time Messaging** – Built-in chat system between students and tutors
- 📱 **Mobile Responsive** – Optimized for all device sizes
- 🔔 **Notifications** – Email and in-app notifications for important events

## 🛠️ Tech Stack

| Frontend | Backend | Database | Auth | Payments | Deployment |
|----------|---------|----------|------|----------|------------|
| React.js (Vite) | Node.js, Express.js | MongoDB | JWT | Stripe | Vercel (Frontend), Vercel (Backend) |

### Additional Technologies
- **Styling**: Tailwind CSS, Headless UI
- **File Upload**: Cloudinary / AWS S3
- **Testing**: Postman, React Testing Library
- **Code Quality**: ESLint, Prettier


## 📂 Project Structure

```
TutorGrid/
├── 📁 client/                          # Frontend React application
│   ├── 📁 public/
│   │   ├── favicon.ico
│   │   └── index.html
│   ├── 📁 src/
│   │   ├── 📁 components/              # Reusable UI components
│   │   │   ├── 📁 common/              # Shared components
│   │   │   ├── 📁 student/             # Student-specific components
│   │   │   ├── 📁 tutor/               # Tutor-specific components
│   │   │   └── 📁 admin/               # Admin-specific components
│   │   ├── 📁 pages/                   # Main page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── TutorDashboard.jsx
│   │   │   └── CourseDetails.jsx
│   │   ├── 📁 hooks/                   # Custom React hooks
│   │   ├── 📁 context/                 # React Context providers
│   │   ├── 📁 services/                # API service calls
│   │   ├── 📁 utils/                   # Utility functions
│   │   ├── 📁 assets/                  # Images, icons, etc.
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── 📁 server/                          # Backend Node.js application
│   ├── 📁 config/                      # Configuration files
│   │   ├── database.js                 # MongoDB connection
│   │   ├── cloudinary.js               # File upload config
│   │   └── razorpay.js                 # Payment gateway config
│   ├── 📁 controllers/                 # Route controllers
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── courseController.js
│   │   ├── paymentController.js
│   │   └── adminController.js
│   ├── 📁 middleware/                  # Custom middleware
│   │   ├── auth.js                     # JWT authentication
│   │   ├── validation.js               # Input validation
│   │   └── errorHandler.js             # Error handling
│   ├── 📁 models/                      # MongoDB schemas
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Enrollment.js
│   │   ├── Payment.js
│   │   └── Review.js
│   ├── 📁 routes/                      # API route definitions
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── courses.js
│   │   ├── payments.js
│   │   └── admin.js
│   ├── 📁 utils/                       # Utility functions
│   │   ├── emailService.js
│   │   ├── generateToken.js
│   │   └── uploadHelper.js
│   ├── 📁 tests/                       # Test files
│   ├── server.js                       # Main server file
│   └── package.json
│
├── 📁 docs/                            # Documentation
│   ├── API.md                          # API documentation
│   ├── DEPLOYMENT.md                   # Deployment guide
│   └── CONTRIBUTING.md                 # Contribution guidelines
│
├── 📁 screenshots/                     # Application screenshots
├── .gitignore
├── README.md
└── docker-compose.yml                  # Docker configuration (optional)
```

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/priyan2003/TutorGrid.git
   cd tutorgrid
   ```

2. **Install Backend Dependencies**
   ```bash
   cd Backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

4. **Environment Setup**
   
   Create `.env` file in the `server` directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:2701/
   
   # JWT
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=7d
   
   # Razorpay
   STRIPE_KEY_ID=your_razorpay_key_id
   STRIPE_KEY_SECRET=your_razorpay_secret
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # Email Service
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   
   # Server
   PORT=5000
   NODE_ENV=development
   ```
   
   Create `.env` file in the `client` directory:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
   ```

5. **Run the Application**

   **Start Backend Server:**
   ```bash
   cd Backend
   npm run dev
   ```
   
   **Start Frontend Development Server:**
   ```bash
   cd frontend
   npm run dev
   ```

   The application will be available at:
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:5000`

## 📖 Usage

### For Students
1. **Register/Login** – Create an account or login with existing credentials
2. **Browse Courses** – Explore available courses by category, price, or rating
3. **Enroll in Courses** – Make secure payments through Razorpay integration
4. **Access Content** – Watch lectures, download materials, and track progress
5. **Rate & Review** – Provide feedback on completed courses

### For Tutors
1. **Register as Tutor** – Sign up with tutor profile and credentials
2. **Create Courses** – Add course content, lectures, and pricing
3. **Manage Students** – View enrolled students and their progress
4. **Track Earnings** – Monitor revenue and payment history
5. **Update Content** – Modify course materials and add new lectures

### For Admins
1. **User Management** – Approve tutors, manage user accounts
2. **Course Moderation** – Review and approve course content
3. **Analytics** – View platform statistics and performance metrics
4. **Payment Oversight** – Monitor transactions and resolve issues

## 🔧 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Course Endpoints
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses/add-course` - Create new course (Tutor only)
- `PUT /api/courses/:id` - Update course (Tutor only)
- `DELETE /api/courses/:id` - Delete course (Tutor only)



For complete API documentation, see [API.md](./docs/API.md)

## 🧪 Testing

Run tests for both frontend and backend:

```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

### Frontend Deployment (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy with automatic CI/CD

### Backend Deployment (Render/Heroku)
1. Create new web service on Render/Heroku
2. Connect GitHub repository
3. Set environment variables
4. Deploy

For detailed deployment instructions, see [DEPLOYMENT.md](./docs/DEPLOYMENT.md)

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for detailed guidelines.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.





---

<div align="center">
  <strong>⭐ Star this repository if you found it helpful! ⭐</strong>
</div>
