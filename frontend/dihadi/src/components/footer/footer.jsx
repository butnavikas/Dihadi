// footer/Footer.jsx
import './footer.css';

export default function Footer() {
  return (
    <footer className="custom-footer text-light">
      <div className="container">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
          
          {/* Compact Logo / Brand */}
          <div className="fw-bold fs-6">
            <span className="text-primary">Dihadi</span>
            <span className="text-light">Project</span>
          </div>

      

          {/* Copyright */}
          <div className="copyright-text">
            © {new Date().getFullYear()} All rights reserved.
          </div>

        </div>
      </div>
    </footer>
  );
}
