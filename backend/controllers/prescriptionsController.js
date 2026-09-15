const Prescription = require('../models/Prescription');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const { generatePrescriptionPDF } = require('../services/pdfService');

// @desc    Get my prescriptions (patient or doctor)
// @route   GET /api/prescriptions
// @access  Private
const getMyPrescriptions = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'doctor') {
      query = { doctor: req.user.id };
    } else {
      query = { patient: req.user.id };
    }

    const prescriptions = await Prescription.find(query)
      .populate('doctor', 'name email specialization')
      .populate('patient', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get prescription by ID
// @route   GET /api/prescriptions/:id
// @access  Private
const getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('doctor', 'name email phone')
      .populate('patient', 'name email phone');

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.status(200).json(prescription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create prescription
// @route   POST /api/prescriptions
// @access  Private (Doctor/Admin)
const createPrescription = async (req, res) => {
  try {
    const prescription = await Prescription.create({
      ...req.body,
      doctor: req.user.id
    });

    if (req.body.appointment) {
      await Appointment.findByIdAndUpdate(req.body.appointment, {
        status: 'completed',
        prescription: prescription._id.toString()
      });
    }

    await prescription.populate('patient', 'name email');
    res.status(201).json(prescription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Generate and stream Prescription PDF
// @route   GET /api/prescriptions/:id/pdf
// @access  Private (Patient owner, Doctor issuer, or Admin)
const getPrescriptionPdf = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('doctor', 'name email phone')
      .populate('patient', 'name email phone dateOfBirth gender');

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    // Security Authorization Check
    const isPatientOwner = req.user.role === 'patient' && prescription.patient._id.toString() === req.user.id;
    const isDoctorIssuer = req.user.role === 'doctor' && prescription.doctor._id.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isPatientOwner && !isDoctorIssuer && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to access this prescription PDF' });
    }

    // Additional Doctor Details query
    const doctorProfile = await Doctor.findOne({ user: prescription.doctor._id });
    // Additional Patient Details query
    const patientProfile = await Patient.findOne({ user: prescription.patient._id });

    // Format data for PDF generator
    const pdfData = {
      prescriptionId: prescription._id.toString(),
      createdAtDate: new Date(prescription.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      doctorName: prescription.doctor?.name || 'Practitioner',
      doctorEmail: prescription.doctor?.email || '',
      doctorPhone: prescription.doctor?.phone || '',
      doctorSpecialization: doctorProfile?.specialization || 'General Physician',
      doctorLicense: doctorProfile?.licenseNumber || 'DOC-REG-VERIFIED',
      hospitalName: doctorProfile?.hospital || 'Mr. Doc Healthcare Network',
      patientName: prescription.patient?.name || 'Patient',
      patientPhone: prescription.patient?.phone || '',
      patientGender: prescription.patient?.gender ? (prescription.patient.gender.charAt(0).toUpperCase() + prescription.patient.gender.slice(1)) : 'N/A',
      patientAge: prescription.patient?.dateOfBirth ? `${Math.floor((new Date() - new Date(prescription.patient.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000))} yrs` : 'N/A',
      bloodGroup: patientProfile?.bloodType || 'N/A',
      diagnosis: prescription.diagnosis,
      medicines: prescription.medicines || [],
      advice: prescription.advice || '',
      followUpDate: prescription.followUpDate ? new Date(prescription.followUpDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : null
    };

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="Prescription-${prescription._id}.pdf"`);

    generatePrescriptionPDF(pdfData, res);
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = {
  getMyPrescriptions,
  getPrescriptionById,
  createPrescription,
  getPrescriptionPdf
};

