// import React from 'react';
// import Header from '../adminStaffDashboard/layout/Header';

// const StaffQuery = ({ onSendQuery }) => {
//   return (
//     <div className="bg-[#f3f9fb] min-h-screen">
//       {/* Top Header */}
//       <Header />

//       <div className="p-4 md:p-6">
        

//         {/* Breadcrumb */}
//         <div className="flex justify-between items-center mx-8  md:ml-64 py-10">
//           <div>
//             <h1 className="text-xl font-light xl:text-[32px]">Staff Query</h1>
//             <hr className="border-t-2 border-[#146192] mt-1" />
//             <h1 className="mt-2">
//               <span className="xl:text-[17px] text-xs lg:text-lg">Home</span> &gt;{' '}
//               <span className="xl:text-[17px] text-xs md:text-md font-medium text-[#146192]">
//                 Query
//               </span>
//             </h1>
//           </div>
//         </div>

//         {/* Static Header Section */}
//         <div className="bg-white p-4 rounded shadow-md mb-6 md:ml-64 flex flex-col md:flex-row md:items-center justify-between">
//           <div>
//             <h2 className="text-lg md:text-xl font-semibold text-blue-900">
//               Contact Us for Any Query!
//             </h2>
//             <p className="text-sm text-gray-600">We are here for you! How can we help?</p>
//           </div>
//            <button
//             onClick={onSendQuery}
//             className="mt-4 md:mt-0 px-4 py-2 bg-[#1da1f2] hover:bg-[#0d8de1] text-white rounded text-sm font-medium"
//           >
//             Send Query
//           </button>
//         </div>

//         {/* Received Queries (Static) */}
//         <div className="bg-white p-4 rounded shadow-md mb-6 md:ml-64">
//           <h3 className="text-md font-semibold text-gray-800 mb-3">Received Queries</h3>
//           <div className="overflow-x-auto">
//             <table className="w-full border text-sm text-left text-gray-800">
//               <thead className="bg-[#01497c] text-white">
//                 <tr>
//                   <th className="border p-2">S.NO</th>
//                   <th className="border p-2">Name</th>
//                   <th className="border p-2">Role</th>
//                   <th className="border p-2">Contact</th>
//                   <th className="border p-2">Email id</th>
//                   <th className="border p-2">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr className="hover:bg-gray-50">
//                   <td className="border p-2">1</td>
//                   <td className="border p-2">Deepika</td>
//                   <td className="border p-2">Teacher</td>
//                   <td className="border p-2">91 9915473733</td>
//                   <td className="border p-2">deepika@example.com</td>
//                   <td className="border p-2">
//                     <button className="text-blue-600 hover:underline text-sm">Reply</button>
//                   </td>
//                 </tr>
//                 <tr className="hover:bg-gray-50">
//                   <td className="border p-2">2</td>
//                   <td className="border p-2">Rajesh</td>
//                   <td className="border p-2">Parent</td>
//                   <td className="border p-2">91 9876543210</td>
//                   <td className="border p-2">rajesh@example.com</td>
//                   <td className="border p-2">
//                     <button className="text-blue-600 hover:underline text-sm">Reply</button>
//                   </td>
//                 </tr>
//                 <tr className="hover:bg-gray-50">
//                   <td className="border p-2">3</td>
//                   <td className="border p-2">Sunita</td>
//                   <td className="border p-2">Super Admin</td>
//                   <td className="border p-2">91 9123456780</td>
//                   <td className="border p-2">sunita@example.com</td>
//                   <td className="border p-2">
//                     <button className="text-blue-600 hover:underline text-sm">Reply</button>
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Sent Queries (Static) */}
//         <div className="bg-white p-4 rounded shadow-md md:ml-64">
//           <h3 className="text-md font-semibold text-gray-800 mb-3">Sent Queries</h3>
//           <div className="overflow-x-auto">
//             <table className="w-full border text-sm text-left text-gray-800">
//               <thead className="bg-[#01497c] text-white">
//                 <tr>
//                   <th className="border p-2">S.NO</th>
//                   <th className="border p-2">Name</th>
//                   <th className="border p-2">Contact</th>
//                   <th className="border p-2">Email id</th>
//                   <th className="border p-2">Sent to</th>
//                   <th className="border p-2">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr className="hover:bg-gray-50">
//                   <td className="border p-2">1</td>
//                   <td className="border p-2">Deepika</td>
//                   <td className="border p-2">91 9915473733</td>
//                   <td className="border p-2">deepika@example.com</td>
//                   <td className="border p-2">Geetha</td>
//                   <td className="border p-2">
//                     <button className="text-blue-600 hover:underline text-sm">View</button>
//                   </td>
//                 </tr>
//                 <tr className="hover:bg-gray-50">
//                   <td className="border p-2">2</td>
//                   <td className="border p-2">Deepika</td>
//                   <td className="border p-2">91 9915473733</td>
//                   <td className="border p-2">deepika@example.com</td>
//                   <td className="border p-2">Reethika</td>
//                   <td className="border p-2">
//                     <button className="text-blue-600 hover:underline text-sm">View</button>
//                   </td>
//                 </tr>
//                 <tr className="hover:bg-gray-50">
//                   <td className="border p-2">3</td>
//                   <td className="border p-2">Deepika</td>
//                   <td className="border p-2">91 9915473733</td>
//                   <td className="border p-2">deepika@example.com</td>
//                   <td className="border p-2">Seetha</td>
//                   <td className="border p-2">
//                     <button className="text-blue-600 hover:underline text-sm">View</button>
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StaffQuery;

