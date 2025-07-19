import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaPhone, FaMapMarkerAlt, FaBusAlt } from 'react-icons/fa';
import Header from './layout/Header';
import { fetchPTransportationDetails } from '../../redux/parent/ptransportationSlice';
import { fetchDashboardData } from '../../redux/parent/pkidsSlice';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
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

// Custom Icons
const busIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/8831/8831223.png', // choose another if you prefer
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const startIcon = new L.Icon({
  iconUrl: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
  iconSize: [32, 32],
});

const endIcon = new L.Icon({
  iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
  iconSize: [32, 32],
});

const stopIcon = new L.Icon({
  iconUrl: 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
  iconSize: [32, 32],
});

const Ptransportation = () => {
  const dispatch = useDispatch();

  const { data, loading, error } = useSelector((state) => state.ptransportation);
  const { selectedStudent, status: kidsStatus } = useSelector((state) => state.pkids);

  useEffect(() => {
    dispatch(fetchDashboardData());
    dispatch(fetchPTransportationDetails());
  }, [dispatch]);

  if (loading || kidsStatus === 'loading') {
    return <div className="text-center mt-20">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-red-600">Error: {error}</div>;
  }

  if (!data || !data.vehicle || !selectedStudent) {
    return null;
  }

  const {
    vehicle: {
      studentDetails,
      vehicleDetails,
      routeDetails,
      driverDetails,
      attendantDetails,
    },
  } = data;

  const studentInfo = {
    name: selectedStudent?.studentProfile?.fullname,
    regNo: selectedStudent?._id,
    class: selectedStudent?.studentProfile?.class,
    section: selectedStudent?.studentProfile?.section,
    photo: selectedStudent?.studentProfile?.photo,
  };

  const stops = routeDetails?.map((stop) => ({
    name: stop.pickUpPoint,
    time: stop.timing,
    lat: stop.lat,
    lng: stop.lng,
  }));

  const students = studentDetails?.map((s) => ({
    name: s.studentId?.studentProfile?.fullname,
    class: s.studentId?.studentProfile?.class,
    section: s.studentId?.studentProfile?.section,
    parentName: s.parent?.fatherName,
    phone: s.parent?.fatherPhoneNumber,
    location: s.pickUpLocation,
  }));

  const driver = {
    name: driverDetails?.fullname,
    phone: driverDetails?.contact,
    photo: driverDetails?.photo,
    attendantName: attendantDetails?.fullname,
    attendantPhone: attendantDetails?.contact,
    attendantPhoto: attendantDetails?.photo,
  };

  const busNo = {
    number: vehicleDetails?.busNo,
    registration: vehicleDetails?.registrationNo,
  };

 const pickupTime = routeDetails?.[0]?.timing || 'N/A';
const dropTime = routeDetails?.[routeDetails.length - 1]?.timing || 'N/A';

  const distance = vehicleDetails?.distance;

  const currentLocation = vehicleDetails?.currentLocation;
  const start = vehicleDetails?.startPoint;
  const end = vehicleDetails?.endPoint;

  const polylinePoints = [
    ...(start ? [[start.lat, start.lng]] : []),
    ...stops.map((s) => [s.lat, s.lng]),
    ...(end ? [[end.lat, end.lng]] : []),
  ];

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mx-4 md:mx-10 mt-20 md:ml-72 gap-4">
        <div>
          <h1 className="text-2xl font-light text-black xl:text-[38px]">Transportation</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
          <h1 className="mt-2 text-sm md:text-base">
            <span>Parent Dashboard</span> {'>'}
            <span className="font-medium text-[#146192] ml-1">Transportation</span>
          </h1>
        </div>
        <Header />
      </div>

      <div className="p-4 md:p-6 space-y-6 md:ml-72">
        <h2 className="text-lg font-semibold">
          Live tracking of <span className="text-blue-600">{studentInfo?.name}</span>
        </h2>

        {/* Student Profile */}
        <div className="bg-[#146192] text-white shadow-md rounded-xl p-4 space-y-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <img
              src={studentInfo?.photo || "/path/to/profile.jpg"}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <p><strong>Name:</strong> {studentInfo?.name}</p>
              <p><strong>Student Registration No:</strong> {studentInfo?.regNo}</p>
              <p><strong>Class:</strong> {studentInfo?.class} &nbsp;&nbsp;
                <strong>Section:</strong> {studentInfo?.section}</p>
            </div>
          </div>
        </div>

        {/* Map with Live Location and Route */}
        <div className="bg-white shadow-md rounded-xl p-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Live Vehicle Location</h3>

          {currentLocation ? (
  <div className="w-full h-64 md:h-72 rounded-md overflow-hidden mb-4">
    <MapContainer
      center={[currentLocation.lat, currentLocation.lng]}
      zoom={14}
      scrollWheelZoom={false}
      className="h-full w-full"
      whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />

      {/* Polyline: Draw the route path */}
      <Polyline
        positions={[
          ...(vehicleDetails?.startPoint ? [vehicleDetails.startPoint] : []),
          ...routeDetails.map((stop) => ({ lat: stop.lat, lng: stop.lng })),
          ...(vehicleDetails?.endPoint ? [vehicleDetails.endPoint] : []),
        ].map((point) => [point.lat, point.lng])}
        pathOptions={{ color: 'black', weight: 5 }}
      />

      {/* Start Marker */}
      {vehicleDetails?.startPoint && (
        <Marker
          position={[vehicleDetails.startPoint.lat, vehicleDetails.startPoint.lng]}
          icon={startIcon}
        >
          <Popup>🟢 School</Popup>
        </Marker>
      )}

      {/* Route Stops */}
      {routeDetails?.map((stop, index) => (
        <Marker
          key={index}
          position={[stop.lat, stop.lng]}
          icon={stopIcon}
        >
          <Popup>🟡 {stop.pickUpPoint}</Popup>
        </Marker>
      ))}

      {/* End Marker */}
      {vehicleDetails?.endPoint && (
        <Marker
          position={[vehicleDetails.endPoint.lat, vehicleDetails.endPoint.lng]}
          icon={endIcon}
        >
          <Popup>🔴 Destination</Popup>
        </Marker>
      )}

      {/* Live Bus Marker */}
      <Marker position={[currentLocation.lat, currentLocation.lng]} icon={busIcon}>
        <Popup>🚌 Live Vehicle Location</Popup>
      </Marker>
    </MapContainer>
  </div>
) : (
  <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-400 rounded-md mb-4">
    <p>No live location available</p>
  </div>
)}


          <div className="text-sm text-gray-600 grid grid-cols-1 sm:grid-cols-3 gap-2">
            <p><strong>Driver:</strong> {driver?.name}</p>
            <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
            <p><strong>Pick-up Time:</strong> {pickupTime}</p>
            <p><strong>Drop-off Time:</strong> {dropTime}</p>
            <p><strong>Distance:</strong> {distance}</p>
            {currentLocation && (
              <>
                <p><FaMapMarkerAlt className="inline mr-1" /> <strong>Live Location:</strong> Lat: <span className="text-blue-600">{currentLocation.lat}</span>, Lng: <span className="text-blue-600">{currentLocation.lng}</span></p>
                <p><FaBusAlt className="inline mr-1" /> <strong>Updated At:</strong> <span className="text-blue-600">{new Date(currentLocation.updatedAt).toLocaleString()}</span></p>
              </>
            )}
          </div>
        </div>

        {/* Bus Info */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-blue-600 font-medium">
          <p>Bus No: <span className="underline cursor-pointer">{busNo?.number}</span></p>
          <p>{busNo?.registration}</p>
        </div>

        {/* Bus Stops */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-4 w-full max-w-md h-96 overflow-y-auto">
            <h3 className="font-semibold mb-4 border-b pb-2">Bus Stops</h3>
            <div className="relative pl-10">
              <div className="absolute left-4 top-0 h-full w-0.5 bg-[#14619280]"></div>
              {stops?.map((s, i) => (
                <div key={i} className="relative flex items-center justify-between mb-6">
                  <span className="absolute -left-7 top-1 w-3 h-3 bg-[#146192] rounded-full z-10"></span>
                  <span className="text-sm text-gray-700">{s.name}</span>
                  <span className="text-sm font-semibold text-gray-900">{s.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contacts */}
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold mb-4">Contacts</h3>
            <div className="flex items-center gap-4 bg-[#EAF3FB] p-3 rounded-lg border-l-4 border-[#146192] mb-4">
              <img
                src={driver?.photo || "https://via.placeholder.com/40"}
                alt="Driver"
                className="w-10 h-10 rounded-full"
              />
              <div className="text-sm">
                <p className="font-semibold text-[#146192]">Driver Details</p>
                <p>Name: {driver?.name}</p>
                <p className="flex items-center gap-1"><FaPhone className="text-xs" /> {driver?.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-[#EAF3FB] p-3 rounded-lg border-l-4 border-[#146192]">
              <img
                src={driver?.attendantPhoto || "https://via.placeholder.com/40"}
                alt="Attendant"
                className="w-10 h-10 rounded-full"
              />
              <div className="text-sm">
                <p className="font-semibold text-[#146192]">Bus Attendant Details</p>
                <p>Name: {driver?.attendantName}</p>
                <p className="flex items-center gap-1"><FaPhone className="text-xs" /> {driver?.attendantPhone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Student Table */}
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="font-semibold mb-3">Student Details</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border border-gray-300">
              <thead className="bg-[#EAF3FB] text-[#146192]">
                <tr>
                  <th className="p-2 border">S.No</th>
                  <th className="p-2 border">Student Name</th>
                  <th className="p-2 border">Class</th>
                  <th className="p-2 border">Section</th>
                  <th className="p-2 border">Parent Name</th>
                  <th className="p-2 border">Student Contact</th>
                  <th className="p-2 border">Pick-up Location</th>
                </tr>
              </thead>
              <tbody>
                {students?.map((s, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2 border">{i + 1}</td>
                    <td className="p-2 border">{s.name}</td>
                    <td className="p-2 border">{s.class}</td>
                    <td className="p-2 border">{s.section}</td>
                    <td className="p-2 border">{s.parentName}</td>
                    <td className="p-2 border break-all">+91-{s.phone}</td>
                    <td className="p-2 border break-words">{s.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Ptransportation;
