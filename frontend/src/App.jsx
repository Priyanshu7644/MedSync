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
            <div className='bg-[#F8F9FD] dark:bg-gray-950 min-h-screen transition-colors'>
              <DashboardNavbar role='admin' />
              <div className='flex items-start'>
                <Sidebar />
                <div className='flex-1'>
                  <Routes>
                    <Route path='/' element={<Dashboard />} />
                    <Route path='/add-doctor' element={<AddDoctor />} />
                    <Route path='/doctor-list' element={<DoctorsList />} />
                    <Route path='/all-appointments' element={<AllAppointments />} />
                    <Route path='/complaints' element={<Complaints />} />
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
            <div className='bg-[#F8F9FD] dark:bg-gray-950 min-h-screen transition-colors'>
              <DashboardNavbar role='doctor' />
              <div className='flex items-start'>
                <DoctorSidebar />
                <div className='flex-1'>
                  <Routes>
                    <Route path='/dashboard' element={<DoctorDashboard />} />
                    <Route path='/appointments' element={<DoctorAppointments />} />
                    <Route path='/profile' element={<DoctorProfile />} />
                    <Route path='/messages' element={<DoctorMessages />} />
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
