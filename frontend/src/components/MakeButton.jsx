import React, { useState } from "react";
import axios from "axios";

export default function MakeButton() {
  const [profileName, setProfileName] = useState("");
  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:5000/createprofile", {
        name: profileName,
      });
    } catch (error) {
      console.error("There was an error: ", error);
      alert("Error creating profile");
    }
  };
  return (
    <div>
      <label>Profile Name: </label>
      <input
        type="text"
        value={profileName}
        onChange={(e) => setProfileName(e.target.value)}
        required
      />
      <button onClick={handleSubmit}>Create Profile</button>
    </div>
  );
}
