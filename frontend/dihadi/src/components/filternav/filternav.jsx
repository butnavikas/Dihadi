import { FaHardHat } from "react-icons/fa";
import { PiPlugChargingFill } from "react-icons/pi";
import { FaPaintRoller } from "react-icons/fa6";
import { FaToolbox } from "react-icons/fa";
import "./filternav.css";

export default function Filternav({ onSelectCategory }) {
  const categories = [
    { label: "Labour", icon: <FaHardHat /> },
    { label: "Electrician", icon: <PiPlugChargingFill /> },
    { label: "Painter", icon: <FaPaintRoller /> },
    { label: "Home Repair", icon: <FaToolbox /> },
  ];

  return (
    <div className="container1">
      {categories.map((cat, index) => (
        <div key={index} className="navfilters">
          <button 
            className="navfilterbtn"
            onClick={() => onSelectCategory && onSelectCategory(cat.label)}
          >
            {cat.icon}
          </button>
          <span>{cat.label}</span>
        </div>
      ))}
    </div>
  );
}