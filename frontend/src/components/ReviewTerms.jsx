import { useEffect, useState, useRef } from "react";
import axios from "axios";
export default function ReviewTerms() {
  const [term, setTerm] = useState("");
  const [correct, setCorrect] = useState(false);
  const [lenRevList, setRevLenList] = useState(0);
  const [startedReview, setStartedReview] = useState(false);
  const [done, setDone] = useState(false);
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

  async function getTerm() {
    try {
      const response = await axios.get("http://localhost:5000/getnextterm");
      // array = JSON.parse(response.data.review);
      if (
        response.data.term == "all done" &&
        response.data.defn == "all done"
      ) {
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

  if (startedReview) {
    async function handleReview() {
      try {
        const response = await axios.post(
          "http://localhost:5000/checkifcorrect",
          {
            term: term,
            answer: answer.current.value,
          }
        );
        function toBool(str) {
          return str == "True" ? true : false;
        }

        setCorrect(toBool(JSON.stringify(response.data.correct)));
        console.log("the answer was " + JSON.stringify(response.data.correct));

        getTerm();
      } catch (error) {
        console.error("There was an error checking profiles!", error);
      }
    }

    return (
      <>
        {done ? (
          <div>All done</div>
        ) : (
          <div>
            <h1>Term: {term}</h1>
            <input ref={answer}></input>
            <button onClick={handleReview}>Submit</button>
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
