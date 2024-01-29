import React from "react";
import { useParams,useLocation } from "react-router-dom";
import { useEffect,useState } from "react";
import { db } from "../firebase-config";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import './ManagerPage.css'
import ManagerTaskPage from "./ManagerTaskCard";
import Draggable from "react-draggable";
 
const SectionPage = () => {
    const location = useLocation();
     

  // Retrieve the tasksToRender from the location state
  const tasksToRender = location.state?.tasksToRender || [];
  const taskValues = tasksToRender[0].requesttype
  console.log(taskValues)

    const [tasksList, setTasksList] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [assigneeFilter, setAssigneeFilter] = useState("");
    const [requestTypeFilter, setRequestTypeFilter] = useState("");
     
const today = new Date()

 
const getCardColor = (requestType) => {
  switch (requestType) {
    case "Contractreview":
      return "contract-review-color"; // CSS class for Contractreview request type
    case "templaterequest":
      return "template-request-color"; // CSS class for Templaterequest request type
    default:
      return ""; // Default class if the request type is not recognized
  }
};

const handleDrag = async(task, newStatus) => {
  const updatedTasksList = tasksList.map((t) => {
    if (t.id === task.id) {
      return { ...t, status: newStatus };
    }
    return t;
  });
  setTasksList(updatedTasksList);
  try {
    const taskDocRef = doc(db, "tasks", task.id);
    await updateDoc(taskDocRef, { status: newStatus });
  } catch (err) {
    console.error(err);
  }
};
const calculateNewStatus = (y) => {
  // Define the y-coordinate thresholds for each status
  const statusThresholds = [
    { status: "todo", threshold: 100 },
    { status: "inprogress", threshold: 300 },
    { status: "completed", threshold: 700},
  ];

  // Find the new status based on the y-coordinate
  let newStatus = "todo"; // Default to "Todo" status

  statusThresholds.forEach((threshold) => {
    if (y >= threshold.threshold) {
      newStatus = threshold.status;
    }
    console.log(newStatus)
  });

  return newStatus;
};
const handleSearchInputChange = (event) => {
  const query = event.target.value;
  setSearchQuery(query);

  const filteredTasks = tasksToRender.filter((task) => {
    // Implement your search logic here based on task properties
    // For example, you can check if the task name or any other property contains the search query
    return task.Name.toLowerCase().includes(query.toLowerCase());
  });

  applyFilters(filteredTasks);
};

const applyFilters = (tasks) => {
  const filteredTasks = tasks.filter((task) => {
    // Implement your filter logic here based on the assigneeFilter and requestTypeFilter values
    // For example, you can check if the task assignee matches the assigneeFilter value
    // and if the task request type matches the requestTypeFilter value

    const assigneeMatch =
      assigneeFilter === "" || task.assignee.toLowerCase() === assigneeFilter.toLowerCase();
    const requestTypeMatch =
      requestTypeFilter === "" || task.requesttype.toLowerCase() === requestTypeFilter.toLowerCase();

    return assigneeMatch && requestTypeMatch;
  });

  setFilteredTasks(filteredTasks);
};



const handleAssigneeFilterChange = (event) => {
  const assignee = event.target.value;
  setAssigneeFilter(assignee);

  applyFilters(tasksToRender);
};

const handleRequestTypeFilterChange = (event) => {
  const requestType = event.target.value;
  setRequestTypeFilter(requestType);

  applyFilters(tasksToRender);
};
  
  return (
    <div>
      <div className="search-container">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchInputChange}
          placeholder="Search tasks"
        />
        <select className="filter-button"
          value={assigneeFilter}
          onChange={handleAssigneeFilterChange}
        >
          
          <option value="Adio Adedeji">Adio Adedeji</option>
          <option value="John Doe">John Doe</option>
          <option value="">All Assignees</option>
           
        </select>
        <select className="filter-button"
          value={requestTypeFilter}
          onChange={handleRequestTypeFilterChange}
        >
          
          <option value="contractreview">Contract Review</option>
          <option value="templaterequest">Template Request</option>
          <option value="">All Request Types</option>
          <option value="documentrequest">Document Request</option>
        </select>
         
      </div>
    <div className="Contract-Review-Tasks">
      <div className="manager-page">
        <div className="section">
          <h2 className="section-title">Overdue</h2>
          <div className="section-container">
            {filteredTasks.map((task) => {
              if (task.enteredduedate < today && task.status !== "completed") {
                
                return (
                  <ManagerTaskPage
                    key={task.id}
                    task={task}
                    cardColor={getCardColor(task.requesttype)}
                    
                  />
                );
              }
              return null;
            })}
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">Todo</h2>
          <div className="section-container">
            {tasksToRender.map((task) => {
              if (task.status === "todo") {
                return(<Draggable
                  key={task.id}
                  onStop={(e, data) => {
                    const newStatus = calculateNewStatus(data.lastX);
                    console.log(data.lastX)
                    console.log(newStatus)
                    handleDrag(task, newStatus);
                  }}
                >
                  <div>
                  <ManagerTaskPage
                    key={task.id}
                    task={task}
                    cardColor={getCardColor(task.requesttype)}
                  />
                  </div>
                </Draggable>)
                 
              }
              return null;
            })}
          </div>
        </div>

        <div className="section">
          <h2 className="section-title" >In Progress</h2>
          <div className="section-container">
            {tasksToRender.map((task) => {
              if (task.status === "inprogress") {
                return(<Draggable
                  key={task.id}
                  onStop={(e, data) => {
                    const newStatus = calculateNewStatus(data.lastX);
                    console.log(data.lastX)
                    console.log(newStatus)
                    handleDrag(task, newStatus);
                  }}
                >
                  <div>
                  <ManagerTaskPage
                    key={task.id}
                    task={task}
                    cardColor={getCardColor(task.requesttype)}
                  />
                  </div>
                </Draggable>)
              }
              return null;
            })}
          </div>
        </div>

        <div className="section">
          <h2 className="section-title" >Completed</h2>
          <div className="section-container">
            {tasksToRender.map((task) => {
              if (task.status === "completed") {
                return(<Draggable
                  key={task.id}
                  onStop={(e, data) => {
                    const newStatus = calculateNewStatus(data.lastX);
                    console.log(data.lastX)
                    console.log(newStatus)
                    handleDrag(task, newStatus);
                  }}
                >
                  <div>
                  <ManagerTaskPage
                    key={task.id}
                    task={task}
                    cardColor={getCardColor(task.requesttype)}
                  />
                  </div>
                </Draggable>)
              }
              return null;
            })}
          </div>
        </div>
      </div>
    </div>
    </div>
  );

 
};

export default SectionPage;
