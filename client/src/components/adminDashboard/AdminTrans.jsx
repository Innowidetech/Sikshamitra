import React, { useEffect } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import { FaPlus, FaMapMarkerAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransportationDetails } from "../../redux/transSlice";
import { useNavigate } from "react-router-dom"; // ✅ For navigation

const  AdminTrans = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ✅


  const { transDetails, loading, error } = useSelector(
    (state) => state.trans
  );




  useEffect(() => {
    dispatch(fetchTransportationDetails());
  }, [dispatch]);

  const vehicleData = [
    {
      name: "Bus",
      value: transDetails.buses || 0,
      drivers: transDetails.busDrivers || 0,
    },
    {
      name: "Auto",
      value: transDetails.autos || 0,
      drivers: transDetails.autoDrivers || 0,
    },
    {
      name: "Van",
      value: transDetails.vans || 0,
      drivers: transDetails.vanDrivers || 0,
    },
  ];

  const studentData = [
    { name: "Girls", value: transDetails.girls || 0 },
    { name: "Boys", value: transDetails.boys || 0 },
  ];

  const COLORS1 = ["#FFB347", "#6EC1E4", "#FFA6C9"];
  const COLORS2 = ["#FF91A4", "#8379FF"];

  const tableData = (transDetails.vehicles || []).map((vehicle, idx) => ({
    id: vehicle._id,
    driver: vehicle.driverDetails?.fullname || "-",
    type: vehicle.vehicleDetails?.vehicleType || "-",
    name: vehicle.vehicleDetails?.vehicleName || "-",
    contact: vehicle.driverDetails?.contact || "-",
    assistant: vehicle.attendantDetails?.fullname || "-",
    time: vehicle.routeDetails || "-",
  }));

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="inline-block">
        <h1 className="text-xl font-light text-black xl:text-[38px]">
          Transportation
        </h1>
        <hr className="border-t-2 border-[#146192] mt-1" />
        <h1 className="mt-2">
          <span className="xl:text-[17px] text-xs lg:text-lg">Home</span>{" > "}
          <span className="xl:text-[17px] text-xs md:text-lg font-medium text-[#146192]">
            Transportation
          </span>
        </h1>
      </div>

      {/* Loading / Error / No Data */}
      {loading && <p className="mt-4 text-center text-lg">Loading data...</p>}
      {error && <p className="mt-4 text-center text-red-600">{error}</p>}
      {!loading && !error && tableData.length === 0 && (
        <p className="mt-4 text-center text-gray-600">No data available</p>
      )}

      {/* Charts */}
      {!loading && !error && tableData.length > 0 && (
        <div className="flex flex-col lg:flex-row justify-around gap-10 mt-20">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-[#0F4A70] mb-2">
              No. of Vehicles and Drivers
            </h2>
            <PieChart width={300} height={300}>
              <Pie
                data={vehicleData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                fill="#8884d8"
                paddingAngle={3}
                dataKey="value"
                label={({ name, value, index }) =>
                  `No. of ${name}s: ${value}\nNo. of Drivers: ${vehicleData[index].drivers}`
                }
              >
                {vehicleData.map((_, index) => (
                  <Cell key={index} fill={COLORS1[index % COLORS1.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>

          <div className="text-center">
            <h2 className="text-lg font-semibold text-[#0F4A70] mb-2">
              No. of Students Using School Vehicle
            </h2>
            <PieChart width={300} height={300}>
              <Pie
                data={studentData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ value }) => `${value}`}
              >
                {studentData.map((_, index) => (
                  <Cell key={index} fill={COLORS2[index % COLORS2.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </div>
      )}

     {!loading && !error && tableData.length > 0 && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center my-6 gap-4">
          <h2 className="text-xl font-semibold text-[#0F4A70]">Vehicle Details</h2>
          <button
            className="bg-[#0F4A70] text-white px-4 py-2 rounded shadow-md flex items-center gap-2 hover:bg-[#073559]"
            onClick={() => navigate("/admin/transportation/add")}
          >
            <FaPlus /> Add Vehicle
          </button>
        </div>
      )}

      {/* ✅ Table View (Desktop/Tablet) */}
      {!loading && !error && tableData.length > 0 && (
        <div className="overflow-x-auto rounded-md shadow-md border border-gray-200 hidden md:block">
          <table className="min-w-full text-sm text-center bg-white">
            <thead className="bg-[#f1f1f1] text-gray-700">
              <tr>
                <th className="border px-4 py-2 whitespace-nowrap">S.NO</th>
                <th className="border px-4 py-2 whitespace-nowrap">Driver Name</th>
                <th className="border px-4 py-2 whitespace-nowrap">Type</th>
                <th className="border px-4 py-2 whitespace-nowrap">Vehicle Name</th>
                <th className="border px-4 py-2 whitespace-nowrap">Driver Contact No.</th>
                <th className="border px-4 py-2 whitespace-nowrap">Assistant Name</th>
                <th className="border px-4 py-2 whitespace-nowrap">Departure Time</th>
                <th className="border px-4 py-2 whitespace-nowrap">Track</th>
                <th className="border px-4 py-2 whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {tableData.map((item, idx) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{idx + 1}</td>
                  <td className="border px-4 py-2">{item.driver}</td>
                  <td className="border px-4 py-2">{item.type}</td>
                  <td className="border px-4 py-2">{item.name}</td>
                  <td className="border px-4 py-2">{item.contact}</td>
                  <td className="border px-4 py-2">{item.assistant}</td>
                  <td className="border px-4 py-2">{item.time}</td>
                  <td className="border px-4 py-2">
                    <FaMapMarkerAlt
                      className="text-[#146192] cursor-pointer mx-auto"
                      onClick={() =>
                        navigate(`/admin/transportation/track/${item.id}`)
                      }
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      className="bg-[#0F4A70] text-white px-3 py-1 rounded hover:bg-[#073559]"
                      onClick={() =>
                        navigate(`/admin/transportation/view/${item.id}`)
                      }
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ✅ Mobile Card View */}
     {/* ✅ Mobile Card View - like table inside card */}
{!loading && !error && tableData.length > 0 && (
  <div className="grid gap-4 md:hidden">
    {tableData.map((item, idx) => (
      <div
        key={item.id}
        className="bg-white rounded-lg shadow-md border border-gray-300 overflow-hidden"
      >
        <table className="w-full text-sm text-left">
          <tbody>
            <tr className="border-b">
              <td className="font-medium p-2 border-r w-1/2">Driver Name</td>
              <td className="p-2">{item.driver}</td>
            </tr>
            <tr className="border-b">
              <td className="font-medium p-2 border-r">Type</td>
              <td className="p-2">{item.type}</td>
            </tr>
            <tr className="border-b">
              <td className="font-medium p-2 border-r">Vehicle Name</td>
              <td className="p-2">{item.name}</td>
            </tr>
            <tr className="border-b">
              <td className="font-medium p-2 border-r">Driver Contact No.</td>
              <td className="p-2">{item.contact}</td>
            </tr>
            <tr className="border-b">
              <td className="font-medium p-2 border-r">Assistant Time</td>
              <td className="p-2">{item.assistant || "-"}</td>
            </tr>
            <tr className="border-b">
              <td className="font-medium p-2 border-r">Departure Time</td>
              <td className="p-2">{item.time}</td>
            </tr>
            <tr className="border-b">
              <td className="font-medium p-2 border-r">Track</td>
              <td className="p-2">
                <FaMapMarkerAlt
                  className="text-[#146192] cursor-pointer text-xl"
                  onClick={() =>
                    navigate(`/admin/transportation/track/${item.id}`)
                  }
                />
              </td>
            </tr>
            <tr>
              <td className="font-medium p-2 border-r">Action</td>
              <td className="p-2">
                <button
                  className="bg-[#0F4A70] text-white px-4 py-1 rounded hover:bg-[#073559]"
                  onClick={() =>
                    navigate(`/admin/transportation/view/${item.id}`)
                  }
                >
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    ))}
  </div>
)}

    </div>
  );
};

export default  AdminTrans;
