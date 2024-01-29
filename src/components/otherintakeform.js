import React, { useRef, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../firebase-config";

const Otherintake = () => {
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);

  const nameInputRef = useRef();
  const documentInputRef = useRef();
  const partnerInputRef = useRef();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    // useEffect(() => {
    //     const getFileUrl = async () => {
    //       if (file) {
    //         const downloadURL = await getDownloadURL(ref(storage, file));
    //         setFileURL(downloadURL);
    //       }
    //     };
    
    //     getFileUrl();
    //   }, []);
    
  };

  const Submitformhandler = async (event) => {
    event.preventDefault();

    const enteredName = nameInputRef.current.value;
    const enteredDocument = documentInputRef.current.files[0];
    const enteredPartner = partnerInputRef.current.value;

    // Upload the file to Firebase storage
    if (enteredDocument) {
      const storageRef = ref(storage, "taskFiles/" + enteredDocument.name);
      await uploadBytes(storageRef, enteredDocument);
    }

    const formData = {
      requesttype: "contractreview",
      Name: enteredName,
      document: enteredDocument ? enteredDocument.name : "",
      partner: enteredPartner,
    };

    addDoc(collection(db, "tasks"), {
      requesttype: "otherrequest",
      Name: `Other Request From - ${enteredName}`,
      pdfdocument: enteredDocument ? enteredDocument.name : "",
      partner: enteredPartner,
      enteredduedate: calculateDeadlines(new Date(), 1),
      status: "todo",
      assignee: "Arun",
    });

    // Clear form inputs
    nameInputRef.current.value = "";
    documentInputRef.current.value = "";
    partnerInputRef.current.value = "";

    console.log(formData);
  };

  const calculateDeadlines = (fromDate, taskDuration) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    while (taskDuration > 0) {
      fromDate.setDate(fromDate.getDate() + 1);

      if (fromDate.getDay() === 0 || fromDate.getDay() === 6) {
        continue;
      }

      taskDuration--;
    }

    const month = months[fromDate.getMonth()];
    const day = fromDate.getDate();

    return `${month} ${day}`;
  };

  return (
    <div>
      <form onSubmit={Submitformhandler}>
        <div className="overlay">
          <div className="card">
            <div className="card-body">
              <div className="username-input">
                <label className="username-label">
                  Please, kindly enter your name
                </label>
                <input
                  ref={nameInputRef}
                  type="text"
                  className="username-input-field"
                />
              </div>
              <div className="username-input">
                <label className="username-label">
                  Please upload a PDF file you would like us to review
                </label>
                <input
                  onChange={handleFileChange}
                  ref={documentInputRef}
                  type="file"
                  className="username-input-field"
                />
              </div>
              <div className="username-input">
                <label className="username-label">
                  Why do you want us to review it?
                </label>
                <input
                  ref={partnerInputRef}
                  type="text"
                  className="username-input-field"
                />
              </div>

              <button type="submit" className="user-button">
                Submit Request
              </button>
            </div>
          </div>
        </div>
      </form>
       
    </div>
  );
};

export default Otherintake;
