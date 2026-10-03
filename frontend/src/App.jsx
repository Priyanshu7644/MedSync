import React, { useContext, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Persistent Navbars & Shell Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import DoctorSidebar from './components/DoctorSidebar';
import DashboardNavbar from './components/DashboardNavbar';
import PageLoader from './components/PageLoader';
import { AdminContext } from './context/AdminContext';
import { DoctorContext } from './context/DoctorContext';

// Patient Lazy Pages
const Home = lazy(() => import('./pages/Home'));
const Doctors = lazy(() => import('./pages/Doctors'));
const Login = lazy(() => import('./pages/Login'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const MyProfile = lazy(() => import('./pages/MyProfile'));
const MyAppointments = lazy(() => import('./pages/MyAppointments'));
const Appointment = lazy(() => import('./pages/Appointment'));
const MyComplaints = lazy(() => import('./pages/MyComplaints'));

// Admin Lazy Pages
const AdminLogin = lazy(() => import('./pages/Admin/Login'));
const Dashboard = lazy(() => import('./pages/Admin/Dashboard'));
const AdminMessages = lazy(() => import('./pages/Admin/AdminMessages'));
const AddDoctor = lazy(() => import('./pages/Admin/AddDoctor'));
const DoctorsList = lazy(() => import('./pages/Admin/DoctorsList'));
const AllAppointments = lazy(() => import('./pages/Admin/AllAppointments'));
const Complaints = lazy(() => import('./pages/Admin/Complaints'));

// Doctor Lazy Pages
const DoctorLogin = lazy(() => import('./pages/Doctor/DoctorLogin'));
const DoctorDashboard = lazy(() => import('./pages/Doctor/DoctorDashboard'));
const DoctorAppointments = lazy(() => import('./pages/Doctor/DoctorAppointments'));
const DoctorProfile = lazy(() => import('./pages/Doctor/DoctorProfile'));
const DoctorMessages = lazy(() => import('./pages/Doctor/DoctorMessages'));

const App = () => {
  const { aToken } = useContext(AdminContext);
  const { dtoken } = useContext(DoctorContext);

  return (
    <>
      <ToastContainer />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Patient App Layout */}
          <Route path='/*' element={
            <div className='mx-4 sm:mx-[10%]'>
              <Navbar />
              <Suspense fallback={<PageLoader />}>
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
              </Suspense>
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
                    <Suspense fallback={<PageLoader text="Loading Admin Module..." />}>
                      <Routes>
                        <Route path='/' element={<div className='flex-1 p-4 sm:p-6 overflow-y-auto w-full min-h-0'><Dashboard /></div>} />
                        <Route path='/messages' element={<div className='flex-1 p-2 sm:p-3 h-full w-full overflow-hidden min-h-0 flex flex-col'><AdminMessages /></div>} />
                        <Route path='/add-doctor' element={<div className='flex-1 p-4 sm:p-6 overflow-y-auto w-full min-h-0'><AddDoctor /></div>} />
                        <Route path='/doctor-list' element={<div className='flex-1 p-4 sm:p-6 overflow-y-auto w-full min-h-0'><DoctorsList /></div>} />
                        <Route path='/all-appointments' element={<div className='flex-1 p-4 sm:p-6 overflow-y-auto w-full min-h-0'><AllAppointments /></div>} />
                        <Route path='/complaints' element={<div className='flex-1 p-4 sm:p-6 overflow-y-auto w-full min-h-0'><Complaints /></div>} />
                      </Routes>
                    </Suspense>
                  </div>
                </div>
              </div>
            ) : (
              <div className='mx-4 sm:mx-[10%]'>
                <Navbar />
                <Suspense fallback={<PageLoader text="Loading Admin Access..." />}>
                  <AdminLogin />
                </Suspense>
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
                    <Suspense fallback={<PageLoader text="Loading Doctor Portal..." />}>
                      <Routes>
                        <Route path='/dashboard' element={<div className='flex-1 p-4 sm:p-6 overflow-y-auto w-full min-h-0'><DoctorDashboard /></div>} />
                        <Route path='/appointments' element={<div className='flex-1 p-4 sm:p-6 overflow-y-auto w-full min-h-0'><DoctorAppointments /></div>} />
                        <Route path='/profile' element={<div className='flex-1 p-4 sm:p-6 overflow-y-auto w-full min-h-0'><DoctorProfile /></div>} />
                        <Route path='/messages' element={<div className='flex-1 p-2 sm:p-3 h-full w-full overflow-hidden min-h-0 flex flex-col'><DoctorMessages /></div>} />
                      </Routes>
                    </Suspense>
                  </div>
                </div>
              </div>
            ) : (
              <div className='mx-4 sm:mx-[10%]'>
                <Navbar />
                <Suspense fallback={<PageLoader text="Loading Doctor Portal..." />}>
                  <DoctorLogin />
                </Suspense>
              </div>
            )
          } />
        </Routes>
      </Suspense>
    </>
  )
}

export default App;

