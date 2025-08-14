import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVehicleDetailsById } from '../../redux/transSlice';

const VehicleView = ({ vehicleId }) => {
  const dispatch = useDispatch();
  const { vehicleDetails, loading, error } = useSelector((state) => state.trans);

  useEffect(() => {
    if (vehicleId) {
      dispatch(fetchVehicleDetailsById(vehicleId));
    }
  }, [vehicleId, dispatch]);

  const data = vehicleDetails?.vehicle;

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (!data) return <div className="p-6">No vehicle data found.</div>;

  const vehicleInfo = data.vehicleDetails;
  const driver = data.driverDetails;
  const attendant = data.attendantDetails;
  const students = data.studentDetails || [];

  return (
    <div className="p-6 space-y-6">
      {/* Vehicle + Driver */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vehicle Detail */}
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold text-[#146192] border-b border-[#146192] pb-2 mb-4">
            Vehicle Detail
          </h2>
          <div className="space-y-2">
            <p><strong>Vehicle Name:</strong> {vehicleInfo?.vehicleName}</p>
            <p><strong>Vehicle Type:</strong> {vehicleInfo?.vehicleType}</p>
            <p><strong>Licensed No. Plate:</strong> {vehicleInfo?.licencedNumberPlate}</p>
            <p><strong>Starting Point:</strong> {vehicleInfo?.startPoint?.address}</p>
            <p><strong>Ending Point:</strong> {vehicleInfo?.endPoint?.address}</p>
          </div>
        </div>

        {/* Driver Detail */}
        <div className="bg-white shadow rounded p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-[#146192] border-b border-[#146192] pb-2">
              Driver Details
            </h2>
            <button className="bg-blue-500 text-white px-4 py-1 rounded">Edit</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Detail label="License Number" value={driver?.licenseNumber} />
            <Detail label="Upload License PDF" value={driver?.license} isFile />
            <Detail label="Aadhaar Card No." value={driver?.aadharCardNumber} />
            <Detail label="Upload Aadhaar PDF" value={driver?.aadharCard} isFile />
            <Detail label="Full Name" value={driver?.fullname} />
            <Detail label="Permanent Address" value={driver?.address} />
            <Detail label="Contact No." value={driver?.contact} />
            <Detail label="Upload PAN Card PDF" value={driver?.panCard} isFile />
            <div className="col-span-full">
              <Detail label="Highest Qualification" value={driver?.highestQualification} />
            </div>
          </div>
        </div>
      </div>

      {/* Attendant Detail */}
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-lg font-semibold text-[#146192] border-b border-[#146192] pb-2 mb-4">
          Attendant Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Detail label="Full Name" value={attendant?.fullname} />
          <Detail label="Permanent Address" value={attendant?.address} />
          <Detail label="License Number" value={attendant?.licenseNumber} />
          <Detail label="Aadhaar Card No." value={attendant?.aadharCardNumber} />
          <Detail label="Contact No." value={attendant?.contact} />
          <Detail label="Upload License PDF" value={attendant?.license} isFile />
          <Detail label="Upload Aadhaar PDF" value={attendant?.aadharCard} isFile />
          <Detail label="Upload PAN Card PDF" value={attendant?.panCard} isFile />
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white shadow rounded p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#146192]">Students Assigned List</h2>
          <div className="flex gap-2">
            <button className="bg-blue-600 text-white px-4 py-1 rounded">+ Add Student</button>
            <select className="border px-2 py-1 rounded">
              <option>Pickup Location</option>
            </select>
            <select className="border px-2 py-1 rounded">
              <option>Time</option>
            </select>
          </div>
        </div>

        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">S.No</th>
              <th className="border px-2 py-1">Student Name</th>
              <th className="border px-2 py-1">Class</th>
              <th className="border px-2 py-1">Sec</th>
              <th className="border px-2 py-1">Pickup Location</th>
              <th className="border px-2 py-1">Check-in</th>
              <th className="border px-2 py-1">Check-out</th>
              <th className="border px-2 py-1">Parent Name</th>
              <th className="border px-2 py-1">Parent Contact</th>
              <th className="border px-2 py-1">Action</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((student, index) => {
                const profile = student?.studentId?.studentProfile || {};
                const parent = student?.parent || {};
                const action = student?.action || {};
                return (
                  <tr key={student._id}>
                    <td className="border px-2 py-1">{index + 1}</td>
                    <td className="border px-2 py-1">{profile.fullname}</td>
                    <td className="border px-2 py-1">{profile.class}</td>
                    <td className="border px-2 py-1">{profile.section}</td>
                    <td className="border px-2 py-1">{student.pickUpLocation}</td>
                    <td className="border px-2 py-1">{action.checkInTime || '-'}</td>
                    <td className="border px-2 py-1">{action.checkOutTime || '-'}</td>
                    <td className="border px-2 py-1">{parent.fatherName}</td>
                    <td className="border px-2 py-1">{parent.fatherPhoneNumber}</td>
                    <td className="border px-2 py-1">-</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="10" className="text-center border px-2 py-2">
                  No students assigned.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ✅ Updated Detail component
const Detail = ({ label, value, isFile = false }) => {
  const isImage = (val) => /\.(jpg|jpeg|png|gif)$/i.test(val);
  const isPDF = (val) => /\.pdf$/i.test(val);

  return (
    <div>
      <label className="block text-sm">{label}</label>
      {isFile && value ? (
        isImage(value) ? (
          <a href={value} target="_blank" rel="noopener noreferrer">
            <img
              src={value}
              alt="Uploaded"
              className="mt-1 w-24 h-auto border rounded"
            />
          </a>
        ) : isPDF(value) ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline block mt-1"
          >
            📄 View PDF
          </a>
        ) : (
          <p className="text-gray-500 mt-1">Invalid file type</p>
        )
      ) : (
        <input
          type="text"
          value={value || '-'}
          className="w-full border px-2 py-1 rounded"
          readOnly
        />
      )}
    </div>
  );
};

export default VehicleView;
