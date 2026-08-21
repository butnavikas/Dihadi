import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from "./components/navbar/navbar";
import Footer from './components/footer/Footer';
import Home from "./pages/allworks/Home";
import Signup from './signup/signup';
import Login from './login/login';
import Work_form from './forms/workform/workform';
import Job_form from './forms/jobform/jobform';
import Workers_Card from './pages/alljobs/workerscard';
import './App.css';
import Workid_Card from './pages/work_by_id/workid_card';
import Jobid_Card from './pages/job_by_id/jobid';

function MainLayout() {
  const location = useLocation();


  const hideNavAndFooter = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <>
    {/* This is for hiding navbar and footer */}
         <Navbar/>
{/* This is for all routes */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/works" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/add-work" element={<Work_form />} />
          <Route path="/job-form" element={<Job_form />} />
          <Route path="/findworkers" element={<Workers_Card />} />
          <Route path="/works/:id" element={<Workid_Card />} />
          <Route path="/jobs/:id" element={<Jobid_Card/>} />
        </Routes>
      </main>

      {/* for hiding Footer on login/signup pages */}
      {!hideNavAndFooter && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
  );
}
