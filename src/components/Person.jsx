import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import "./Person.css";

function Person({ name }) {
  const [selectedOption, setSelectedOption] = useState("");
  const [comment, setComment] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    const checkSubmission = async () => {
      const today = new Date().toISOString().slice(0, 10);
      const docRef = doc(db, "persons", name, "daily_records", today);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setHasSubmitted(true);
      }
    };

    checkSubmission();
  }, [name]);

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleSubmit = async () => {
    if (selectedOption === "" || (selectedOption === "no" && comment.trim() === "")) {
      alert("Please provide all required information.");
      return;
    }

    const today = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD

    try {
      await setDoc(doc(db, "persons", name, "daily_records", today), {
        status: selectedOption,
        comment: selectedOption === "no" ? comment : "",
      });
      setHasSubmitted(true);
      setComment("");
    } catch (error) {
      console.error("Error submitting record: ", error);
    }
  };


  return (
    <>
      <div className="person d-flex flex-column align-items-center justify-content-center p-2">
        <div><h4>{name}</h4></div>
        <div className="label d-flex flex-row align-self-center gap-3">
          <label>
            <input
              type="radio"
              value="yes"
              checked={selectedOption === "yes"}
              onChange={handleOptionChange}
              disabled={hasSubmitted}
            />
            <p>Yes</p>
          </label>
          <label>
            <input
              type="radio"
              value="no"
              checked={selectedOption === "no"}
              onChange={handleOptionChange}
              disabled={hasSubmitted}
            />
            <p>No</p>
          </label>
        </div>
        {selectedOption === "no" && (
          <textarea
            className="textbox"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter comment"
          />
        )}
        <button className="submit-button"
        onClick={handleSubmit}
        disabled={hasSubmitted}>
        {hasSubmitted ? "Already Submitted Today" : "Submit"}
      </button>
      </div>
    </>
  );
}

export default Person;
