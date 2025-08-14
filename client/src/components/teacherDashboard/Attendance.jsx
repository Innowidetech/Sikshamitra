// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// // import { fetchAttendance, clearAttendance } from '../../redux/teacher/attendanceSlice';

// const Attendance = () => {
//   const dispatch = useDispatch();
//   const { attendanceData, loading, error } = useSelector((state) => state.attendance);

//   const [filters, setFilters] = useState({
//     month: '',
//     year: '',
//     date: '',
//   });

//   useEffect(() => {
//     // Auto-fetch for current date (optional)
//     const today = new Date();
//     setFilters({
//       month: String(today.getMonth() + 1).padStart(2, '0'),
//       year: String(today.getFullYear()),
//       date: today.toISOString().split('T')[0],
//     });
//   }, []);

//   useEffect(() => {
//     if (filters.month && filters.year && filters.date) {
//       dispatch(fetchAttendance(filters));
//     }

//     return () => {
//       dispatch(clearAttendance());
//     };
//   }, [dispatch, filters]);

//   const handleChange = (e) => {
//     setFilters({
//       ...filters,
//       [e.target.name]: e.target.value,
//     });
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-semibold mb-4">Attendance</h2>

//       <div className="flex flex-wrap gap-4 mb-6">
//         <input
//           type="month"
//           name="month"
//           value={`${filters.year}-${filters.month}`}
//           onChange={(e) => {
//             const [year, month] = e.target.value.split('-');
//             setFilters({ ...filters, year, month });
//           }}
//           className="border p-2 rounded"
//         />

//         <input
//           type="date"
//           name="date"
//           value={filters.date}
//           onChange={handleChange}
//           className="border p-2 rounded"
//         />
//       </div>

//       {loading && <p>Loading attendance...</p>}
//       {error && <p className="text-red-500">Error: {error}</p>}

//       {!loading && attendanceData.length === 0 && <p>No attendance records found.</p>}

//       {!loading && attendanceData.length > 0 && (
//         <div className="overflow-x-auto">
//           <table className="min-w-full border border-gray-300">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="px-4 py-2 border">Student</th>
//                 <th className="px-4 py-2 border">Status</th>
//                 <th className="px-4 py-2 border">Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {attendanceData.map((item) => (
//                 <tr key={item._id}>
//                   <td className="px-4 py-2 border">{item.student}</td>
//                   <td className="px-4 py-2 border">{item.status}</td>
//                   <td className="px-4 py-2 border">{item.date}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Attendance;
