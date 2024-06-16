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
        // console.log(`${JSON.stringify(response.reviews)}`);
      } catch (error) {
        console.error("There was an error checking profiles!", error);
      }
    }
    loadReviews();
  }, []);

  useEffect(() => {
    // Show result message when correct state changes
    if (correct !== null) {
      setShowResult(true);
    }
  }, [correct]);

  async function getTerm() {
    try {
      const response = await axios.get("http://localhost:5000/getnextterm");
      // array = JSON.parse(response.data.review);
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
      setCorrect(response.data.correct);
      console.log("the answer was " + response.data.correct);
      setShowResult(true);
      getTerm();
      if (correct) {
        setCorrect(false);
        setTimeout(() => {
          setShowResult("");
        }, 5000);
        setCorrect(true);
      }
    } catch (error) {
      console.error("There was an error checking profiles!", error);
    }
  }

  if (startedReview) {
    return (
      <>
        {done ? (
          <div>All done</div>
        ) : (
          <div>
            <p className="text-8xl pb-10">Term: {term}</p>
            <CustomTextBox inputRef={answer} labelText="Definition" />
            <button onClick={handleReview}>Submit</button>
          </div>
        )}

        {showResult && (
          <div>
            {correct ? (
              <div>Answer was correct</div>
            ) : (
              <div className="flex flex-row justify-center">
                Answer was wrong, correct answer:
                <p className="blur-sm hover:blur-none hover:cursor-pointer text-paneloutline">
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
      <div>
        You have {lenRevList} reviews!
        {lenRevList > 0 ? (
          <button onClick={() => setStartedReview(true)}>Start!</button>
        ) : null}
      </div>
    );
  }
}
