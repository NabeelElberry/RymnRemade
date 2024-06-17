import { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import axios from "axios";
import TermManagementPage from "./components/TermManagementPage";
import NavBar from "./components/NavBar";
import ViewTerms from "./components/ViewTerms";
import ProfileManagementPage from "./components/ProfileManagementPage";
import ReviewTerms from "./components/ReviewTerms";
import Statistics from "./components/Statistics";
function App() {
  const [currentProfile, setCurrentProfile] = useState("");

  async function getProfile() {
    try {
      const response = await axios.get(
        "http://localhost:5000/getcurrentprofile"
      );
      setCurrentProfile(response.data.profile);
    } catch (error) {
      console.log("Couldn't set profile in App.jsx");
    }
  }

  useEffect(() => {
    getProfile();
  });

  const handleProfileChange = () => {
    getProfile();
  };

  return (
    <div className="overflow-hidden text-textcolor font-quicksand">
      <NavBar profile={currentProfile} />
      <div className="pt-16 w-full h-full">
        <Routes>
          <Route
            className="overflow-hidden"
            path="/"
            element={<HomePage handleProfileClick={handleProfileChange} />}
          />
          <Route path="/termManagement" element={<TermManagementPage />} />
          <Route
            path="/profileManagement"
            element={<ProfileManagementPage />}
          />
          <Route path="/viewTerms" element={<ViewTerms />} />
          <Route path="/reviewTerms" element={<ReviewTerms />} />
          <Route path="/viewStats" element={<Statistics />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
