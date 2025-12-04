const axios = require('axios');

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MjVhN2Y4YjI0ZmFhNmQ4ZDAyMzMyOCIsImlhdCI6MTc2NDA5NjI1NCwiZXhwIjoxNzY2Njg4MjU0fQ.bOVU9PTLCOjKhQBPOJrh75-YDv_hm6xNhHkUTN2Taf0';

const sendRequest = async () => {
  try {
    const config = {
        headers: { Authorization: `Bearer ${TOKEN}` }
    };

    const requestData = {
        bloodType: 'A+',
        unitsRequired: 2,
        urgency: 'high',
        location: {
            lat: 28.655616,
            lng: 77.1883008,
            address: 'Test Hospital Location'
        },
        notes: 'Test Request from Node Script'
    };

    console.log('Sending Request...');
    const res = await axios.post('http://localhost:5000/api/requests', requestData, config);
    console.log('Request Created:', res.data.success);
    console.log('Donors Notified:', res.data.donorsNotified);

  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
};

sendRequest();
