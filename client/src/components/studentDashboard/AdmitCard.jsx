import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdmitCard, clearAdmitCard } from '../../redux/student/admitCardSlice';
import Header from './layout/Header';
import avatar from "../../assets/avtar.jpg";
import html2pdf from 'html2pdf.js';

const sampleData = {
  message: "Admit card of student:",
  student: {
    studentProfile: {
      fullname: "unnati walke",
      gender: "female",
      dob: "2004-12-27T00:00:00.000Z",
      photo: "https://res.cloudinary.com/dixhganq6/image/upload/v1738228878/ar3qsxsyvnsshd0iqnzq.jpg",
      address: "Hyderabad",
      registrationNumber: "Reg16a1",
      class: "6",
      section: "A",
      classType: "secondary",
      childOf: "679b448ff7ccf1742a3b1067",
      fees: "70000",
      previousEducation: [
        {
          schoolName: "",
          duration: "",
          _id: "67d91b2be03af716f9098acf"
        }
      ],
      additionalFees: "0",
      about: "Hello I am a Student of 6th class.",
      rollNumber: ""
    },
    _id: "679b448ff7ccf1742a3b1069",
    schoolId: {
      _id: "67987506ac1a5dcfa3056aee",
      schoolBanner: "https://res.cloudinary.com/dixhganq6/image/upload/v1738129055/iuyhikrpufvjumooxi0e.jpg"
    },
    userId: {
      _id: "679b448ff7ccf1742a3b1065",
      isActive: true
    },
    createdBy: "67986e3bd7a5e04dc550ba31",
    createdAt: "2025-01-30T09:21:19.479Z",
    updatedAt: "2025-03-20T12:09:16.417Z",
    __v: 1
  },
  admitCard: {
    _id: "67a1ee4db423cad6f47a8d3d",
    schoolId: "67987506ac1a5dcfa3056aee",
    examType: "Half Yearly Test 2",
    examDuration: "10am - 1pm",
    fromDate: "2025-04-15T00:00:00.000Z",
    toDate: "2025-04-17T00:00:00.000Z",
    numberOfSubjects: 3,
    class: "6",
    section: "A",
    exam: [
      {
        subject: "Mathematics",
        syllabus: "Chapters 1 to 5",
        date: "2025-04-15T00:00:00.000Z",
        _id: "67a1ee4db423cad6f47a8d3e",
        subjectCode: "sub1"
      },
      {
        subject: "English",
        syllabus: "Chapters 1 to 5",
        date: "2025-04-16T00:00:00.000Z",
        _id: "67a1ee4db423cad6f47a8d3f",
        subjectCode: "sub2"
      },
      {
        subject: "Chemistry",
        syllabus: "Experiments 1 to 5",
        date: "2025-04-17T00:00:00.000Z",
        _id: "67a1ee4db423cad6f47a8d40",
        subjectCode: "sub3"
      }
    ],
    createdBy: "679ca8430d28f2d8b4ad981c",
    createdAt: "2025-02-04T10:39:09.600Z",
    updatedAt: "2025-02-04T10:39:09.600Z",
    __v: 0
  }
};

