# Studio Booking Assistant

A comprehensive web application for recording studios to manage bookings, coordinate with staff, and send preparation materials to clients.

## 🎵 Overview

The Studio Booking Assistant helps recording studios streamline their booking process, reduce administrative overhead, and improve the overall experience for both studio managers and clients. The system provides tools for managing studio resources, coordinating staff, processing payments, and communicating effectively with clients.

## ✨ Features

### User Management
- User registration and authentication
- Role-based access control (Admin, Staff, Client)
- User profiles with preferences and contact information

### Studio Management
- Add and manage multiple studios/rooms
- Set up equipment inventory for each studio
- Define availability hours and booking rules
- Pricing configuration (hourly rates, packages, discounts)

### Booking System
- Interactive calendar with real-time availability
- Booking creation, modification, and cancellation
- Conflict prevention and validation
- Buffer time management between sessions

### Staff Coordination
- Engineer/staff assignment to bookings
- Staff availability management
- Notification system for new/changed bookings

### Client Portal
- Self-service booking for clients
- View upcoming and past sessions
- Access to prep materials and requirements
- Session history and documents

### Automated Communications
- Booking confirmations
- Reminder emails/SMS
- Prep material distribution
- Follow-up messages

### Payment Processing
- Integration with payment gateways
- Deposit handling
- Invoice generation
- Payment tracking

### Reporting and Analytics
- Studio utilization metrics
- Revenue reports
- Client activity tracking
- Booking patterns analysis

## 🛠️ Technology Stack

### Frontend
- React.js with TypeScript
- Redux Toolkit for state management
- Material-UI for components
- FullCalendar for calendar interface
- Formik with Yup for form validation

### Backend
- Node.js with Express
- JWT for authentication
- PostgreSQL database
- Prisma ORM
- Swagger/OpenAPI for API documentation

### Infrastructure
- AWS (EC2 or Elastic Beanstalk) for hosting
- GitHub Actions for CI/CD
- AWS S3 for file storage
- SendGrid for email service
- Twilio for SMS service
- Stripe for payment processing

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL (v14 or higher)
- Git

### Installation

1. Clone the repository
   ```
   git clone https://github.com/dxaginfo/studio-booking-app.git
   cd studio-booking-app
   ```

2. Install dependencies for both frontend and backend
   ```
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. Set up environment variables
   ```
   # In the server directory, create a .env file with the following variables:
   DATABASE_URL="postgresql://username:password@localhost:5432/studio_booking_db"
   JWT_SECRET="your_jwt_secret"
   PORT=5000
   NODE_ENV=development
   
   # For services like Stripe, SendGrid, etc., add their API keys:
   STRIPE_API_KEY="your_stripe_api_key"
   SENDGRID_API_KEY="your_sendgrid_api_key"
   TWILIO_ACCOUNT_SID="your_twilio_account_sid"
   TWILIO_AUTH_TOKEN="your_twilio_auth_token"
   AWS_S3_BUCKET="your_s3_bucket_name"
   AWS_ACCESS_KEY="your_aws_access_key"
   AWS_SECRET_KEY="your_aws_secret_key"
   ```

4. Set up the database
   ```
   cd server
   npx prisma migrate dev --name init
   ```

5. Start the development servers
   ```
   # Start the backend server
   cd server
   npm run dev

   # In another terminal, start the frontend server
   cd client
   npm start
   ```

6. Access the application at `http://localhost:3000`

## 🗄️ Project Structure

```
studio-booking-app/
├── client/                # Frontend React application
│   ├── public/            # Static files
│   ├── src/               # Source files
│   │   ├── assets/        # Images, fonts, etc.
│   │   ├── components/    # Reusable components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── layouts/       # Layout components
│   │   ├── pages/         # Page components
│   │   ├── redux/         # Redux store, slices, etc.
│   │   ├── services/      # API services
│   │   ├── utils/         # Utility functions
│   │   ├── App.tsx        # Main App component
│   │   └── index.tsx      # Entry point
│   └── package.json       # Frontend dependencies
│
├── server/                # Backend Node.js application
│   ├── prisma/            # Database schema and migrations
│   ├── src/               # Source files
│   │   ├── config/        # Configuration files
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Express middleware
│   │   ├── models/        # Data models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── utils/         # Utility functions
│   │   └── index.ts       # Entry point
│   └── package.json       # Backend dependencies
│
├── .github/               # GitHub Actions workflows
├── docker/                # Docker configuration
├── docs/                  # Documentation
└── README.md              # Project overview
```

## 📝 API Documentation

The API documentation is available at `/api/docs` when running the server. It's generated using Swagger/OpenAPI.

## 🧪 Testing

Run tests for the backend:
```
cd server
npm test
```

Run tests for the frontend:
```
cd client
npm test
```

## 🚢 Deployment

### Docker Deployment

1. Build the Docker images
   ```
   docker-compose build
   ```

2. Run the containers
   ```
   docker-compose up -d
   ```

### Manual Deployment

For detailed deployment instructions, see the [deployment documentation](docs/deployment.md).

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support or questions, please contact us at support@studiobookingapp.com or open an issue in this repository.