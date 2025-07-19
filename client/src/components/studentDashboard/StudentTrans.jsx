// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchSTransportationDetails } from "../../redux/student/stransportationSlice";
// import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import { FaPhone, FaMapMarkerAlt, FaBusAlt } from "react-icons/fa";

// const StudentTrans = () => {
//   const dispatch = useDispatch();

//   const { data = [], loading, error } =
//     useSelector((state) => state.stransportation) || {};

//   useEffect(() => {
//     dispatch(fetchSTransportationDetails());
//   }, [dispatch]);

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p className="text-red-500">Error: {error}</p>;

//   return (
//     <div className="p-4">
//       {data.map((item, index) => (
//         <div key={index} className="bg-white rounded-lg p-4 shadow mb-4">
//           <h2 className="text-lg font-semibold mb-2">{item.routeName}</h2>
//           <p className="flex items-center">
//             <FaBusAlt className="mr-2 text-blue-500" />
//             Bus No: {item.busNumber}
//           </p>
//           <p className="flex items-center">
//             <FaPhone className="mr-2 text-green-600" />
//             Driver Contact: {item.driverContact}
//           </p>
//           <p className="flex items-center">
//             <FaMapMarkerAlt className="mr-2 text-red-500" />
//             From: {item.from} To: {item.to}
//           </p>

//           {/* Leaflet Map */}
//           {item.locations && item.locations.length >= 2 && (
//             <MapContainer
//               center={[item.locations[0].lat, item.locations[0].lng]}
//               zoom={13}
//               style={{ height: "300px", marginTop: "1rem" }}
//             >
//               <TileLayer
//                 attribution='&copy; OpenStreetMap contributors'
//                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//               />
//               {item.locations.map((loc, i) => (
//                 <Marker key={i} position={[loc.lat, loc.lng]}>
//                   <Popup>
//                     Stop {i + 1}: {loc.name || `(${loc.lat}, ${loc.lng})`}
//                   </Popup>
//                 </Marker>
//               ))}
//               <Polyline
//                 positions={item.locations.map((loc) => [loc.lat, loc.lng])}
//                 color="blue"
//               />
//             </MapContainer>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default StudentTrans;
