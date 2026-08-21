import { useState , useEffect } from "react";
import axios from "axios";
import "../workform/workform.css";
const API_URL = import.meta.env.VITE_API_URL;
import { useNavigate , useSearchParams  } from "react-router-dom";
//taking the job profile details of a user
export default function Job_form() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
    const editId = searchParams.get("id");
    const isEditMode = Boolean(editId);
  const [name, setName] = useState("");
  const [occupation, setOccupation] = useState("");
  const [details, setDetails] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState(""); // Fixed: default to empty string
  const [state, setState] = useState("AN"); // Fixed: match the first select option
  const [phone_no, setPhone] = useState("");
  const [pay, setPay] = useState("");

  const token = localStorage.getItem("token");

    useEffect(() => {
  
    if (!isEditMode) {
      return;
    }
  
    const fetchJob = async () => {
  
      try {
  
        const response = await axios.get(
          `${API_URL}/jobs/${editId}`
        );
  
        const job = response.data;
  
        setName(job.name || "");
        setOccupation(job.occupation || "");
        setDetails(job.details || "");
        setAddress(job.address || "");
        setCity(job.city || "");
        setState(job.state || "");
        setPhone(job.phone_no || "");
        setPay(job.pay || "");
        
  
      } catch (error) {
  
        console.error(
          "Failed to load job:",
          error.response?.data || error.message
        );
  
        alert("Could not load the Job Profiles.");
  
      }
  
    };
  
    fetchJob();
  
  }, [editId, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phone_no.trim()) {
      alert("Please enter a valid phone number");
      return;
    }

    if (!token) {
      alert("You must be logged in to post a job!");
      return;
    }

    const jobData = {
    name,
    occupation,
    details,
    address,
    city,
    state,
    phone_no,
    pay,
  };

    try {
      let response;

      //edit
         if (isEditMode) {

      response = await axios.put(
        `${API_URL}/jobs/edit/${editId}`,
        jobData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log(
        "Job Profile updated successfully:",
        response.data
      );

      alert("Job Profile updated successfully!");
      window.dispatchEvent(new Event("jobProfileChanged"));

    }

    //create work
       else {
    
          response = await axios.post(
             `${API_URL}/jobs/add`,
            jobData,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
    
          console.log(
            "Job Profile added successfully:",
            response.data
          );
    
          alert("Job Profile created successfully!");
          window.dispatchEvent(new Event("jobProfileChanged"));
    
        }
        navigate("/findworkers");
         } catch (error) {

    console.error(
      "Server error:",
      error.response?.data || error.message
    );

    alert(
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Something went wrong"
    );

  }
  };

  return (
    <div>
      <div className="container_work_form">
        <form className="row g-3" onSubmit={handleSubmit}>
          <h2> 
             {isEditMode ? "Edit your Job Profile" : "Fill your Job form"}
             </h2>

          <div className="col-md-6">
            <label htmlFor="inputname" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              required
              id="inputname"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="worker-type" className="form-label">
              Occupation
            </label>
            <input
              type="text"
              className="form-control"
              id="worker-type"
              required
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
            />
          </div>

          <div className="col-12">
            <label htmlFor="details" className="form-label">
              Details
            </label>
            <input
              type="text"
              className="form-control"
              id="details"
              required
              placeholder="Details about your work"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>

          <div className="col-12">
            <label htmlFor="inputAddress" className="form-label">
              Address
            </label>
            <input
              type="text"
              className="form-control"
              id="inputAddress"
              required
              placeholder="1234 Main St"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="inputCity" className="form-label">
              City
            </label>
            <input
              type="text"
              className="form-control"
              id="inputCity"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="inputState" className="form-label">
              State
            </label>
            <select
              id="inputState"
              className="form-select"
              value={state}
              onChange={(e) => setState(e.target.value)}
            >
              <option value="AN">Andaman and Nicobar Islands</option>
              <option value="AP">Andhra Pradesh</option>
              <option value="AR">Arunachal Pradesh</option>
              <option value="AS">Assam</option>
              <option value="BR">Bihar</option>
              <option value="CH">Chandigarh</option>
              <option value="CT">Chhattisgarh</option>
              <option value="DN">Dadra and Nagar Haveli</option>
              <option value="DD">Daman and Diu</option>
              <option value="DL">Delhi</option>
              <option value="GA">Goa</option>
              <option value="GJ">Gujarat</option>
              <option value="HR">Haryana</option>
              <option value="HP">Himachal Pradesh</option>
              <option value="JK">Jammu and Kashmir</option>
              <option value="JH">Jharkhand</option>
              <option value="KA">Karnataka</option>
              <option value="KL">Kerala</option>
              <option value="LA">Ladakh</option>
              <option value="LD">Lakshadweep</option>
              <option value="MP">Madhya Pradesh</option>
              <option value="MH">Maharashtra</option>
              <option value="MN">Manipur</option>
              <option value="ML">Meghalaya</option>
              <option value="MZ">Mizoram</option>
              <option value="NL">Nagaland</option>
              <option value="OR">Odisha</option>
              <option value="PY">Puducherry</option>
              <option value="PB">Punjab</option>
              <option value="RJ">Rajasthan</option>
              <option value="SK">Sikkim</option>
              <option value="TN">Tamil Nadu</option>
              <option value="TG">Telangana</option>
              <option value="TR">Tripura</option>
              <option value="UP">Uttar Pradesh</option>
              <option value="UT">Uttarakhand</option>
              <option value="WB">West Bengal</option>
            </select>
          </div>

          <div className="col-md-6">
            <label htmlFor="phone-no" className="form-label">
              Phone no
            </label>
            <input
              type="tel"
              className="form-control"
              required
              id="phone-no"
              value={phone_no}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="pay" className="form-label">
              Pay
            </label>
            <input
              type="number"
              className="form-control"
              min="0"
              id="pay"
              value={pay}
              placeholder="800"
              required
              onChange={(e) => setPay(e.target.value)}
            />
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-primary">
              {isEditMode ? "Update Job Profile" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
