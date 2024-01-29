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
 
import TaskPage from "./TaskPage";
 
 
 


const Intakeform = (props) =>{

  const [formData, setFormData] = useState(null);
  const tasksCollectionRef = collection(db, "tasks");

 const nameInputRef = useRef();
  const documentInputRef = useRef();
  const partnerInputRef = useRef();
  const valueInputRef = useRef();
  
   

   

const Submitformhandler = (event) =>{
    event.preventDefault()

    const enteredName = nameInputRef.current.value;
    const entereddocument = documentInputRef.current.value;
    const enteredpartner = partnerInputRef.current.value;
    const enteredvalue = valueInputRef.current.value;
     
    const formData = {
        requesttype:"contractreview",
        Name: `C1-${enteredName}`,
        document :entereddocument,
        partner : enteredpartner,
        value : enteredvalue,
         
        
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
    
    const duegan= calculateDeadlines(new Date(),3)
     

    addDoc(tasksCollectionRef, {
      requesttype:"contractreview",
      Name: `Contract Review For -${enteredName}`,
      document :entereddocument,
        partner : enteredpartner,
        value : enteredvalue,
        enteredduedate : duegan,
        status:"todo",
        assignee:"Adio Adedeji"
    });

    // setFormData(formData);
     console.log(formData)
    
    
      nameInputRef.current.value = '';
      documentInputRef.current.value = '';
      partnerInputRef.current.value = '';
      valueInputRef.current.value = '';
       
    }

    

    return (
        <div>
        <form onSubmit={Submitformhandler}  >
        <div className="overlay"  >
          <div className="card">
            <div className="card-body">
              <div className="username-input">
                <label className="username-label">
                  What is Your Name
                </label>
                <input
                ref={nameInputRef}
                  type="text"
                  className="username-input-field"
                />
              </div>
              <div className="username-input">
                <label className="username-label">Please include a link to the contract if there is any</label>
                <input
                  ref={documentInputRef}
                  type="text"
                  className="username-input-field"
                />
              </div>
              <div className="username-input">
                <label className="username-label">Give us More Context about the contract?</label>
                <input
                  ref={partnerInputRef}
                  type="text"
                  className="username-input-field"
                />
              </div>
              <div className="username-input">
                <label className="username-label">What is the Value of this Contract?</label>
                <input
                  ref={valueInputRef}
                  type="text"
                  className="username-input-field"
                />
              </div>
              {/* <div className="username-input">
                <label className="username-label">What is the due date of this task ?</label>
                <input
                  ref={duedateInputRef}
                  type="text"
                  className="username-input-field"
                />
              </div> */}
               
              <button type="submit" className="user-button"      >
                Submit Request
              </button>
              
    
            </div>
          </div>
        </div>
      </form>
      {formData && <TaskPage taskData={formData} />}
      </div>
       )
    

}


   

export default Intakeform

