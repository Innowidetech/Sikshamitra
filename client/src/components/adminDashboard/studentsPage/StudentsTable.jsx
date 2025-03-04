import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CiSearch } from 'react-icons/ci';
import { fetchStudents, fetchStudentDetails, setSearchQuery } from '../../../redux/studentsSlice';

function StudentsTable() {
    const dispatch = useDispatch();
    const { filteredStudents, selectedStudent, loading, error, searchQuery } = useSelector((state) => state.students);

    useEffect(() => {
        dispatch(fetchStudents());
    }, [dispatch]);

    const handleSearchChange = (e) => {
        dispatch(setSearchQuery(e.target.value));
    };

    const handleStudentClick = (studentId) => {
        if (!studentId) return;
        dispatch(fetchStudentDetails(studentId));
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
    );
    
    if (error) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="text-red-600 text-center">
                <p className="text-xl font-semibold">Error</p>
                <p>{error}</p>
            </div>
        </div>
    );

    // console.log(filteredStudents)

    return (
        <>
        <div className="border border-black rounded-lg overflow-hidden w-[200px] ml-4 md:w-[430px] md:ml-10 lg:w-[660px] xl:w-[780px] mb-4 bg-white">
        <div className="flex items-center px-3">
          <CiSearch className="h-5 w-5 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by Name or Email"
            className="w-full px-4 py-3 focus:outline-none"
          />
        </div>
      </div>
        <div className=" overflow-x-hidden min-h-screen p-4 w-[240px] md:w-[460px] lg:w-[700px] xl:w-full xl:max-w-6xl md:ml-6 xl:ml-4 flex flex-col xl:flex-row">
            <div className="flex-1 overflow-x-auto">
                {filteredStudents.length === 0 ? (
                    <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
                        <p className="text-gray-500 text-lg">No students found</p>
                        {searchQuery && (
                            <p className="text-gray-400 text-sm mt-2">
                                Try adjusting your search terms
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="border border-black rounded-lg overflow-hidden max-w-6xl mx-auto">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200" style={{fontFamily:'Poppins'}}>
                                <thead className="bg-white">
                                    <tr>
                                        <th className="sticky left-0 bg-white px-6 py-3 text-center md:text-lg font-medium text-black">Name</th>
                                        <th className="px-6 py-3 text-center md:text-lg font-medium text-black">Roll No</th>
                                        <th className="px-6 py-3 text-center md:text-lg font-medium text-black">Class</th>
                                        <th className="px-6 py-3 text-center md:text-lg font-medium text-black">Parent Name</th>
                                        <th className="px-6 py-3 text-center md:text-lg font-medium text-black">Parent Phn No</th>
                                        <th className="px-6 py-3 text-center md:text-lg font-medium text-black">Class Teacher</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredStudents.map((student, index) => {
                                        const parent = student.parent?.parentProfile;
                                        const children = parent?.parentOf || [];

                                        return children.map((child, childIndex) => {
                                            const studentData = child?.student;
                                            const teacherData = child?.teacher;

                                            return (
                                                <tr
                                                    key={studentData?._id + '-' + childIndex}
                                                    onClick={() => handleStudentClick(studentData?._id)}
                                                    className={index % 2 === 0 ? 'bg-white cursor-pointer' : 'cursor-pointer'}
                                                >
                                                    <td className="sticky left-0 bg-inherit px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center justify-center">
                                                            <img
                                                                className="h-8 w-8 rounded-full"
                                                                src={studentData?.studentProfile.photo}
                                                                alt="Student"
                                                                onError={(e) => {
                                                                    e.target.src = 'https://via.placeholder.com/40';
                                                                }}
                                                            />
                                                            <div className="text-sm font-medium text-gray-900 ml-4  whitespace-nowrap">
                                                                {studentData?.studentProfile.firstName} {studentData?.studentProfile.lastName}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                                        {studentData?.studentProfile.rollNumber || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                                        {studentData?.studentProfile.class} {studentData?.studentProfile.section?.toLowerCase()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                                        {parent?.fatherName || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                                        {parent?.fatherPhoneNumber || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                                        {teacherData?.firstName || '-'} {teacherData?.lastName || '-'}
                                                    </td>
                                                </tr>
                                            );
                                        });
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Details Section */}
            <div className="xl:ml-4 mt-6 xl:mt-0">
                {selectedStudent ? (
                    <div className="sticky border border-gray-300 rounded-lg bg-white p-6 shadow-lg">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Student Details</h3>
                        <div className="space-y-4">
                            <div className="flex justify-center mb-6">
                                <img
                                    src={selectedStudent.studentProfile?.photo || 'https://via.placeholder.com/96'}
                                    alt="Student"
                                    className="h-24 w-24 rounded-full border-4 border-blue-100"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/96';
                                    }}
                                />
                            </div>
                            <div className="space-y-2">
                                <p className="flex justify-between">
                                    <span className="font-medium text-gray-600">Name:</span>
                                    <span>{selectedStudent.studentProfile?.firstName} {selectedStudent.studentProfile?.lastName}</span>
                                </p>
                                <p className="sm:flex justify-between hidden md:block">
                                    <span className="font-medium text-gray-600">Student ID:</span>
                                    <span className="text-sm">{selectedStudent._id}</span>
                                </p>
                                <p className="flex justify-between">
                                    <span className="font-medium text-gray-600">Class:</span>
                                    <span>{selectedStudent.studentProfile?.class} {selectedStudent.studentProfile?.section}</span>
                                </p>
                                <p className="flex justify-between">
                                    <span className="font-medium text-gray-600">Parent Name:</span>
                                    <span>{selectedStudent.parent?.parentProfile?.fatherName || 'N/A'}</span>
                                </p>
                                <p className="flex justify-between">
                                    <span className="font-medium text-gray-600">Parent Phone:</span>
                                    <span>{selectedStudent.parent?.parentProfile?.fatherPhoneNumber || 'N/A'}</span>
                                </p>
                                <p className="flex justify-between">
                                    <span className="font-medium text-gray-600">Class Teacher:</span>
                                    <span>{selectedStudent.teacher?.firstName} {selectedStudent.teacher?.lastName}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="sticky top-4 border border-gray-300 rounded-lg bg-white p-6 shadow-lg text-center text-gray-500">
                        <p>Select a student to view details</p>
                    </div>
                )}
            </div>
        </div>
        </>
    );
}

export default StudentsTable;