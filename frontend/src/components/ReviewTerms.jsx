import { useEffect, useState, useRef } from "react";
import axios from "axios";
import CustomTextBox from "./CustomTextBox";

export default function ReviewTerms() {
  const [term, setTerm] = useState("");
  const [defn, setDefn] = useState("");
  const [correct, setCorrect] = useState(null);
  const [lenRevList, setRevLenList] = useState(0);
  const [startedReview, setStartedReview] = useState(false);
  const [done, setDone] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const answer = useRef();

  useEffect(() => {
    async function loadReviews() {
      try {
        const response = await axios.get("http://localhost:5000/loadreviews");
        setRevLenList(JSON.stringify(response.data.revLength));
      } catch (error) {
        console.error("There was an error checking profiles!", error);
      }
    }
    loadReviews();
  }, []);

  async function getTerm() {
    try {
      const response = await axios.get("http://localhost:5000/getnextterm");
      if (
        response.data.term == "all done" &&
        response.data.defn == "all done"
      ) {
        setShowResult(false);
        setDone(true);
      }

      setTerm(response.data.term);
      console.log(
        "term loaded " + response.data.term + " " + response.data.defn
      );
    } catch (error) {
      console.error("There was an error checking profiles!", error);
    }
  }

  useEffect(() => {
    if (!startedReview) return;

    getTerm();
  }, [startedReview]);

  async function handleReview() {
    try {
      const response = await axios.post(
        "http://localhost:5000/checkifcorrect",
        {
          term: term,
          answer: answer.current.value,
        }
      );
      setDefn(response.data.defn);
      console.log("RESPONSE:", response.data.correct);
      setCorrect(response.data.correct);
      console.log("CORRECT:", response.data.correct);
      setShowResult(true);

      if (response.data.correct) {
        setTimeout(() => {
          setShowResult(false);
        }, 2000);
      }
      getTerm();
    } catch (error) {
      console.error("There was an error checking profiles!", error);
    }
  }

  if (startedReview) {
    return (
      <>
        {done ? (
          <div className="text-5xl">All done, come back later for more!</div>
        ) : (
          <div>
            <p className="text-8xl pb-10 drop-shadow-smallerwhite">
              Term: {term}
            </p>
            <div className="flex flex-row items-center justify-center">
              <CustomTextBox inputRef={answer} labelText="Definition" />
              <button className="ml-2 mb-1" onClick={handleReview}>
                Submit
              </button>
            </div>
          </div>
        )}

        {showResult && (
          <div>
            {correct ? (
              <div className="text-correct drop-shadow-md">
                <p>Answer was correct</p>
              </div>
            ) : (
              <div className="flex flex-row justify-center text-incorrect space-x-1">
                <p>Answer was wrong, hover to see correct answer:</p>
                <p className="blur-sm hover:blur-none hover:cursor-pointer">
                  {" " + defn}
                </p>
              </div>
            )}
          </div>
        )}
      </>
    );
  } else {
    return (
      <div className="mb-1">
        <p className="text-4xl">
          You have {lenRevList ? lenRevList : 0} reviews!
        </p>
        <br />
        {lenRevList > 0 ? (
          <button onClick={() => setStartedReview(true)}>Start!</button>
        ) : null}
      </div>
    );
  }
}
