import React,{useState} from 'react';
import './HomePage.css'
import ReactTyped from "react-typed";
import Intakeform from './intake-form';
import TaskPage from './TaskPage';
import Templateintakeform from './Templateintakeform';
import Documentrequest from './Documentrequest';
import Otherintake from './otherintakeform';

const Homepage = () =>{
 const[currentView, SetCurrentView] = useState(null)
 const [taskData, setTaskData] = useState(null);
 const [currentIntakeView, SetCurrentIntakeView] = useState(null)
 const [currentDocumentView, SetCurrentDocumentView] = useState(null)
 const [currentOtherrequestView, SetCurrentOtherrequestView] = useState(null)

 const submitFormHandler = (data) => {
   setTaskData(data);
   console.log(data)
 };

 const Formopener = () =>{
    SetCurrentView(true)
 }

 const DocumentFormopener = () =>{
   SetCurrentDocumentView(true)
}


 
 const IntakeFormopener = () =>{
   SetCurrentIntakeView(true)
}

const OtherFormopener = () =>{
   SetCurrentOtherrequestView(true)
}

    return (
       
        <React.Fragment>
            <div className="opening-message">
                 
                <p>Hello there, I am </p>
                <h1 className="gradient-text">L-automate</h1>

                <ReactTyped
          strings={[
            "Your Task Manger App for In-house Lawyers",
            "Automate Your Task Management with Ease! Very Straight Forward",
            "Create Client Intake Forms in Few Seconds",
            "Give Other departments the chance to create requests in a click",
            "Give AI the chance to make your work easier"
          ]}
          typeSpeed={50}
          backSpeed={50}
          backDelay={1}
          className="text-type"
          loop
          smartBackspace
        />
        

       
                 
            </div>
            <div className='cta'>
            <button className='Contract-Review' onClick={Formopener}>
            Contract Review
         </button>
         {currentView && <Intakeform onSubmit={submitFormHandler} ></Intakeform>}
         <button className='Contract-Review' onClick={IntakeFormopener}>
            Template Creation
         </button>
         {currentIntakeView && <Templateintakeform onSubmit={submitFormHandler} ></Templateintakeform>}
         <button className='Contract-Review' onClick={DocumentFormopener}>
            Document requests
         </button>
         {currentDocumentView && <Documentrequest onSubmit={submitFormHandler} ></Documentrequest>}
         <button className='Contract-Review' onClick={OtherFormopener}>
            Other Requests
         </button>
         {currentOtherrequestView && <Otherintake onSubmit={submitFormHandler} ></Otherintake>}


            </div>
           
            
        </React.Fragment>
    )

}

export default Homepage