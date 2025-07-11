const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'School'
    },
    vehicleDetails: {
        type: new mongoose.Schema({
            vehicleType: { type: String, required: true, enum: ['Bus', 'Van', 'Auto'] },
            licencedNumberPlate: { type: String, required: true },
            vehicleName: { type: String, required: true },
            currentLocation: {
                lat: { type: Number },
                lng: { type: Number },
                updatedAt: { type: Date, default: Date.now }
            },
            startPoint: {
                address: { type: String, required: true },
                lat: { type: Number, required: true },
                lng: { type: Number, required: true }
            },
            endPoint: {
                address: { type: String, required: true },
                lat: { type: Number, required: true },
                lng: { type: Number, required: true }
            },
        }, { _id: false }),
        required: true
    },
    routeDetails: [{
        pickUpPoint: { type: String, required: true },
        timing: { type: String, required: true }
    }],
    driverDetails: {
        type: new mongoose.Schema({
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'User'
            },
            fullname: { type: String, required: true },
            contact: { type: String, required: true },
            address: { type: String, required: true },
            highestQualification: { type: String, required: true },
            photo: { type: String },
            licenseNumber: { type: String, required: true },
            license: { type: String, required: true },
            aadharCardNumber: { type: String, required: true },
            aadharCard: { type: String, required: true },
            panCard: { type: String, required: true },
        }, { _id: false }),
        required: true
    },
    attendantDetails: {
        type: new mongoose.Schema({
            fullname: { type: String },
            contact: { type: String },
            address: { type: String },
            photo: { type: String },
            licenseNumber: { type: String },
            license: { type: String },
            aadharCardNumber: { type: String },
            aadharCard: { type: String },
            panCard: { type: String }
        }, { _id: false }),
        required: false
    },
    studentDetails: [{
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Student'
        },
        pickUpLocation: { type: String, required: true },
        totalFee: { type: Number, required: true },
        amountPaid: { type: Number, required: true, default: 0 },
        amountDue: { type: Number, required: true },
        status: { type: Boolean, required: true, default: true },
        action: {
            checkIn: { type: Boolean, default: true },
            checkInTime: String,
            checkOut: { type: Boolean, default: false },
            checkOutTime: String,
            Absent: { type: Boolean, default: true }
        }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', VehicleSchema);