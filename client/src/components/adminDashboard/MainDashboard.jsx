// MainDashboard.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminSidebar from './layout/AdminSidebar';
import AdminDashboard from './AdminDashboard';
import Fees from './AdminFees';
import Teachers from './Teachers';
import Students from './Students';
import Parents from './Parents';
import Accounts from './Accounts';
import Inventory from './Inventory';
import Library from './Library';
import Admission from './Admission';
import Classes from './Classes';
import Employee from './Employee';
import Results from './Results';
import Curriculam from './Curriculam';
import Header from './layout/Header';
import AdminProfile from './AdminProfile';
import Application from './admissionpage/Application';
import ResolvePage from './ResolvePage';
import Allbook from './Allbook';
import StudentHistory from './StudentHistory';
import AccountHistory from './AccountHistory';
import AdminConnectQuries from './AdminConnectQuries';
import AdminQueryForm from './AdminQueryForm';
import AdminEntrance from './AdminEntrance';
import EditPaper from './EditPaper';

// ✅ Merge conflict resolved here:
import SyllabusPage from './SyllabusPage';
import ExamPage from './ExamPage';
import AdminQueryChat from './AdminQueryChat';
import AdminTrans from './AdminTrans';
import Track from './Track';
import VehicleView from './VehicleView';
import AddVehicle from './AddVehicle';
import QuestionPaperView from './QuestionPaperView'; // ✅ Keep this too
import ApplicantsDetails from './ApplicantsDetails';


const MainDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [studentsSubTab, setStudentsSubTab] = useState('default');
  const [accountSubTab, setAccountSubTab] = useState('default');
  const [activeQueryChat, setActiveQueryChat] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/admin') {
      setActiveTab('dashboard');
    } else if (location.pathname.startsWith('/admin/curriculum')) {
      setActiveTab('curriculum');
    } else if (location.pathname.startsWith('/admin/adminentrance')) {
      setActiveTab('adminentrance');
    } else if (location.pathname === '/admin/profile') {
      setActiveTab('profile');
    } else if (location.pathname.startsWith('/admin/fees')) {
      setActiveTab('fees');
    } else if (location.pathname.startsWith('/admin/teachers')) {
      setActiveTab('teachers');
    } else if (location.pathname.startsWith('/admin/students')) {
      setActiveTab('students');
    } else if (location.pathname.startsWith('/admin/parents')) {
      setActiveTab('parents');
    } else if (location.pathname.startsWith('/admin/accounts')) {
      setActiveTab('accounts');
    } else if (location.pathname.startsWith('/admin/inventory')) {
      setActiveTab('inventory');
    } else if (location.pathname.startsWith('/admin/library')) {
      setActiveTab('library');
    } else if (location.pathname.startsWith('/admin/admission')) {
      setActiveTab('admission');
    } else if (location.pathname.startsWith('/admin/classes')) {
      setActiveTab('classes');
    } else if (location.pathname.startsWith('/admin/employee')) {
      setActiveTab('employee');
    } else if (location.pathname.startsWith('/admin/results')) {
      setActiveTab('results');
    } else if (location.pathname.startsWith('/admin/transportation')) {
      setActiveTab('transportation');
    } else if (location.pathname.startsWith('/admin/connectqueries')) {
      setActiveTab('connectqueries');
    } else if (location.pathname === '/admin/questionpaperview') {
      setActiveTab('questionpaperview');
    }  else if (location.pathname.startsWith('/admin/applicantsdetails')) {
      setActiveTab('applicantsdetails');
    } else if (location.pathname.startsWith('/admin/editpaper')) {
      setActiveTab('editpaper');
    }
  }, [location.pathname]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setStudentsSubTab('default');
    setAccountSubTab('default');

    switch (tabId) {
      case 'dashboard':
        navigate('/admin');
        break;
      case 'curriculum':
        navigate('/admin/curriculum');
        break;
      case 'fees':
        navigate('/admin/fees');
        break;
      case 'teachers':
        navigate('/admin/teachers');
        break;
      case 'students':
        navigate('/admin/students');
        break;
      case 'parents':
        navigate('/admin/parents');
        break;
      case 'accounts':
        navigate('/admin/accounts');
        break;
      case 'inventory':
        navigate('/admin/inventory');
        break;
      case 'library':
        navigate('/admin/library');
        break;
      case 'admission':
        navigate('/admin/admission');
        break;
      case 'classes':
        navigate('/admin/classes');
        break;
      case 'employee':
        navigate('/admin/employee');
        break;
      case 'adminentrance':
        navigate('/admin/adminentrance');
        break;
      case 'results':
        navigate('/admin/results');
        break;
      case 'transportation':
        navigate('/admin/transportation');
        break;
      case 'questionpaperview':
        navigate('/admin/questionpaperview');
        break;
         case 'applicantsdetails':
        navigate('/admin/applicantsdetails');
        break;
      case 'editpaper':
        navigate('/admin/editpaper');
        break;
      case 'connectqueries':
        navigate('/admin/connectqueries');
        break;
      default:
        navigate('/admin');
    }
  };

  const renderContent = () => {
    if (activeQueryChat) {
      return (
        <AdminQueryChat
          query={activeQueryChat}
          onBack={() => setActiveQueryChat(null)}
        />
      );
    }

    if (location.pathname.startsWith('/admin/transportation/track/')) {
      const parts = location.pathname.split('/');
      const vehicleId = parts[4];
      if (!vehicleId || vehicleId === 'undefined') {
        return <div className="text-red-500 text-center mt-8">Invalid URL. Vehicle ID missing.</div>;
      }
      return <Track vehicleId={vehicleId} />;
    }

    if (location.pathname.startsWith('/admin/transportation/view')) {
      const parts = location.pathname.split('/');
      const vehicleId = parts[4];
      if (!vehicleId || vehicleId === 'undefined') {
        return <div className="text-red-500 text-center mt-8">Invalid URL. Vehicle ID missing.</div>;
      }
      return <VehicleView vehicleId={vehicleId} />;
    }

    if (location.pathname === '/admin/profile') {
      return <AdminProfile />;
    }
    if (location.pathname === '/admin/curriculum/syllabus') {
      return <SyllabusPage />;
    }
    if (location.pathname === '/admin/curriculum/exams') {
      return <ExamPage />;
    }
    if (location.pathname === '/admin/transportation/add') {
      return <AddVehicle />;
    }
    if (location.pathname === '/admin/connectqueries/queries') {
      return <AdminQueryForm />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'fees':
        return <Fees />;
      case 'teachers':
        return <Teachers />;
      case 'students':
        return studentsSubTab === 'history'
          ? <StudentHistory goBack={() => setStudentsSubTab('default')} />
          : <Students openHistory={() => setStudentsSubTab('history')} />;
      case 'parents':
        return <Parents />;
      case 'accounts':
        return accountSubTab === 'history'
          ? <AccountHistory goBack={() => setAccountSubTab('default')} />
          : <Accounts openHistory={() => setAccountSubTab('history')} />;
      case 'inventory':
        return <Inventory />;
      case 'library':
        return <Library setActiveTab={setActiveTab} />;
      case 'resolve':
        return <ResolvePage setActiveTab={setActiveTab} />;
      case 'allbook':
        return <Allbook setActiveTab={setActiveTab} />;
      case 'admission':
        return <Admission setActiveTab={setActiveTab} />;
      case 'admission-application':
        return <Application />;
      case 'classes':
        return <Classes />;
      case 'questionpaperview':
        return <QuestionPaperView setActiveTab={setActiveTab} />;
         case 'applicantsdetails':
        return <ApplicantsDetails setActiveTab={setActiveTab} />;
      case 'editpaper':
        return <EditPaper setActiveTab={setActiveTab} />;
      case 'employee':
        return <Employee />;
      case 'results':
        return <Results />;
      case 'curriculum':
        return <Curriculam />;
      case 'transportation':
        return <AdminTrans />;
      case 'adminentrance':
        return <AdminEntrance />;
      case 'connectqueries':
        return <AdminConnectQuries setActiveQueryChat={setActiveQueryChat} />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar
        setActiveSection={handleTabChange}
        activeTab={activeTab}
      />
      <main className="flex-1 md:ml-64 overflow-y-auto">
        <Header />
        <div className="mt-20 md:mt-16">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default MainDashboard;
