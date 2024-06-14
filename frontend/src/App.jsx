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
  const [hasProfiles, setHasProfiles] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function checkProfiles() {
      try {
        const response = await axios.get("http://localhost:5000/homepage");
        setHasProfiles(response.data.hasProfiles);
        setLoading(false);
      } catch (error) {
        console.error("There was an error checking profiles!", error);
        setLoading(false);
      }
    }

    checkProfiles();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage hasProfiles={hasProfiles} />} />
        <Route path="/termManagement" element={<TermManagementPage />} />
        <Route path="/profileManagement" element={<ProfileManagementPage />} />
        <Route path="/viewTerms" element={<ViewTerms />} />
        <Route path="/reviewTerms" element={<ReviewTerms />} />
        <Route path="/viewStats" element={<Statistics />} />
      </Routes>
    </>
  );
}

export default App;
