import React, { useState, useEffect } from "react";
import "./Hero.css";
import Person from "./Person";
import { db } from "../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

function Hero() {
  const [people, setPeople] = useState([]);
  const [recordsByDate, setRecordsByDate] = useState({});

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const peopleSnapshot = await getDocs(collection(db, "persons"));
        const peopleList = peopleSnapshot.docs.map((doc) => doc.id);
        setPeople(peopleList);
      } catch (error) {
        console.error("Error fetching people: ", error);
      }
    };

    fetchPeople();
  }, []);

  useEffect(() => {
    const fetchRecords = async () => {
      const today = new Date();
      const pastDate = new Date();
      pastDate.setDate(today.getDate() - 7);

      const todayStr = today.toISOString().slice(0, 10);
      const pastDateStr = pastDate.toISOString().slice(0, 10);

      try {
        const fetchedRecords = {};

        for (const person of people) {
          const dailyRecordsCollection = collection(
            db,
            "persons",
            person,
            "daily_records"
          );

          const recordsSnapshot = await getDocs(dailyRecordsCollection);

          recordsSnapshot.forEach((doc) => {
            const dateStr = doc.id;

            if (dateStr >= pastDateStr && dateStr <= todayStr) {
              if (!fetchedRecords[dateStr]) {
                fetchedRecords[dateStr] = [];
              }
              fetchedRecords[dateStr].push({ person, ...doc.data() });
            }
          });
        }
        setRecordsByDate(fetchedRecords);
        
      } catch (error) {
        console.error("Error fetching records: ", error);
      }
    };

    if (people.length > 0) {
      fetchRecords();
    }
  }, [people]);

  return (
    <>
      <div className="hero d-flex flex-column align-items-center justify-content-center gap-3">
        <div className="heading">
          <h1>Did you walk today?</h1>
        </div>
        <div className="d-flex flex-column flex-lg-row flex-md-row justify-content-evenly w-100">
          {people.length > 0 ? (
            people.map((name, index) => <Person key={index} name={name} />)
          ) : (
            <p>No people data available</p>
          )}
        </div>
        <div className="show-data">
          <h2>Data for the Past 7 Days</h2>
          <div className="datas d-flex flex-lg-row flex-column flex-md-row justify-content-center gap-5">
          {Object.keys(recordsByDate).map((date, index) => (
            <div key={index} className="date-group">
              <h6>Date - {date}</h6>
              <ul>
                {recordsByDate[date].map((record, idx) => (
                  <li key={idx}>
                    <strong>{record.person}</strong> - {record.status}
                    {record.comment && ` - Comment: ${record.comment}`}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Hero;
