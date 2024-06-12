import axios from "axios";
import { useEffect, useState } from "react";

export default function ViewTerms() {
  const [currItems, setCurrItems] = useState([]);
  async function retrieveItems() {
    try {
      const response = await axios.get("http://localhost:5000/viewterms");
      console.log(`got terms ${response.data.terms.length}`);
      setCurrItems(response.data.terms);
      console.log(`${JSON.stringify(currItems)}`);
    } catch (error) {
      console.error("There was an viewing terms!", error);
    }
  }

  {
    /* Retrieving the items on mount */
  }
  useEffect(() => {
    retrieveItems();
  }, []);

  return (
    <div>
      <ul>
        {currItems.map((item, index) => (
          <li key={index}>
            <p>Term: {item.term}</p>
            <p>Definition: {item.defn}</p>
            <p>Alternate Definitions: {item.alt_defns.join(", ")}</p>
            <p>Level: {item.level}</p>
            <p>Date Created: {item.date_created}</p>
            <p>Review Date: {item.review_date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
