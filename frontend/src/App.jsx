import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import MakeButton from "./components/MakeButton";
import HomePage from "./components/HomePage";
import axios from "axios";
function App() {
  const [hasProfiles, setHasProfiles] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function checkProfiles() {
      try {
        const response = await axios.get("http://localhost:5000/checkprofiles");
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
      <HomePage hasProfiles={hasProfiles} />
    </>
  );
}

export default App;
