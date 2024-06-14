import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function HomePage({ hasProfiles }) {
  const [profiles, setProfiles] = useState([]);

  // Case where we have profiles already
  // Need to choose a profile
  useEffect(() => {
    async function getProfiles() {
      try {
        const response = await axios.get("http://localhost:5000/getprofiles");
        let profiles = response.data.profiles;
        setProfiles(profiles);
        console.log(profiles);
      } catch (error) {
        console.error("Couldn't get profiles!", error);
      }
    }

    getProfiles();
  }, []);

  async function handleProfileChosen(selectedProfile) {
    try {
      const response = await axios.post("http://localhost:5000/chooseprofile", {
        profilename: selectedProfile,
      });
    } catch (error) {
      console.error("Couldn't choose profile!", error);
    }
  }

  if (hasProfiles) {
    return (
      <>
        Please select a profile
        <div>
          {profiles ? (
            profiles.map((profile) => (
              <button onClick={() => handleProfileChosen(profile)}>
                {profile}
              </button>
            ))
          ) : (
            <div>Nothing</div>
          )}
        </div>
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
