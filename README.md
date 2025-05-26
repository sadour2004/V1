# Machine Status Dashboard

A real-time dashboard application for monitoring machine status across different manufacturing processes.

## Features

- Real-time machine status monitoring
- Process-based organization
- Status indicators (Working, Maintenance, Stopped)
- Responsive design for both web and mobile
- Standalone executable for easy deployment

## Project Structure

- `backend/` - Node.js server with Express
- `frontend/` - React web application
- `MachineStatusExpo/` - React Native mobile application

## Setup Instructions

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

### Frontend (Web)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

### Mobile App

1. Navigate to the MachineStatusExpo directory:
   ```bash
   cd MachineStatusExpo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Expo development server:
   ```bash
   npx expo start
   ```

## Standalone Version

For Windows users, you can use the standalone version:

1. Copy the `backend/backend.exe` and `backend/start-server.bat` files
2. Run `start-server.bat` to start the backend server
3. Open `frontend/index.html` in your web browser

## License

MIT 