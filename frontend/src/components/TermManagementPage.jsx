import { useRef, useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { TextField } from "@mui/material";
import CustomTextBox from "./CustomTextBox";
export default function TermManagementPage() {
  const inputRef = useRef(null);
  const [currentlyAdd, setCurrentlyAdd] = useState(true);
  const [termsAdded, setTermsAdded] = useState("");
  const [currentTerms, setCurrentTerms] = useState([]);

  async function handleSelectAdd(addOrDelete) {
    if (addOrDelete == 1) {
      setCurrentlyAdd(true);
    } else {
      setCurrentlyAdd(false);

      try {
        const response = await axios.get("http://localhost:5000/viewterms");
        const arrayOfTerms = response.data.terms.map((term) => term.term);
        setCurrentTerms(arrayOfTerms);
        console.log(currentTerms);
      } catch (error) {
        console.log("There was an error retrieving terms");
      }
    }
  }

  async function handleOnAdd(currentlyAdd) {
    let url = "http://localhost:5000/addterms";
    if (currentlyAdd == false) {
      url = "http://localhost:5000/deleteterms";
    }
    try {
      const response = await axios.post(url, {
        termsanddefn: inputRef.current.value,
      });
      currentlyAdd
        ? setTermsAdded("Terms were added!")
        : setTermsAdded("Terms were deleted!");
      setTimeout(() => {
        setTermsAdded("");
      }, 2000);
      let value = inputRef.current.value;
      let valArr = value.split(/\r?\n/);
      let index;
      let newArr = [];
      console.log(valArr);
      valArr.forEach((item) => {
        index = currentTerms.indexOf(item);
        if (index > -1) {
          currentTerms.splice(index, 1);
        }
      });
      newArr = currentTerms;
      setCurrentTerms(newArr);
      inputRef.current.value = "";
      console.log(`${currentTerms} is currentTerms after deletion`);
    } catch (error) {
      console.error("There was an error checking profiles!", error);
    }
  }

  return (
    <div className="flex flex-col w-full justify-center items-center">
      <p className="text-5xl pb-10">
        <u>Term Management</u>
      </p>
      <div className="flex flex-row space-x-4">
        <button onClick={() => handleSelectAdd(1)}>Add</button>
        <button onClick={() => handleSelectAdd(0)}>Delete</button>
      </div>
      {currentlyAdd ? (
        <p className="pt-10 pb-3 font-bold">
          Write terms to add in the form:{" "}
          <u>
            Term / Definition | Alternate Definitions (separated by commas) :
            Notes separated by new line
          </u>
          . ** Alternate Definitions and Notes are optional **
        </p>
      ) : (
        <p className="pt-10 pb-3 font-bold">
          Write term to delete separated by new line
        </p>
      )}
      <div className="flex flex-row w-full items-center justify-center flex-shrink">
        <CustomTextBox
          multi={true}
          inputRef={inputRef}
          currentlyAdd={currentlyAdd}
        />
        {/* <textarea ref={textArea} id="mytextarea" onChange></textarea>{" "} */}
        {/* FOR DELETE WE HAVE THE OPTION TO DELETE VISUALLY */}
        {currentlyAdd == false ? (
          currentTerms ? (
            <div>
              <u>Terms</u>
              <div className="ml-1 h-24 w-auto overflow-x-hidden pl-5 pr-5 flex-shrink">
                {currentTerms.map((term, index) => (
                  <div key={index}>{term}</div>
                ))}
              </div>
            </div>
          ) : null
        ) : null}
      </div>
      {/* TEXT AREA FOR ENTERING TERMS */}
      <button className="mt-5 mb-1" onClick={() => handleOnAdd(currentlyAdd)}>
        {currentlyAdd ? "Add Terms!" : "Delete Terms!"}
      </button>
      {termsAdded && <div>{termsAdded}</div>}
    </div>
  );
}
