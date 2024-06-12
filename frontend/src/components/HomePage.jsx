import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function HomePage({ hasProfiles }) {
  // Case where we have profiles already
  if (hasProfiles) {
    return (
      <>
        <div>Hello! What would you like to do today?</div>
        <button onClick={() => handleEndpoint(0)}>Profile Management</button>
        <button>
          <Link to="/termManagement">Term Management</Link>
        </button>
        <button onClick={() => handleEndpoint(2)}>Review Terms</button>
        <button onClick={() => handleEndpoint(3)}>Statistics</button>
      </>
    );
  } else {
    // Case where there's no profiles set up
    const [profileName, setProfileName] = useState("");
    const handleSubmit = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/createprofile",
          {
            name: profileName,
          }
        );
      } catch (error) {
        console.error("There was an error: ", error);
        alert("Error creating profile");
      }
    };
    return (
      <>
        <div>Please create a profile</div>
        <div>
          <input
            type="text"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            required
          />
          <button onClick={handleSubmit}>Create!</button>
        </div>
      </>
    );
  }
}
