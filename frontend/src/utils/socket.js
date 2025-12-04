import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000'; // Adjust if backend runs on different port

export const socket = io(SOCKET_URL, {
  autoConnect: false,
});

export const connectSocket = (userId) => {
    socket.auth = { userId };
    socket.connect();
    socket.emit('join_room', userId);
};

export const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect();
    }
};
