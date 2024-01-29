
import React from "react";
import "./TaskPage.css";

const TaskCard = ({ task,cardColor }) => {

  const getCardColorClass = () => {
    if (task.requesttype === "contractreview") {
      return "task-card-contract-review";
    } else if (task.requesttype === "templaterequest") {
      return "task-card-template-request";
    } else if (task.requesttype === "documentrequest") {
      return "task-card-document-request";
    }
    else if (task.requesttype === "otherrequest") {
      return "task-card-other-request";
    }
    return ""; // Default color class
  };
  return (
     
    <div className={`task-card ${getCardColorClass()}`}>
    <h1 className="task-card-title">{task.Name}</h1>
    <div className="footer">
    <p className="task-card-description">{task.enteredduedate}</p>
    <p className="task-card-assignee">{task.assignee}</p>
    </div>
     
  
  </div>
    
  );
};

export default TaskCard;
