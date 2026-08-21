import { useState ,useEffect} from "react";
import "./workform.css";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;
export default function Work_form() {
  const [payType, setPayType] = useState("Fixed"); // "Fixed" or "Will Discuss"

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("id");
  const isEditMode = Boolean(editId);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [owner_name, setOwner] = useState("");
  const [worker_type, setWorker_type] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("AN"); // Default option matching dropdown
  const [phone_no, setPhone] = useState("");
  const [pay, setPay] = useState("");

  const token=localStorage.getItem("token");
  useEffect(() => {

  if (!isEditMode) {
    return;
  }

  const fetchWork = async () => {

    try {

      const response = await axios.get(`${API_URL}/works/${editId}`);

      const work = response.data;

      setTitle(work.title || "");
      setDetails(work.details || "");
      setOwner(work.owner_name || "");
      setWorker_type(work.worker_type || "");
      setAddress(work.address || "");
      setCity(work.city || "");
      setState(work.state || "");
      setPhone(work.phone_no || "");

      if (work.pay === "Will Discuss") {
        setPayType("Will Discuss");
        setPay("");
      } else {
        setPayType("Fixed");
        setPay(work.pay || "");
      }

    } catch (error) {

      console.error(
        "Failed to load work:",
        error.response?.data || error.message
      );

      alert("Could not load the work posting.");

    }

  };

  fetchWork();

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

  const finalPay =
    payType === "Will Discuss"
      ? "Will Discuss"
      : pay;


  const workData = {
    title,
    details,
    owner_name,
    worker_type,
    address,
    city,
    state,
    phone_no,
    pay: finalPay
  };


  try {

    let response;


//edit existing work

    if (isEditMode) {

      response = await axios.put(
        `${API_URL}/works/edit/${editId}`,
        workData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log(
        "Work updated successfully:",
        response.data
      );

      alert("Work posting updated successfully!");

    }


 //create new work

    else {

      response = await axios.post(
        `${API_URL}/works/add`,
        workData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log(
        "Work added successfully:",
        response.data
      );

      alert("Work posting created successfully!");

    }


    // Go back to home after save
    navigate("/");

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
            {isEditMode ? "Edit your work posting" : "Fill your work form"}
            </h2>
          
          <div className="col-md-6">
            <label htmlFor="inputtitle" className="form-label">Title</label>
            <input 
              type="text" 
              className="form-control" 
              required 
              id="inputtitle" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="col-12">
            <label htmlFor="details" className="form-label">Details</label>
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

          <div className="col-md-6">
            <label htmlFor="owner-name" className="form-label">Owner Name</label>
            <input 
              type="text" 
              className="form-control" 
              required 
              id="owner-name" 
              value={owner_name} 
              onChange={(e) => setOwner(e.target.value)}
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="worker-type" className="form-label">Worker Type</label>
            <input 
              type="text" 
              className="form-control" 
              id="worker-type" 
              required 
              value={worker_type} 
              onChange={(e) => setWorker_type(e.target.value)} 
            />
          </div>

          <div className="col-12">
            <label htmlFor="inputAddress" className="form-label">Address</label>
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
            <label htmlFor="inputCity" className="form-label">City</label>
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
            <label htmlFor="inputState" className="form-label">State</label>
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
            <label htmlFor="phone-no" className="form-label">Phone no</label>
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
  <label htmlFor="payType" className="form-label">Payment Mode</label>
  <select 
    id="payType" 
    className="form-select" 
    value={payType} 
    onChange={(e) => setPayType(e.target.value)}
  >
    <option value="Fixed">Fixed Amount (₹)</option>
    <option value="Will Discuss">Will Discuss</option>
  </select>
</div>
{/* if a owner want that he will discuss and pay then there's option in the form  */}
{payType === "Fixed" && (
  <div className="col-md-6">
    <label htmlFor="pay" className="form-label">Pay Amount (₹)</label>
    <input 
      type="number" 

      className="form-control" 
      id="pay" 
      min="0"
      placeholder="e.g. 800"
      value={pay} 
      required={payType === "Fixed"} 
      onChange={(e) => setPay(e.target.value)} 
    />
  </div>
)}

          <div className="col-12">
            <button type="submit" className="btn btn-primary">{isEditMode ? "Update Work" : "Submit"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
