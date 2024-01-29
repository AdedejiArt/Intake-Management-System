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


const Templateintakeform = () =>{

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
          Name: enteredName,
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
      
      const duegan= calculateDeadlines(new Date(),5)
       
  
      addDoc(tasksCollectionRef, {
        requesttype:"templaterequest",
        Name: `Template Request From -${enteredName}`,
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
                    Please,Kindly Enter Your Name
                  </label>
                  <input
                  ref={nameInputRef}
                    type="text"
                    className="username-input-field"
                  />
                </div>
                <div className="username-input">
                  <label className="username-label">What kind of Contract Template do you want?</label>
                  <input
                    ref={documentInputRef}
                    type="text"
                    className="username-input-field"
                  />
                </div>
                <div className="username-input">
                  <label className="username-label">What is the Template For?</label>
                  <input
                    ref={partnerInputRef}
                    type="text"
                    className="username-input-field"
                  />
                </div>
                <div className="username-input">
                  <label className="username-label">Which Company do you want to enter an agreement with?</label>
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
        {/* {formData && <TaskPage taskData={formData} />} */}
        </div>
         )
      
  
  }



export default Templateintakeform