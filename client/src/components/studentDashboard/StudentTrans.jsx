import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FaPhone } from "react-icons/fa";
import { fetchSTransportationDetails } from "../../redux/student/stransportationSlice";
import { fetchProfile } from "../../redux/student/studashboardSlice";
import Header from "./layout/Header";

// Leaflet Icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const busIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/8831/8831223.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const startIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
  iconSize: [32, 32],
});

const endIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [32, 32],
});

const stopIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
  iconSize: [32, 32],
});

const StudentTrans = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector(
    (state) => state.stransportation
  );
  const { profile } = useSelector((state) => state.studentDashboard);
  const studentProfile = profile?.Data?.studentProfile;

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchSTransportationDetails());
  }, [dispatch]);

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (error)
    return (
      <div className="text-center mt-20 text-red-600">Error: {error}</div>
    );
  if (!data?.vehicle)
    return (
      <div className="text-center mt-20 text-gray-500">
        No transportation data available
      </div>
    );

  const {
    vehicleDetails = {},
    routeDetails = [],
    driverDetails = {},
    attendantDetails = {},
    studentDetails = [],
  } = data.vehicle;

  const startPoint = vehicleDetails.startPoint;
  const endPoint = vehicleDetails.endPoint;
  const liveLocation = vehicleDetails.currentLocation;
  const polylinePoints = routeDetails.map(({ lat, lng }) => [lat, lng]);

  return (
    <div className="p-4 md:p-6 space-y-6 mt-20">
      {/* Header */}
      <div className="hidden md:flex justify-between items-start md:items-center -mt-20 mb-4">
        <div>
          <h1 className="text-xl sm:text-2xl xl:text-[32px] font-normal text-black">
            Transportation
          </h1>
          <hr className="mt-1 border-[#146192] border-[1px] w-[120px] sm:w-[150px]" />
          <h1 className="mt-1 text-sm sm:text-base">
            <span>Home</span> {">"}{" "}
            <span className="font-medium text-[#146192]">Transportation</span>
          </h1>
        </div>
        <Header />
      </div>

      <div className="md:hidden mb-4">
        <Header />
      </div>

      {/* Title Left + Card Centered */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Live tracking of{" "}
          <span className="text-[#146192]">
            {studentProfile?.fullname || "Student"}
          </span>
        </h2>
      </div>

      <div className="flex justify-center">
        <div className="bg-[#146192] text-white px-4 py-3 rounded-lg flex items-center gap-4 shadow">
          <img
            src={
              studentProfile?.photo || "https://via.placeholder.com/60"
            }
            alt="student"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="text-sm leading-relaxed">
            <p>
              Name:{" "}
              <span className="font-semibold">
                {studentProfile?.fullname}
              </span>
            </p>
            <p>
              Student Registration No:{" "}
              <span className="font-semibold">
                {studentProfile?.registrationNumber}
              </span>
            </p>
            <p>
              Class: {studentProfile?.class} &nbsp;&nbsp; Section:{" "}
              {studentProfile?.section}
            </p>
          </div>
        </div>
      </div>

     {/* Live Location Map Section */}
<div className="bg-white shadow-md rounded-xl p-4">
  <h3 className="text-lg font-semibold text-gray-700 mb-2">
    Live Vehicle Location
  </h3>

  {liveLocation ? (
    <div className="w-full h-64 md:h-72 rounded-md overflow-hidden mb-4">
      <MapContainer
        center={[liveLocation.lat, liveLocation.lng]}
        zoom={14}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />

        {/* Polyline */}
        <Polyline
          positions={[
            ...(startPoint ? [startPoint] : []),
            ...routeDetails.map((stop) => ({ lat: stop.lat, lng: stop.lng })),
            ...(endPoint ? [endPoint] : []),
          ].map((point) => [point.lat, point.lng])}
          pathOptions={{ color: "black", weight: 4 }}
        />

        {/* Start Point */}
        {startPoint && (
          <Marker
            position={[startPoint.lat, startPoint.lng]}
            icon={startIcon}
          >
            <Popup>🟢 Start Point</Popup>
          </Marker>
        )}

        {/* Stops */}
        {routeDetails?.map((stop, i) => (
          <Marker
            key={i}
            position={[stop.lat, stop.lng]}
            icon={stopIcon}
          >
            <Popup>🟡 {stop.pickUpPoint}</Popup>
          </Marker>
        ))}

        {/* End Point */}
        {endPoint && (
          <Marker
            position={[endPoint.lat, endPoint.lng]}
            icon={endIcon}
          >
            <Popup>🔴 End Point</Popup>
          </Marker>
        )}

        {/* Live Bus Marker */}
        <Marker
          position={[liveLocation.lat, liveLocation.lng]}
          icon={busIcon}
        >
          <Popup>🚌 Live Vehicle Location</Popup>
        </Marker>
      </MapContainer>
    </div>
  ) : (
    <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-400 rounded-md mb-4">
      <p>No live location available</p>
    </div>
  )}

  {/* Info Under Map */}
  <div className="text-sm text-gray-600 grid grid-cols-1 sm:grid-cols-3 gap-2">
    <p>
      <strong>Driver:</strong> {driverDetails?.fullname || "N/A"}
    </p>
    <p>
      <strong>Date:</strong> {new Date().toLocaleDateString()}
    </p>
    <p>
      <strong>Pick-up Time:</strong>{" "}
      {routeDetails?.[0]?.timing || "N/A"}
    </p>
    <p>
      <strong>Drop-off Time:</strong> {vehicleDetails?.dropOffTime || "N/A"}
    </p>
    <p>
      <strong>Distance:</strong> {vehicleDetails?.distance || "N/A"} kms
    </p>
    <p>
      <strong>Bus No:</strong> {vehicleDetails?.vehicleName || "N/A"}
    </p>
    {liveLocation && (
      <>
        <p>
          <strong>Live Location:</strong>{" "}
          <span className="text-blue-600">
            Lat: {liveLocation.lat}, Lng: {liveLocation.lng}
          </span>
        </p>
        <p>
          <strong>Updated At:</strong>{" "}
          <span className="text-blue-600">
            {new Date(liveLocation.updatedAt).toLocaleString()}
          </span>
        </p>
      </>
    )}
  </div>
</div>

{/* Bus Info Header */}
<div className="flex justify-between items-center mb-4">
  <div className="text-[#146192] font-bold text-lg">
    Bus No.
  </div>
  <div className="text-gray-700 font-semibold text-md">
    {vehicleDetails?.licencedNumberPlate || "N/A"}
  </div>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
  {/* Bus Stops */}
  <div className="bg-white rounded-xl shadow p-4 w-full h-96 overflow-y-auto">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-[18px] font-semibold text-[#146192] border-b border-[#146192] pb-1">
        Bus Stops
      </h3>
     
    </div>
    <div className="relative pl-10 pr-2">
      <div className="absolute left-4 top-0 h-full w-0.5 bg-[#14619280]"></div>
      {routeDetails?.map((stop, i) => (
        <div
          key={i}
          className="relative flex items-center justify-between mb-6"
        >
          <span className="absolute -left-7 top-1 w-3 h-3 bg-[#146192] rounded-full z-10"></span>
          <span className="text-sm text-gray-700">{stop.pickUpPoint}</span>
          <span className="text-sm font-semibold text-gray-900">
            {stop.timing}
          </span>
        </div>
      ))}
    </div>
  </div>

  {/* Contacts */}
  <div className="bg-white rounded-xl shadow p-4">
    <h3 className="text-[18px] font-semibold text-[#146192]  border-b border-[#146192] pb-1 mb-4">
      Contacts
    </h3>

    {/* Driver Card */}
    <div className="flex items-center gap-4 bg-[#EAF3FB] p-3 rounded-lg border-l-4 border-[#146192] mb-4">
      <img
        src={driverDetails?.photo || "https://via.placeholder.com/40"}
        alt="Driver"
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="text-sm">
        <p className="font-semibold text-[#146192]">Driver Details</p>
        <p>Name: {driverDetails?.fullname || "N/A"}</p>
        <p className="flex items-center gap-1">
          <FaPhone className="text-xs" /> {driverDetails?.contact || "N/A"}
        </p>
      </div>
    </div>

    {/* Attendant Card */}
    {attendantDetails?.fullname && (
      <div className="flex items-center gap-4 bg-[#EAF3FB] p-3 rounded-lg border-l-4 border-[#146192]">
        <img
          src={attendantDetails?.photo || "https://via.placeholder.com/40"}
          alt="Attendant"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="text-sm">
          <p className="font-semibold text-[#146192]">Bus Attendant Details</p>
          <p>Name: {attendantDetails?.fullname}</p>
          <p className="flex items-center gap-1">
            <FaPhone className="text-xs" /> {attendantDetails?.contact}
          </p>
        </div>
      </div>
    )}
  </div>
</div>

{/* Student Details Table */}
<div className="bg-white rounded-xl shadow-md p-4">
  <h3 className="text-lg font-semibold mb-4 text-[#0f4a70]">Student Details</h3>
  
  <div className="overflow-x-auto">
    <table className="min-w-[900px] w-full border border-gray-300 text-sm text-left ">
      <thead className="bg-[#146192E8] text-white">
        <tr>
          <th className="p-3 border border-gray-300">S.No</th>
          <th className="p-3 border border-gray-300">Name</th>
          <th className="p-3 border border-gray-300">Class</th>
          <th className="p-3 border border-gray-300">Section</th>
          <th className="p-3 border border-gray-300">Parent Name</th>
          <th className="p-3 border border-gray-300">Contact</th>
          <th className="p-3 border border-gray-300">Pick-up Location</th>
        </tr>
      </thead>

      <tbody>
        {studentDetails?.map((entry, idx) => {
          const profile = entry?.studentId?.studentProfile || {};
          const parent = entry?.parent || {};
          return (
            <tr key={entry._id || idx} className="hover:bg-[#f9f9f9] border-t border-gray-200">
              <td className="p-3 border border-gray-300">{idx + 1}</td>
              <td className="p-3 border border-gray-300">{profile.fullname || "N/A"}</td>
              <td className="p-3 border border-gray-300">{profile.class || "N/A"}</td>
              <td className="p-3 border border-gray-300">{profile.section || "N/A"}</td>
              <td className="p-3 border border-gray-300">{parent.fatherName || "N/A"}</td>
              <td className="p-3 border border-gray-300 break-words">
                {parent.fatherPhoneNumber ? `+91-${parent.fatherPhoneNumber}` : "N/A"}
              </td>
              <td className="p-3 border border-gray-300 break-words max-w-xs">
                {entry.pickUpLocation || "N/A"}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
      </div>
    </div>
  );
};

export default StudentTrans;
