import { useRef, useState } from "react";
import axios from "axios";
import CustomTextBox from "./CustomTextBox";
export default function ProfileManagementPage() {
  const textArea = useRef();
  const [currentlyAdd, setCurrentlyAdd] = useState(true);
  const [currentText, setCurrentText] = useState("");
  const inputRef = useRef();
  const [termsAdded, setTermsAdded] = useState("");

  function handleSelectAdd(addOrDelete) {
    if (addOrDelete == 1) {
      setCurrentlyAdd(true);
    } else {
      setCurrentlyAdd(false);
    }
    console.log(currentlyAdd);
  }

  async function handleOnAdd(currentlyAdd) {
    let url = "http://localhost:5000/addprofile";
    if (currentlyAdd == false) {
      url = "http://localhost:5000/deleteprofile";
    }
    try {
      const response = await axios.post(url, {
        profilename: inputRef.current.value,
      });
      currentlyAdd
        ? setTermsAdded("Profile(s) were added!")
        : setTermsAdded("Profile(s) were deleted!");
      setTimeout(() => {
        setTermsAdded("");
      }, 2000);
      console.log(`adding terms using url ${url}`);
    } catch (error) {
      console.error("There was an error checking profiles!", error);
    }
  }

  return (
    <div className="flex flex-col w-full justify-center items-center">
      <p className="text-5xl pb-10">
        <u>Profile Management</u>
      </p>
      <div className="flex flex-row space-x-4">
        <button onClick={() => handleSelectAdd(1)}>Add</button>
        <button onClick={() => handleSelectAdd(0)}>Delete</button>
      </div>

      {currentlyAdd ? (
        <p className="pt-10 pb-3 font-bold">
          Write profile(s) to add separated by new line
        </p>
      ) : (
        <p className="pt-10 pb-3 font-bold">
          Write name of profile to be deleted separated by new line
        </p>
      )}

      <CustomTextBox
        multi={true}
        inputRef={inputRef}
        labelText="Profiles"
        className="pb-10"
      />
      {/* TEXT AREA FOR ENTERING TERMS */}
      <button className="mt-5 mb-1" onClick={() => handleOnAdd(currentlyAdd)}>
        {currentlyAdd ? "Add Profile!" : "Delete Profile!"}
      </button>
      {termsAdded && <div>{termsAdded}</div>}
    </div>
  );
}
