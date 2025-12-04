const io = require('socket.io-client');

const SOCKET_URL = 'http://localhost:5000';
const DONOR_ID = '6925a711b24faa6d8d02331f'; // Prabhat

const socket = io(SOCKET_URL);

console.log('Connecting to socket...');

socket.on('connect', () => {
  console.log('Connected with ID:', socket.id);
  console.log('Joining room:', DONOR_ID);
  socket.emit('join_room', DONOR_ID);
  
  // Simulate location update to ensure online status
  setTimeout(() => {
      console.log('Sending location update...');
      socket.emit('update_location', {
          userId: DONOR_ID,
          lat: 28.655616,
          lng: 77.1883008
      });
  }, 2000);
});

socket.on('new_blood_request', (data) => {
  console.log('!!! NOTIFICATION RECEIVED !!!');
  console.log(JSON.stringify(data, null, 2));
});

socket.on('disconnect', () => {
  console.log('Disconnected');
});

// Exit after 20 seconds
setTimeout(() => {
  console.log('Exiting test script...');
  process.exit(0);
}, 20000);
