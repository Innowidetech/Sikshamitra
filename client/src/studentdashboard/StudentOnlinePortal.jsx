import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import StudentForm from './StudentForm';
import EducationForm from './EducationForm';
import ParentForm from './ParentForm';
import PaymentForm from './PaymentForm';
import DownloadSection from './DownloadSection';


function StudentOnlinePortal({ initialTab = 'student' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [formData, setFormData] = useState({
    student: {},
    education: [],
    parent: {},
    payment: {},
  });

  const tabs = ['student', 'education', 'parent', 'payment', 'download', ];

  const handleNext = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  const updateFormData = (section, data) => {
    setFormData((prev) => ({
      ...prev,
      [section]: data,
    }));
  };

  const handlePaymentSubmission = async (paymentData) => {
    try {
      const formDataToSubmit = new FormData();

      if (formData.student.studentPhoto) {
        formDataToSubmit.append('studentPhoto', formData.student.studentPhoto);
      }

      const studentDetailsWithoutPhoto = { ...formData.student };
      delete studentDetailsWithoutPhoto.studentPhoto;
      formDataToSubmit.append('studentDetails', JSON.stringify(studentDetailsWithoutPhoto));

      formData.education.forEach((edu) => {
        if (edu.educationDocuments) {
          formDataToSubmit.append('educationDocuments', edu.educationDocuments);
        }
      });

      formDataToSubmit.append(
        'educationDetails',
        JSON.stringify(
          formData.education.map((edu) => {
            const eduWithoutFile = { ...edu };
            delete eduWithoutFile.educationDocuments;
            return eduWithoutFile;
          })
        )
      );

      formDataToSubmit.append('parentDetails', JSON.stringify(formData.parent));

      const response = await axios.post(
        'https://sikshamitra.onrender.com/api/user/applyOnline',
        formDataToSubmit,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data && response.data.order && response.data.applicationId) {
        const { order, applicationId } = response.data;

        const verifyResponse = await axios.post(
          'https://sikshamitra.onrender.com/api/user/verifyOnlinePayment',
          {
            paymentId: paymentData.paymentId,
            orderId: order.id,
            signature: paymentData.signature,
          }
        );

        if (verifyResponse.data.message === 'Payment successfully verified and processed') {
          handleNext();
        } else {
          alert('Payment verification failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'student':
        return (
          <StudentForm
            onNext={handleNext}
            formData={formData.student}
            updateFormData={(data) => updateFormData('student', data)}
            goToEntranceExam={() => setActiveTab('entranceexam')} // pass if needed
          />
        );
      case 'education':
        return (
          <EducationForm
            onNext={handleNext}
            onBack={handleBack}
            formData={formData.education}
            updateFormData={(data) => updateFormData('education', data)}
          />
        );
      case 'parent':
        return (
          <ParentForm
            onNext={handleNext}
            onBack={handleBack}
            formData={formData.parent}
            updateFormData={(data) => updateFormData('parent', data)}
          />
        );
      case 'payment':
        return (
          <PaymentForm
            onNext={handleNext}
            onBack={handleBack}
            onSubmit={handlePaymentSubmission}
          />
        );
      case 'download':
        return <DownloadSection onBack={handleBack} onNext={handleNext} />;
      
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1">{renderContent()}</main>
    </div>
  );
}

export default StudentOnlinePortal;
