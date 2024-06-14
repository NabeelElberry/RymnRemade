import { useState, useEffect } from "react";
import axios from "axios";
{
  /* Amount of terms you've done right/wrong, how many you have, date of profile creation */
}

export default function Statistics() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    async function getStats() {
      try {
        const response = await axios.get("http://localhost:5000/getstats");
        const data = response.data;
        setStats([
          data.numterms,
          data.numreviews,
          data.numright,
          data.numwrong,
        ]);
      } catch (error) {
        console.error("There was an error checking profiles!", error);
      }
    }

    getStats();
  }, []);

  return (
    <div>
      numterms: {stats[0]}
      numreviews: {stats[1]}
      numright: {stats[2]}
      numwrong: {stats[3]}
    </div>
  );
}
