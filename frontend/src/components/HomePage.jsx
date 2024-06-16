import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { TextField } from "@mui/material";
import CustomTextBox from "./CustomTextBox";
export default function HomePage({ handleProfileClick }) {
  const [hasProfiles, setHasProfiles] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [profileChosen, setProfileChosen] = useState("");
  const [profileName, setProfileName] = useState("");
  const inputRef = useRef(null);

  // Case where we have profiles already
  // Need to choose a profile
  useEffect(() => {
    async function getProfiles() {
      try {
        const response = await axios.get("http://localhost:5000/getprofiles");
        let profiles = response.data.profiles;
        if (profiles.length > 0) {
          setHasProfiles(true);
        }
        setProfiles(profiles);
        console.log(profiles);
      } catch (error) {
        console.error("Couldn't get profiles!", error);
      }
    }

    getProfiles();
  }, [profileName]);

  async function handleProfileChosen(selectedProfile) {
    try {
      const response = await axios.post("http://localhost:5000/chooseprofile", {
        profilename: selectedProfile,
      });
      setProfileChosen(selectedProfile);
      setTimeout(() => {
        setProfileChosen("");
      }, 2000);
      handleProfileClick();
    } catch (error) {
      console.error("Couldn't choose profile!", error);
    }
  }

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:5000/addprofile", {
        profilename: inputRef.current.value,
      });
      setHasProfiles(true);
      setProfileName(inputRef.current.value);
    } catch (error) {
      console.error("There was an error: ", error);
      alert("Error creating profile");
    }
  };

  return (
    <div className="w-screen overflow-hidden">
      <div className="flex flex-col items-center">
        <div>
          <div className="text-6xl pb-5">Please create a profile!</div>
          <CustomTextBox
            multi={false}
            inputRef={inputRef}
            labelText="Profile Name"
            style="pb-5"
          />

          <div>
            <button className="mb-44 mt-5" onClick={handleSubmit}>
              Create!
            </button>
          </div>
        </div>
        <div className="flex flex-row space-x-4 items-center justify-center">
          <p>Current profiles:</p>
          {profiles.map((profile, index) => (
            <button key={index} onClick={() => handleProfileChosen(profile)}>
              {profile}
            </button>
          ))}

          <></>
        </div>
      </div>
    </div>
  );
}
