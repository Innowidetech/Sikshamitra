import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdmissions } from '../../../redux/admission';
import AddAdmission from "./AddAdmission";

const AdmissionTable = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState(null);
    const dispatch = useDispatch();
    const { admissions, loading, error } = useSelector((state) => state.admissions);

    useEffect(() => {
        dispatch(fetchAdmissions());
    }, [dispatch]);

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleAddStudent = (studentData) => {
        setIsModalOpen(false);
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        if (term.trim() === '') {
            setFilteredData(null);
            return;
        }

        const filtered = admissions.studentsWithParents?.filter(data => {
            const fullname = data.student.studentProfile.fullname.toLowerCase();
            const regNo = data.student.studentProfile.registrationNumber.toLowerCase();
            const className = data.student.studentProfile.class.toString().toLowerCase();
            
            return fullname.includes(term) || 
                   regNo.includes(term) || 
                   className.includes(term);
        });

        setFilteredData(filtered);
    };

    const displayData = filteredData || admissions.studentsWithParents;

    if (loading) {
        return <div className="p-4">Loading...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-500">Error: {error}</div>;
    }

    return (
        <>
            <div className="lg:px-4 py-8 mx-8 mb-6">
                <div className="flex flex-col md:flex-row gap-4 mb-4 justify-between">
                    <button
                        className="w-full px-4 py-3 bg-[#3D8CD6] rounded-lg md:w-1/2 text-white"
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
                        <span className="ml-2">+</span>
                    </button>
                </div>

                {/* Search Input */}
                <div className="bg-[rgba(20,97,146,0.15)] p-6 rounded-2xl">
                <div className="bg-[#F8FAFC] rounded-lg mb-6">
                    <input
                        type="text"
                        placeholder="Search by student name, class, or registration number..."
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#146192] focus:border-transparent"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>

                {/* Desktop/Laptop View */}
                <div className="hidden lg:block bg-[#F8FAFC] rounded-2xl shadow mb-6">
                    <div className="overflow-x-auto rounded-2xl scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        <style>
                            {`
                            .scrollbar-hide::-webkit-scrollbar {
                                display: none;
                            }
                            `}
                        </style>
                        <table className="min-w-full rounded-2xl">
                            <thead>
                                <tr className="bg-[#146192] text-white rounded-2xl">
                                    <th className="px-6 py-3 text-left text-sm font-medium tracking-wider">
                                        Profile
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium tracking-wider">
                                        Full Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium tracking-wider">
                                        E-mail
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium tracking-wider">
                                        Registration No
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium tracking-wider">
                                        Gender
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium tracking-wider">
                                        DOB
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium tracking-wider">
                                        Class
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium tracking-wider">
                                        Section
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium tracking-wider">
                                        Class Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium tracking-wider">
                                        Parent Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium tracking-wider">
                                        Parent Contact
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {displayData?.map((data) => (
                                    <tr key={data.student._id} className="border-b">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                {data.student.studentProfile.photo ? (
                                                    <img 
                                                        src={data.student.studentProfile.photo} 
                                                        alt={data.student.studentProfile.fullname}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-gray-500">👤</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {data.student.studentProfile.fullname}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {data.student.userId.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {data.student.studentProfile.registrationNumber}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {data.student.studentProfile.gender}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {new Date(data.student.studentProfile.dob).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {data.student.studentProfile.class}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {data.student.studentProfile.section}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {data.student.studentProfile.classType}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {data.parents[0]?.parentProfile.fatherName || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {data.parents[0]?.parentProfile.fatherPhoneNumber || 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Mobile View - Cards */}
                <div className="lg:hidden space-y-4">
                    {displayData?.map((data) => (
                        <div key={data.student._id} className="bg-white rounded-2xl shadow-md overflow-hidden">
                            <div className="flex items-center justify-center p-6 bg-white ">
                                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                                    {data.student.studentProfile.photo ? (
                                        <img 
                                            src={data.student.studentProfile.photo}
                                            alt={data.student.studentProfile.fullname}
                                            className="w-20 h-20 rounded-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-gray-400 text-4xl">👤</span>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex">
                                {/* Left column - Labels */}
                                <div className="w-1/2 bg-[#146192] p-4 text-white">
                                    <div className="space-y-6">
                                        <div className="font-medium text-xs md:text-sm">Full name</div>
                                        <div className="font-medium text-xs md:text-sm">E-mail</div>
                                        <div className="font-medium text-xs md:text-sm">Registration No.</div>
                                        <div className="font-medium text-xs md:text-sm">Gender</div>
                                        <div className="font-medium text-xs md:text-sm">DOB</div>
                                        <div className="font-medium text-xs md:text-sm">Class</div>
                                        <div className="font-medium text-xs md:text-sm">Section</div>
                                        <div className="font-medium text-xs md:text-sm">Class type</div>
                                        <div className="font-medium text-xs md:text-sm">Parent Name</div>
                                        <div className="font-medium text-xs md:text-sm">Parent contact</div>
                                    </div>
                                </div>
                                
                                {/* Right column - Values */}
                                <div className="w-1/2 bg-white p-4">
                                    <div className="space-y-6">
                                        <div className="text-right text-xs md:text-sm">{data.student.studentProfile.fullname}</div>
                                        <div className="text-right text-xs md:text-sm">{data.student.userId.email}</div>
                                        <div className="text-right text-xs md:text-sm">{data.student.studentProfile.registrationNumber}</div>
                                        <div className="text-right text-xs md:text-sm">{data.student.studentProfile.gender}</div>
                                        <div className="text-right text-xs md:text-sm">{new Date(data.student.studentProfile.dob).toLocaleDateString()}</div>
                                        <div className="text-right text-xs md:text-sm">{data.student.studentProfile.class}</div>
                                        <div className="text-right text-xs md:text-sm">{data.student.studentProfile.section}</div>
                                        <div className="text-right text-xs md:text-sm">{data.student.studentProfile.classType}</div>
                                        <div className="text-right text-xs md:text-sm">{data.parents[0]?.parentProfile.fatherName || 'N/A'}</div>
                                        <div className="text-right text-xs md:text-sm">{data.parents[0]?.parentProfile.fatherPhoneNumber || 'N/A'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                </div>
            </div>
            <div>
            <AddAdmission
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onAdd={handleAddStudent}
                />
            </div>
        </>
    );
};

export default AdmissionTable;