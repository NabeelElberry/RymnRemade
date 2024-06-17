import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Term from "./Term";
export default function ViewTerms() {
  const [currItems, setCurrItems] = useState([]);
  const [itemSelected, setItemSelected] = useState();
  let refs = useRef([]);
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

  const handleFocus = (index) => {
    if (refs.current[index]) {
      refs.current[index].focus(); // Focus the button when called
    }
  };

  return (
    <div className="p-1">
      {currItems.map((item, index) => (
        <Term
          className="p-1"
          key={index}
          name={item.term}
          defn={item.defn}
          alt_defns={item.alt_defns.join(", ")}
          level={item.level}
          created={item.date_created}
          review={item.review_date}
          focus={handleFocus(index)}
        ></Term>
      ))}
    </div>
  );
}
