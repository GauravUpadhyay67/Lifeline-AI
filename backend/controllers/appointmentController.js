const Appointment = require('../models/Appointment');
const User = require('../models/User');

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private
const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, reason } = req.body;

    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const appointment = await Appointment.create({
      patient: req.user._id,
      patientName: req.user.name,
      doctor: doctorId,
      doctorName: doctor.name,
      date,
      reason,
      status: 'pending' // Auto-pending
    });

    res.status(201).json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get logged in user appointments
// @route   GET /api/appointments/my
// @access  Private
const getMyAppointments = async (req, res) => {
  try {
    // Determine role to fetch correct appointments
    const query = req.user.role === 'doctor' 
      ? { doctor: req.user._id } 
      : { patient: req.user._id };

    const appointments = await Appointment.find(query).sort({ date: 1 });
    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  bookAppointment,
  getMyAppointments,
};
