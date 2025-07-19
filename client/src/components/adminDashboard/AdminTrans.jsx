import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransportationDetails } from '../../redux/transSlice';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import Header from './layout/Header';

const COLORS1 = ['#8884d8', '#82ca9d', '#ffc658'];
const COLORS2 = ['#ff6b6b', '#4ecdc4'];

const AdminTrans = () => {
  const dispatch = useDispatch();
  const { transDetails, loading } = useSelector((state) => state.transportation);

  useEffect(() => {
    dispatch(fetchTransportationDetails());
  }, [dispatch]);

  if (loading || !transDetails) return <div className="text-center mt-10 text-xl">Loading data...</div>;

  const { autos, autoDrivers, buses, busDrivers, vans, vanDrivers, boys, girls } = transDetails;

  const vehicleDriverData = [
    { name: 'Autos', value: autos },
    { name: 'Auto Drivers', value: autoDrivers },
    { name: 'Buses', value: buses },
    { name: 'Bus Drivers', value: busDrivers },
    { name: 'Vans', value: vans },
    { name: 'Van Drivers', value: vanDrivers },
  ];

  const studentData = [
    { name: 'Boys Using Vehicle', value: boys },
    { name: 'Girls Using Vehicle', value: girls },
  ];

  return (
    <div className="p-4">
      <Header />
      <h1 className="text-3xl font-semibold text-center my-6">Transportation Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center items-center">
        {/* Vehicles and Drivers Donut */}
        <div className="flex flex-col items-center shadow rounded-2xl p-6 bg-white">
          <h2 className="text-xl font-medium mb-4">No. of Vehicles and Drivers</h2>
          <PieChart width={300} height={300}>
            <Pie
              data={vehicleDriverData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={50}
              fill="#8884d8"
              label
            >
              {vehicleDriverData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS1[index % COLORS1.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        {/* Students Using Vehicle Donut */}
        <div className="flex flex-col items-center shadow rounded-2xl p-6 bg-white">
          <h2 className="text-xl font-medium mb-4">Students Using School Vehicle</h2>
          <PieChart width={300} height={300}>
            <Pie
              data={studentData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={50}
              fill="#ff6b6b"
              label
            >
              {studentData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS2[index % COLORS2.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>
    </div>
  );
};

export default AdminTrans;