import React from 'react';
import Header from '../adminStaffDashboard/layout/Header';

const StaffQuery = ({ onSendQuery, onReplyView }) => {
  return (
    <div className="bg-[#f3f9fb] min-h-screen">
      <Header />

      <div className="p-4 md:p-6">
        {/* Breadcrumb */}
        <div className="flex justify-between items-center mx-8 md:ml-64 py-10">
          <div>
            <h1 className="text-xl font-light xl:text-[32px]">Staff Query</h1>
            <hr className="border-t-2 border-[#146192] mt-1" />
            <h1 className="mt-2">
              <span className="xl:text-[17px] text-xs lg:text-lg">Home</span> &gt;{' '}
              <span className="xl:text-[17px] text-xs md:text-md font-medium text-[#146192]">
                Query
              </span>
            </h1>
          </div>
        </div>

        {/* Header with Send Query Button */}
        <div className="bg-white p-4 rounded shadow-md mb-6 md:ml-64 flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-blue-900">
              Contact Us for Any Query!
            </h2>
            <p className="text-sm text-gray-600">We are here for you! How can we help?</p>
          </div>
          <button
            onClick={onSendQuery}
            className="mt-4 md:mt-0 px-4 py-2 bg-[#1da1f2] hover:bg-[#0d8de1] text-white rounded text-sm font-medium"
          >
            Send Query
          </button>
        </div>

        {/* Received Queries */}
        <div className="bg-white p-4 rounded shadow-md mb-6 md:ml-64">
          <h3 className="text-md font-semibold text-gray-800 mb-3">Received Queries</h3>
          <div className="overflow-x-auto">
            <table className="w-full border text-sm text-left text-gray-800">
              <thead className="bg-[#01497c] text-white">
                <tr>
                  <th className="border p-2">S.NO</th>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Role</th>
                  <th className="border p-2">Contact</th>
                  <th className="border p-2">Email id</th>
                  <th className="border p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Deepika', role: 'Teacher', contact: '91 9915473733', email: 'deepika@example.com' },
                  { name: 'Rajesh', role: 'Parent', contact: '91 9876543210', email: 'rajesh@example.com' },
                  { name: 'Sunita', role: 'Super Admin', contact: '91 9123456780', email: 'sunita@example.com' }
                ].map((query, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">{query.name}</td>
                    <td className="border p-2">{query.role}</td>
                    <td className="border p-2">{query.contact}</td>
                    <td className="border p-2">{query.email}</td>
                    <td className="border p-2">
                      <button
                        onClick={() =>
                          onReplyView({ ...query, type: 'received' })
                        }
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Reply
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sent Queries */}
        <div className="bg-white p-4 rounded shadow-md md:ml-64">
          <h3 className="text-md font-semibold text-gray-800 mb-3">Sent Queries</h3>
          <div className="overflow-x-auto">
            <table className="w-full border text-sm text-left text-gray-800">
              <thead className="bg-[#01497c] text-white">
                <tr>
                  <th className="border p-2">S.NO</th>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Contact</th>
                  <th className="border p-2">Email id</th>
                  <th className="border p-2">Sent to</th>
                  <th className="border p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Deepika', contact: '91 9915473733', email: 'deepika@example.com', sentTo: 'Geetha' },
                  { name: 'Deepika', contact: '91 9915473733', email: 'deepika@example.com', sentTo: 'Reethika' },
                  { name: 'Deepika', contact: '91 9915473733', email: 'deepika@example.com', sentTo: 'Seetha' }
                ].map((query, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">{query.name}</td>
                    <td className="border p-2">{query.contact}</td>
                    <td className="border p-2">{query.email}</td>
                    <td className="border p-2">{query.sentTo}</td>
                    <td className="border p-2">
                      <button
                        onClick={() =>
                          onReplyView({ ...query, type: 'sent' })
                        }
                        className="text-blue-600 hover:underline text-sm"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffQuery;
