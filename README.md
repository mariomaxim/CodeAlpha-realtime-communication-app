# Real-Time Communication App

A full-stack real-time communication application built with Node.js, Express, Socket.IO, and WebRTC. This app provides video calling, screen sharing, file sharing, and collaborative whiteboard features.

## 🚀 Features

- **User Authentication**: Secure registration and login system with JWT tokens
- **Video Calling**: Peer-to-peer video calls using WebRTC
- **Screen Sharing**: Share your screen during video calls
- **File Sharing**: Send and receive files in real-time (up to 10MB)
- **Collaborative Whiteboard**: Draw and collaborate in real-time
- **Room Management**: Join specific rooms for private communications
- **End-to-End Security**: Secure authentication and data transmission

## 🛠️ Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.IO** - Real-time bidirectional communication
- **MongoDB** - Database for user management
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing

### Frontend
- **HTML5** - Markup language
- **CSS3** - Styling
- **JavaScript (ES6+)** - Client-side logic
- **WebRTC** - Real-time communication
- **Socket.IO Client** - Real-time client communication

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (v4.4 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mariomaxim/realtime-communication-app.git
   cd realtime-communication-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/realtime_communication_app
   JWT_SECRET=your_super_secure_jwt_secret_key_here
   ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:5500,http://localhost:5000
   SESSION_SECRET=your_session_secret_key_here
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system:
   ```bash
   # On macOS with Homebrew
   brew services start mongodb-community
   
   # On Ubuntu/Debian
   sudo systemctl start mongod
   
   # On Windows
   net start MongoDB
   ```

5. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Access the application**
   Open your browser and navigate to `http://localhost:5000`

## 🎯 Usage

### Getting Started
1. **Register**: Create a new account with username, email, and password
2. **Login**: Sign in with your credentials
3. **Join a Room**: Enter a room ID to join a communication session
4. **Start Communicating**: Use video calls, screen sharing, file sharing, and whiteboard features

### Features Guide

#### Video Calling
- Click "Start Call" to begin a video session
- Allow camera and microphone permissions when prompted
- Share your room ID with others to join the call

#### Screen Sharing
- Start a video call first
- Click "Share Screen" to share your screen
- Select the screen or application window to share

#### File Sharing
- Select a file using the file input
- Click "Send File" to share with other users in the room
- Files are limited to 10MB for optimal performance

#### Collaborative Whiteboard
- Use the drawing tools to create content
- Choose different colors (black, red, blue)
- Clear the whiteboard when needed
- All drawings are synchronized in real-time

## 🏗️ Project Structure

```
realtime-communication-app/
├── models/
│   └── user.js              # User model schema
├── public/
│   ├── index.html           # Login/Register page
│   ├── dashboard.html       # Main application interface
│   ├── style.css           # Styling
│   ├── script.js           # Client-side JavaScript
│   └── back.jpg            # Background image
├── auth.js                 # Authentication routes and middleware
├── index.js                # Main server file
├── package.json            # Dependencies and scripts
├── .env.example           # Environment variables template
├── .gitignore             # Git ignore rules
└── README.md              # Project documentation
```

## 🔒 Security Features

- **Password Hashing**: Passwords are hashed using bcrypt with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Server-side validation for all user inputs
- **CORS Protection**: Configured CORS for secure cross-origin requests
- **Environment Variables**: Sensitive data stored in environment variables
- **File Size Limits**: File uploads limited to prevent abuse

## 🚀 Deployment

### Environment Setup
1. Set `NODE_ENV=production` in your environment variables
2. Use a secure JWT secret and session secret
3. Configure your production MongoDB URI
4. Set up HTTPS for secure communication

### Deployment Platforms
This app can be deployed on various platforms:
- **Heroku**: Easy deployment with MongoDB Atlas
- **DigitalOcean**: VPS deployment with Docker
- **AWS**: EC2 instances with RDS/DocumentDB
- **Vercel/Netlify**: Frontend deployment (requires separate backend)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Known Issues

- WebRTC may not work on some older browsers
- File sharing requires stable internet connection
- Screen sharing may have performance impact on lower-end devices

## 🔮 Future Enhancements

- [ ] Group video calls (multiple participants)
- [ ] Chat messaging system
- [ ] File history and management
- [ ] Mobile app development
- [ ] Advanced whiteboard tools
- [ ] Recording functionality
- [ ] User profiles and avatars

## 📞 Support

If you encounter any issues or have questions, please:
1. Check the [Issues](https://github.com/mariomaxim/realtime-communication-app/issues) page
2. Create a new issue if your problem isn't already reported
3. Provide detailed information about your environment and the issue

## 🙏 Acknowledgments

- [Socket.IO](https://socket.io/) for real-time communication
- [WebRTC](https://webrtc.org/) for peer-to-peer connections
- [MongoDB](https://www.mongodb.com/) for database management
- [Express.js](https://expressjs.com/) for the web framework

---

**Made with ❤️ for CodeAlpha Internship**
