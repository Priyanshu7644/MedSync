import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Patient Imports
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Login from './pages/Login';
import About from './pages/About';
import Contact from './pages/Contact';
import MyProfile from './pages/MyProfile';
import MyAppointments from './pages/MyAppointments';
import Appointment from './pages/Appointment';
import MyComplaints from './pages/MyComplaints';

// Admin Imports
import AdminLogin from './pages/Admin/Login';
import Sidebar from './components/Sidebar';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorsList from './pages/Admin/DoctorsList';
import AllAppointments from './pages/Admin/AllAppointments';
import Complaints from './pages/Admin/Complaints';
import Dashboard from './pages/Admin/Dashboard';
import AdminMessages from './pages/Admin/AdminMessages';
import { AdminContext } from './context/AdminContext';

// Doctor Imports
import DoctorLogin from './pages/Doctor/DoctorLogin';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import DoctorMessages from './pages/Doctor/DoctorMessages';
import DoctorSidebar from './components/DoctorSidebar';
import DashboardNavbar from './components/DashboardNavbar';
import { DoctorContext } from './context/DoctorContext';

const App = () => {
  const { aToken } = useContext(AdminContext);
  const { dtoken } = useContext(DoctorContext);

  return (
    <>
      <ToastContainer />
      <Routes>
        {/* Patient App Layout */}
        <Route path='/*' element={
          <div className='mx-4 sm:mx-[10%]'>
            <Navbar />
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/doctors' element={<Doctors />} />
              <Route path='/doctors/:speciality' element={<Doctors />} />
              <Route path='/login' element={<Login />} />
              <Route path='/about' element={<About />} />
              <Route path='/contact' element={<Contact />} />
              <Route path='/my-profile' element={<MyProfile />} />
              <Route path='/my-appointments' element={<MyAppointments />} />
              <Route path='/my-complaints' element={<MyComplaints />} />
              <Route path='/appointment/:docId' element={<Appointment />} />
            </Routes>
          </div>
        } />

        {/* Admin App Layout */}
        <Route path='/admin/*' element={
          aToken ? (
            <div className='bg-[#fef7e5] dark:bg-[#202833] text-[#00311e] dark:text-[#EAE0C8] h-screen max-h-screen w-full flex flex-col overflow-hidden transition-colors select-none'>
              <DashboardNavbar role='admin' />
              <div className='flex flex-1 items-stretch overflow-hidden min-h-0 w-full'>
                <Sidebar />
                <div className='flex-1 flex flex-col overflow-hidden min-h-0 w-full'>
                  <Routes>
                    <Route path='/' element={<div className='flex-1 p-4 sm:p-6 overflow-y-auto w-full min-h-0'><Dashboard /></div>} />
                    <Route path='/messages' element={<div className='flex-1 p-2 sm:p-3 h-full w-full overflow-hidden min-h-0 flex flex-col'><AdminMessages /></div>} />
                    <Route path='/add-doctor' element={<div className='flex-1 p-4 sm:p-6 overflow-y-auto w-full min-h-0'><AddDoctor /></div>} />
                    <Route path='/doctor-list' element={<div className='flex-1 p-4 sm:p-6 overflow-y-auto w-full min-h-0'><DoctorsList /></div>} />
                    <Route path='/all-appointments' element={<div className='flex-1 p-4 sm:p-6 overflow-y-auto w-full min-h-0'><AllAppointments /></div>} />
                    <Route path='/complaints' element={<div className='flex-1 p-4 sm:p-6 overflow-y-auto w-full min-h-0'><Complaints /></div>} />
                  </Routes>
                </div>
              </div>
            </div>
          ) : (
            <div className='mx-4 sm:mx-[10%]'>
              <Navbar />
              <AdminLogin />
            </div>
          )
        } />

        {/* Doctor App Layout */}
        <Route path='/doctor/*' element={
          dtoken ? (
            <div className='bg-[#fef7e5] dark:bg-[#202833] text-[#00311e] dark:text-[#EAE0C8] h-screen max-h-screen w-full flex flex-col overflow-hidden transition-colors select-none'>
              <DashboardNavbar role='doctor' />
              <div className='flex flex-1 items-stretch overflow-hidden min-h-0 w-full'>
                <DoctorSidebar />
                <div className='flex-1 flex flex-col overflow-hidden min-h-0 w-full'>
                  <Routes>
                    <Route path='/dashboard' element={<div className='flex-1 p-4 sm:p-6 overflow-y-auto w-full min-h-0'><DoctorDashboard /></div>} />
                    <Route path='/appointments' element={<div className='flex-1 p-4 sm:p-6 overflow-y-auto w-full min-h-0'><DoctorAppointments /></div>} />
                    <Route path='/profile' element={<div className='flex-1 p-4 sm:p-6 overflow-y-auto w-full min-h-0'><DoctorProfile /></div>} />
                    <Route path='/messages' element={<div className='flex-1 p-2 sm:p-3 h-full w-full overflow-hidden min-h-0 flex flex-col'><DoctorMessages /></div>} />
                  </Routes>
                </div>
              </div>
            </div>
          ) : (
            <div className='mx-4 sm:mx-[10%]'>
              <Navbar />
              <DoctorLogin />
            </div>
          )
        } />
      </Routes>
    </>
  )
}

export default App;
