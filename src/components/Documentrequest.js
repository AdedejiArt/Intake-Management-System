import React,{useRef,useState} from "react";
import './intake-form.css'
import { db } from "../firebase-config";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
 
const Documentrequest = () =>{
    const [formData, setFormData] = useState(null);
    const tasksCollectionRef = collection(db, "tasks");
  
    const nameInputRef = useRef();
    const documentInputRef = useRef();
    const partnerInputRef = useRef();
    
    
     
  
     
  
  const Submitformhandler = (event) =>{
      event.preventDefault()
  
      const enteredName = nameInputRef.current.value;
      const entereddocument = documentInputRef.current.value;
      const enteredpartner = partnerInputRef.current.value;
       
       
      const formData = {
          requesttype:"contractreview",
          Name: enteredName,
          document :entereddocument,
          partner : enteredpartner,
           
           
          
      }
      function calculateDeadlines(fromDate, taskDuration) {
        const months = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
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
      }
      
      const duegan= calculateDeadlines(new Date(),1)
       
  
      addDoc(tasksCollectionRef, {
        requesttype:"documentrequest",
        Name: `Document Request From -${enteredName}`,
        document :entereddocument,
          partner : enteredpartner,
           
          enteredduedate : duegan,
          status:"todo",
          assignee:"John Doe"
      });
  
      // setFormData(formData);
       console.log(formData)
      
      
        nameInputRef.current.value = '';
        documentInputRef.current.value = '';
        partnerInputRef.current.value = '';
         
         
      }

    return (
          <div>
          <form onSubmit={Submitformhandler}  >
          <div className="overlay"  >
            <div className="card">
              <div className="card-body">
                <div className="username-input">
                  <label className="username-label">
                    Please,Kindly Enter Your Name
                  </label>
                  <input
                  ref={nameInputRef}
                    type="text"
                    className="username-input-field"
                  />
                </div>
                <div className="username-input">
                  <label className="username-label">What kind of Document are you requesting For?</label>
                  <input
                    ref={documentInputRef}
                    type="text"
                    className="username-input-field"
                  />
                </div>
                <div className="username-input">
                  <label className="username-label">What do you wanna use the document for?</label>
                  <input
                    ref={partnerInputRef}
                    type="text"
                    className="username-input-field"
                  />
                </div>
                
                 
                 
                <button type="submit" className="user-button"      >
                  Submit Request
                </button>
                
      
              </div>
            </div>
          </div>
        </form>
         
        </div>
         )
      
    






}

export default Documentrequest