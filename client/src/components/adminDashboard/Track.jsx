import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVehicleDetailsById } from '../../redux/transSlice';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon path issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Track = ({ vehicleId }) => {
  const dispatch = useDispatch();
  const { vehicleDetails, loading, error } = useSelector(state => state.transportation);

  useEffect(() => {
    if (vehicleId) dispatch(fetchVehicleDetailsById({ vehicleId }));
  }, [dispatch, vehicleId]);

  if (!vehicleId) return <div className="text-red-500">Vehicle ID is missing!</div>;
  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  const vehicle = vehicleDetails?.vehicle || {};
  const details = vehicle.vehicleDetails || {};
  const route = vehicle.routeDetails || [];

  const currentLoc = details?.currentLocation;
  const start = details?.startPoint;
  const end = details?.endPoint;

  const center = currentLoc?.lat && currentLoc?.lng ? [currentLoc.lat, currentLoc.lng] : [17.4, 78.4];

  const fullRoute = [
    ...(start ? [{ ...start, name: 'Start Point' }] : []),
    ...route.map(r => ({ ...r, name: r.pickUpPoint })),
    ...(end ? [{ ...end, name: 'End Point' }] : []),
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-[#146192]">Track Vehicle</h1>
        <p className="text-sm text-gray-600">Live tracking of route and stops</p>
      </div>

      {/* Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Map Section */}
        <div className="lg:w-3/5 h-[400px] shadow rounded border overflow-hidden">
          <MapContainer center={center} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {fullRoute.map((point, idx) => (
              <Marker key={idx} position={[point.lat, point.lng]}>
                <Popup>
                  <strong>{point.name}</strong><br />
                  {point.timing ? `Time: ${point.timing}` : point.address || ''}
                </Popup>
              </Marker>
            ))}
            <Marker position={center}>
              <Popup><strong>Current Location</strong></Popup>
            </Marker>
            <Polyline positions={fullRoute.map(p => [p.lat, p.lng])} color="blue" />
          </MapContainer>
        </div>

        {/* Info Panel */}
        <div className="lg:w-2/5 bg-white shadow rounded p-4 space-y-4">
          <h2 className="text-xl font-bold text-[#146192]">Vehicle Info</h2>
          <p><strong>Name:</strong> {details.vehicleName}</p>
          <p><strong>Number Plate:</strong> {details.licencedNumberPlate}</p>
          <p><strong>Vehicle Type:</strong> {details.vehicleType}</p>
          <p><strong>Start:</strong> {start?.address}</p>
          <p><strong>End:</strong> {end?.address}</p>

          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Stops</h3>
            <ul className="divide-y divide-gray-200">
              {route.map((stop, idx) => (
                <li key={stop._id} className="py-2">
                  <p className="font-medium text-gray-800">{stop.pickUpPoint}</p>
                  <p className="text-sm text-gray-500">Time: {stop.timing}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Track;
