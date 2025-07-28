import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTransportationDetails,
  updateVehicleLocation,
  updateStudentAction,
} from '../../redux/driver/transportationSlice';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaBusAlt } from 'react-icons/fa';
import Header from '../adminDashboard/layout/Header';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leaflet icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Transportation = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.transportation);

  useEffect(() => {
    dispatch(fetchTransportationDetails());
  }, [dispatch]);

  // Auto update location every 5 seconds
  useEffect(() => {
  const interval = setInterval(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          console.log('Live Coordinates:', latitude, longitude, 'Accuracy:', accuracy);

          // You can add a check here if accuracy is important
          if (accuracy <= 100) {
            dispatch(updateVehicleLocation({ lat: latitude, lng: longitude }));
          } else {
            console.warn('Location not accurate enough to update:', accuracy);
          }
        },
        (err) => {
          console.error('Geolocation error:', err);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }
  }, 5000);

  return () => clearInterval(interval);
}, [dispatch]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!data) return null;

  const {
    vehicleDetails,
    driverDetails,
    attendantDetails,
    routeDetails,
    studentDetails,
  } = data.vehicle;

  // ✅ handle student action click
  const handleStudentAction = (studentId, action) => {
    dispatch(updateStudentAction({ studentId, action })).then(() => {
      dispatch(fetchTransportationDetails()); // Refresh data after update
    });
  };

  return (
    <div className="flex flex-col mx-4 md:ml-72 mt-20 text-base">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-light xl:text-[35px]">Transportation</h1>
          <hr className="mt-2 border-[#146192] w-[180px]" />
          <p className="mt-2">
            <span>Home</span> {'>'}{' '}
            <span className="text-[#146192]">Driver Details</span>
          </p>
        </div>
        <Header />
      </div>

      {/* Driver & Attendant Cards */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {[driverDetails, attendantDetails].map((person, idx) => (
          <div
            key={idx}
            className="bg-[#ECF4FF] shadow-md p-4 rounded-lg flex items-start gap-4"
          >
            <img
              src={
                person?.photo ||
                'https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png'
              }
              alt="profile"
              className="rounded-full w-16 h-16 object-cover"
            />
            <div>
              <h2 className="text-gray-600 font-medium text-base">
                {idx === 0 ? 'Driver Details' : 'Bus Attendant Details'}
              </h2>
              <p className="text-gray-800 text-[15px] font-semibold">{person?.fullname}</p>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <FaPhone /> {person?.contact}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <FaEnvelope /> {person?.userId?.email}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Vehicle Info & Bus Stops */}
      <div className="grid md:grid-cols-5 gap-4 mb-6">
        <div className="bg-[#f1f6fb] shadow-md p-6 rounded-lg text-base md:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-10">
            <p><span className="font-medium text-gray-700">Vehicle Type:</span>{' '}
              <span className="text-blue-600 font-medium">{vehicleDetails.vehicleType}</span></p>
            <p><span className="font-medium text-gray-700">Licensed Number Plate:</span>{' '}
              <span className="text-blue-600 font-medium">{vehicleDetails.licencedNumberPlate}</span></p>
            <p><span className="font-medium text-gray-700">Vehicle Name:</span>{' '}
              <span className="text-blue-600 font-medium">BUS 02</span></p>
            <p><span className="font-medium text-gray-700">Start Point:</span>{' '}
              <span className="text-blue-600 font-medium">{vehicleDetails.startPoint?.address}</span></p>
            <p><span className="font-medium text-gray-700">End Point:</span>{' '}
              <span className="text-blue-600 font-medium">{vehicleDetails.endPoint?.address}</span></p>
          </div>
        </div>

        <div className="bg-[#ECF4FF] shadow-md p-4 rounded-lg md:col-span-2 h-64 overflow-y-auto">
          <h3 className="text-xl font-semibold mb-4 sticky top-0 bg-[#ECF4FF] z-10 pb-2">Bus Stops</h3>
          <div className="relative border-l-2 border-blue-400 pl-4 space-y-4">
            {routeDetails?.map((stop, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full -ml-[23px] border-2 border-white z-10"></div>
                  <p className="text-gray-700 text-base">{stop.pickUpPoint}</p>
                </div>
                <p className="text-gray-500 text-base">{stop.timing}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Map & Live Location */}
      <div className="mb-6">
        <h3 className="text-blue-600 font-semibold text-lg mb-2">Live Bus Location</h3>

        {vehicleDetails?.currentLocation ? (
          <div className="h-64 rounded-lg overflow-hidden mb-4">
            <MapContainer
              center={[vehicleDetails.currentLocation.lat, vehicleDetails.currentLocation.lng]}
              zoom={15}
              scrollWheelZoom={false}
              className="h-full w-full"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="© OpenStreetMap"
              />
              <Marker position={[vehicleDetails.currentLocation.lat, vehicleDetails.currentLocation.lng]}>
                <Popup>Live Vehicle Location</Popup>
              </Marker>
            </MapContainer>
          </div>
        ) : (
          <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-400 rounded-lg mb-4">
            <p>[No live location available]</p>
          </div>
        )}

        {vehicleDetails?.currentLocation && (
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <FaMapMarkerAlt className="inline mr-1" />
              <span className="font-medium">Live Location:</span>{' '}
              Lat: <span className="text-blue-600">{vehicleDetails.currentLocation.lat}</span>,{' '}
              Lng: <span className="text-blue-600">{vehicleDetails.currentLocation.lng}</span>
            </p>
            <p>
              <FaBusAlt className="inline mr-1" />
              <span className="font-medium">Updated At:</span>{' '}
              <span className="text-blue-600">
                {new Date(vehicleDetails.currentLocation.updatedAt).toLocaleString()}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Student Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white text-left shadow-md rounded-lg text-sm">
          <thead className="bg-gray-100 text-gray-700 font-medium">
            <tr>
              <th className="py-2 px-4">Student</th>
              <th className="py-2 px-4">Action</th>
              <th className="py-2 px-4">Fee Detail</th>
              <th className="py-2 px-4">Parent No.</th>
              <th className="py-2 px-4">Location</th>
            </tr>
          </thead>
         <tbody>
  {studentDetails?.map((s, i) => (
    <tr key={i} className="border-t">
      <td className="py-2 px-4">
        {s.studentId?.studentProfile?.fullname} <br />
        <span className="text-gray-500 text-sm">{s.action?.checkInTime || '--'}</span>
      </td>
      <td className="py-2 px-4 space-x-1">
        {!s.action?.checkIn ? (
          <span className="text-gray-700 font-semibold">
            {s.action?.checkInTime || '--'}
          </span>
        ) : (
          <button
            onClick={() => handleStudentAction(s._id, 'checkIn')}
            className="px-2 py-1 rounded text-white text-sm bg-green-600"
          >
            Check-in
          </button>
        )}

        <button
          onClick={() => handleStudentAction(s._id, 'checkOut')}
          className={`px-2 py-1 rounded text-white text-sm ${
            s.action?.checkOut ? 'bg-yellow-500' : 'bg-gray-400'
          }`}
        >
          Check-out
        </button>

        <button
          onClick={() => handleStudentAction(s._id, 'Absent')}
          className="px-2 py-1 rounded bg-red-500 text-white text-sm"
        >
          Absent
        </button>
      </td>
      <td className="py-2 px-4">
        ₹{s.totalFee} <br />
        Paid: ₹{s.amountPaid} <br />
        Due: ₹{s.amountDue}
      </td>
      <td className="py-2 px-4">{s.parent?.fatherPhoneNumber}</td>
      <td className="py-2 px-4">{s.pickUpLocation}</td>
    </tr>
  ))}
</tbody>

        </table>
      </div>
    </div>
  );
};

export default Transportation;
