import { io } from 'socket.io-client';
import { SOCKET_URL as BASE_SOCKET_URL } from '../config';

const SOCKET_URL = BASE_SOCKET_URL;

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
