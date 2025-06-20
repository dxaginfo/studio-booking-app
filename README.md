# Studio Booking Assistant

A comprehensive web application for managing recording studio bookings, staff scheduling, and client management.

## Features

- **Studio Management**: Add, edit, and manage multiple recording studios with different rates and equipment
- **Booking System**: Create and manage studio bookings with calendar view
- **Staff Scheduling**: Assign staff to bookings and manage their schedules
- **Client Portal**: Allow clients to book studio time and view their bookings
- **Equipment Inventory**: Track studio equipment availability and maintenance
- **Payment Integration**: Process payments and manage invoices
- **Reporting & Analytics**: Generate reports on studio usage and revenue

## Technology Stack

### Frontend
- React with TypeScript
- Redux Toolkit with RTK Query for state management
- Material UI for components and styling
- Formik and Yup for form handling and validation
- React Router for navigation
- Date-fns for date manipulation

### Backend
- Node.js with Express
- TypeScript
- Prisma ORM for database access
- PostgreSQL database
- JWT for authentication
- Swagger for API documentation
- Jest for testing

### DevOps
- Docker for containerization
- GitHub Actions for CI/CD
- AWS for hosting (EC2, RDS, S3)

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm or yarn
- PostgreSQL
- Docker (optional)

### Installation

1. Clone the repository
```bash
git clone https://github.com/dxaginfo/studio-booking-app.git
cd studio-booking-app
```

2. Install dependencies for both frontend and backend
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Set up environment variables
```bash
# In the server directory, create a .env file
cp .env.example .env
```

4. Set up the database
```bash
# In the server directory
npx prisma migrate dev
npx prisma db seed
```

5. Start the development servers
```bash
# Start the backend server (from the server directory)
npm run dev

# Start the frontend server (from the client directory)
npm start
```

6. Access the application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/api-docs

## Docker Setup

1. Build and run using Docker Compose
```bash
docker-compose up -d
```

2. Access the application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure

```
.
├── client                  # React frontend application
│   ├── public              # Static files
│   └── src                 # Source code
│       ├── components      # Reusable components
│       ├── context         # React context providers
│       ├── layouts         # Page layouts
│       ├── pages           # Page components
│       ├── redux           # Redux store, slices, and API
│       ├── hooks           # Custom React hooks
│       └── utils           # Utility functions
│
├── server                  # Node.js backend application
│   ├── src                 # Source code
│   │   ├── config          # Configuration files
│   │   ├── controllers     # Route controllers
│   │   ├── middleware      # Express middleware
│   │   ├── models          # Database models
│   │   ├── routes          # API routes
│   │   ├── services        # Business logic
│   │   └── utils           # Utility functions
│   ├── prisma              # Prisma ORM configuration
│   └── tests               # Backend tests
│
├── docker-compose.yml      # Docker Compose configuration
└── README.md               # Project documentation
```

## API Documentation

The API documentation is available at `/api-docs` when the server is running. It includes all available endpoints, request/response formats, and authentication requirements.

## Authentication

The application uses JWT (JSON Web Tokens) for authentication. Tokens are issued upon login and must be included in the Authorization header for protected routes.

## Deployment

### Production Build

1. Build the frontend
```bash
cd client
npm run build
```

2. Build the backend
```bash
cd server
npm run build
```

### Deployment Options

1. **Manual Deployment**
   - Deploy the backend to a Node.js hosting service
   - Deploy the frontend to a static hosting service like AWS S3 or Netlify

2. **Docker Deployment**
   - Build the Docker images
   - Push to a container registry
   - Deploy using Kubernetes, AWS ECS, or other container orchestration

3. **Serverless Deployment**
   - Deploy the backend as serverless functions
   - Deploy the frontend to a CDN

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

If you have any questions or suggestions, please open an issue on GitHub.