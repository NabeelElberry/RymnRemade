import { useRef, useState } from "react";
import axios from "axios";

export default function TermManagementPage() {
  const textArea = useRef();
  const [currentlyAdd, setCurrentlyAdd] = useState(true);
  const [currentText, setCurrentText] = useState("");

  function handleSelectAdd(addOrDelete) {
    if (addOrDelete == 1) {
      setCurrentlyAdd(true);
    } else {
      setCurrentlyAdd(false);
    }
    console.log(currentlyAdd);
  }

  async function handleOnAdd(currentlyAdd) {
    let url = "http://localhost:5000/addterms";
    if (currentlyAdd == false) {
      url = "http://localhost:5000/deleteterms";
    }
    try {
      const response = await axios.post(url, {
        termsanddefn: document.getElementById("mytextarea").value,
      });
      console.log(`adding terms using url ${url}`);
    } catch (error) {
      console.error("There was an error checking profiles!", error);
    }
  }

  return (
    <>
      <h2>
        <u>Add/Delete Terms</u>
      </h2>
      <div>
        <button onClick={() => handleSelectAdd(1)}>Add</button>
        <button onClick={() => handleSelectAdd(0)}>Delete</button>
      </div>
      {currentlyAdd ? (
        <div>
          Write terms to add in the form: Term / Definition separated by new
          line
        </div>
      ) : (
        <div>Write term to delete separated by new line</div>
      )}
      <textarea ref={textArea} id="mytextarea" onChange></textarea>{" "}
      {/* TEXT AREA FOR ENTERING TERMS */}
      <button onClick={() => handleOnAdd(currentlyAdd)}>
        {currentlyAdd ? "Add Terms!" : "Delete Terms!"}
      </button>
    </>
  );
}