function AdmitCard() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const { admitCard, loading, error } = useSelector((state) => state.admitCard);

  useEffect(() => {
    dispatch(fetchAdmitCard(sampleData));
    return () => {
      dispatch(clearAdmitCard());
    };
  }, [dispatch]);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleDownloadOption = (format) => {
    if (format === 'PDF') {
      const element = document.getElementById('admit-card-container');
      if (element) {
        const options = {
          margin: 10,
          filename: 'admit_card.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 4 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        };
        html2pdf().from(element).set(options).save();
      }
    }
    setIsDropdownOpen(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <>
      <div className="flex justify-between items-center mx-4 md:mx-8 flex-wrap gap-y-4">
        <div>
          <h1 className="text-2xl font-light text-black xl:text-[38px]">Admit Card</h1>
          <hr className="mt-2 border-[#146192] border-[1px] w-[150px]" />
          <h1 className="mt-2">
            <span className="xl:text-[17px] text-xl">Home</span> {'>'}
            <span className="xl:text-[17px] text-xl font-medium text-[#146192]">Admit Card</span>
          </h1>
        </div>
        <Header />
      </div>

      <div className="flex justify-center items-center mx-4 md:mx-8 mt-6">
        <img
          src={sampleData.student.schoolId.schoolBanner}
          alt="School Banner"
          className="w-full max-w-6xl h-auto rounded-xl"
        />
      </div>

      <div className="flex justify-center mt-8 px-2">
        <div className="w-full max-w-6xl p-4 md:p-6 rounded-3xl shadow-2xl">
          <h2 className="text-xl font-medium text-start mb-6">Exam Result Card</h2>

          <div className="flex flex-col md:flex-row items-center justify-between pt-4 pb-4 shadow-lg gap-4" id="admit-card-container">
            <div className="w-full md:w-[35%] px-4">
              <div className="mb-4 flex items-center">
                <label className="text-lg mr-2">Name:</label>
                <div className="text-lg">{sampleData.student.studentProfile.fullname}</div>
              </div>
              <div className="mb-4 flex items-center">
                <label className="text-lg mr-2">Class:</label>
                <div className="text-lg">{sampleData.student.studentProfile.class} - {sampleData.student.studentProfile.section}</div>
              </div>
              <div className="mb-4 flex items-center">
                <label className="text-lg mr-2">Type:</label>
                <div className="text-lg">{sampleData.admitCard.examType}</div>
              </div>
              <div className="mb-4 flex items-center">
                <label className="text-lg mr-2">Timing:</label>
                <div className="text-lg">{sampleData.admitCard.examDuration}</div>
              </div>
            </div>

            <div className="hidden md:block border-l-4 border-black h-32 mx-4"></div>

            <div className="w-full md:w-[45%] px-4 flex flex-col sm:flex-row justify-between items-center">
              <div className="flex flex-col w-full sm:w-auto">
                <div className="mb-4 flex items-center">
                  <label className="text-lg mr-2">Roll:</label>
                  <div className="text-lg">{sampleData.student.studentProfile.rollNumber || 'N/A'}</div>
                </div>
                <div className="mb-4 flex items-center">
                  <label className="text-lg mr-2">Batch:</label>
                  <div className="text-lg">{sampleData.student.studentProfile.registrationNumber}</div>
                </div>
                <div className="mb-4 flex items-center">
                  <label className="text-lg mr-2">Section:</label>
                  <div className="text-lg">{sampleData.student.studentProfile.section}</div>
                </div>
              </div>

              <img
                src={sampleData.student.studentProfile.photo || avatar}
                alt="Avatar"
                className="w-36 h-36 rounded-lg border-2 border-gray-300 mt-4 sm:mt-0"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl shadow-md w-full max-w-[1200px] overflow-x-auto mt-12 mx-auto border-2 border-black" id="table-container">
            <table className="min-w-[600px] w-full table-auto border-collapse">
              <thead>
                <tr>
                  <th className="text-center font-semibold border-b-2 border-r-2 border-black py-2 px-4">S. No.</th>
                  <th className="text-center font-semibold border-b-2 border-r-2 border-black py-2 px-4">Subject Code</th>
                  <th className="text-center font-semibold border-b-2 border-r-2 border-black py-2 px-4">Date</th>
                  <th className="text-center font-semibold border-b-2 border-black py-2 px-4">Subject Name</th>
                </tr>
              </thead>
              <tbody>
                {sampleData.admitCard.exam.map((subject, index) => (
                  <tr key={index}>
                    <td className="text-center border-b border-r border-black py-2 px-4">{index + 1}</td>
                    <td className="text-center border-b border-r border-black py-2 px-4">{subject.subjectCode}</td>
                    <td className="text-center border-b border-r border-black py-2 px-4">{new Date(subject.date).toLocaleDateString()}</td>
                    <td className="text-center border-b border-black py-2 px-4">{subject.subject}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdmitCard;
