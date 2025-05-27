import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUpdatedStudents } from "../../redux/studentsSlice";

function StudentHistory() {
  const dispatch = useDispatch();
  const { students, loading, error } = useSelector((state) => state.students);

  useEffect(() => {
    dispatch(fetchUpdatedStudents());
  }, [dispatch]);

  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold mb-4">Updated Student History</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="border px-4 py-2">Full Name</th>
              <th className="border px-4 py-2">Registration No</th>
              <th className="border px-4 py-2">Class</th>
              <th className="border px-4 py-2">Section</th>
              <th className="border px-4 py-2">Updated At</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => {
              const profile = student?.studentProfile || {};
              return (
                <tr key={index}>
                  <td className="border px-4 py-2">{profile.fullname}</td>
                  <td className="border px-4 py-2">{profile.registrationNumber}</td>
                  <td className="border px-4 py-2">{profile.class}</td>
                  <td className="border px-4 py-2">{profile.section}</td>
                  <td className="border px-4 py-2">{student.updatedAt}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentHistory;
