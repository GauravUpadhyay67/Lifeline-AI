const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(morgan('dev'));

// Routes
const userRoutes = require('./routes/userRoutes');
const reportRoutes = require('./routes/reportRoutes');
const path = require('path');

app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/inventory', require('./routes/inventoryRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/forecast', require('./routes/forecastRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/forecast', require('./routes/forecastRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/camps', require('./routes/campRoutes'));

// Make uploads folder static
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.get('/', (req, res) => {
  res.send('Lifeline AI API is running...');
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error' });
});

const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for dev, restrict in prod
    methods: ["GET", "POST"]
  }
});

// Socket.io Logic
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join_room', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  socket.on('update_location', async (data) => {
    const fs = require('fs');
    fs.appendFileSync('debug.log', `Received update_location: ${JSON.stringify(data)}\n`);
    // data: { userId, lat, lng }
    // Update user location in DB (simplified for now)
    try {
        const User = require('./models/User');
        const updatedUser = await User.findByIdAndUpdate(data.userId, {
            location: { type: 'Point', coordinates: [data.lng, data.lat] },
            isOnline: true
        }, { new: true });
        fs.appendFileSync('debug.log', `User updated: ${updatedUser ? updatedUser.location : 'Not Found'}\n`);
    } catch (err) {
        fs.appendFileSync('debug.log', `Error: ${err.message}\n`);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Make io accessible in routes
app.set('io', io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
