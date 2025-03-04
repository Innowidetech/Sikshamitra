import React, { useState, useEffect } from "react";
import AddAdmission from "./AddAdmission";


const mockData = [
    {
        id: "1",
        username: "john.doe",
        email: "john@example.com",
        registrationNumber: "REG001",
        firstName: "John",
        lastName: "Doe",
        class: "10",
        section: "A",
    },
    // Add more mock data as needed
];

const AdmissionTable = ({admissions}) => {

    const [isModalOpen, setIsModalOpen] = useState(false);



    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleAddStudent = (studentData) => {
        setIsModalOpen(false);
    };

    console.log(admissions)

    return (
        <>
            <div className="px-4 py-8 max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row gap-4 mb-4 justify-between">
                    <button
                        className="w-full px-4 bg-[#3D8CD6] rounded-lg md:w-1/2 text-white"
                        style={{ fontFamily: "Poppins" }}
                    >
                        New Admission List
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full px-4 py-3 bg-[#F5F5F5] text-black rounded-lg md:w-1/2 flex items-center justify-between"
                        style={{ fontFamily: "Poppins" }}
                    >
                        <span className="flex-1 text-center">Add Student</span>
                        <span className="ml-2 ">+</span>
                    </button>
                </div>

                <AddAdmission
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onAdd={handleAddStudent}
                />

                <div className="bg-white rounded-lg shadow mb-6 md:mt-6 lg:mt-10">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Profile
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        First Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Last Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Admission No
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Student Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Student Contact
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        UserName
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {mockData.map((student) => (
                                    <tr key={student.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {student.firstName} {student.lastName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {student.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {student.registrationNumber}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {student.class}-{student.section}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button className="text-blue-600 hover:text-blue-900">
                                                Edit
                                            </button>
                                        </td>
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

export default AdmissionTable;
