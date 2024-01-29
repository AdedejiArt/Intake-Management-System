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
import TaskCard from "./TaskCard";
import './TaskPage.css'
import SectionPage from "./SectionPage";
import { Link, useNavigate } from "react-router-dom";
import Taskdetails from "./taskdetails";

const TaskPage = () => {
  const navigate = useNavigate();
  const [tasksList, setTasksList] = useState([]);
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [assigneeFilter, setAssigneeFilter] = useState("");
  const [requestTypeFilter, setRequestTypeFilter] = useState("");



  const sections = [
    { id: 1, name: "Todo" },
    { id: 2, name: "In Progress" },
    { id: 3, name: "Completed" },
  ];
  const tasksCollectionRef = collection(db, "tasks");

  const getTasksList = async () => {
    try {
      const data = await getDocs(tasksCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setTasksList(filteredData);
      setFilteredTasks(filteredData)
      // console.log(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getTasksList();
  }, []);

   
  
  const handleViewMore = (sectionName) => {
    
    if (sectionName=="contractreview"){
      console.log(tasksList)
      const contractReviewTasks = tasksList.filter(
        (task) => task.requesttype === "contractreview"
        
      );
      console.log(contractReviewTasks)
      navigate(`/section-page/${sectionName}`,{state:{tasksToRender:contractReviewTasks}});
  };
  if (sectionName=="templaterequest"){
    console.log(tasksList)
    const templateRequestTasks = tasksList.filter(
      (task) => task.requesttype === "templaterequest"
      
    );
    console.log(templateRequestTasks)
    navigate(`/section-page/${sectionName}`,{state:{tasksToRender:templateRequestTasks}});
};
if (sectionName=="otherrequest"){
  console.log(tasksList)
  const otherRequestTasks = tasksList.filter(
    (task) => task.requesttype === "otherrequest"
    
  );
  console.log(otherRequestTasks)
  navigate(`/section-page/${sectionName}`,{state:{tasksToRender:otherRequestTasks}});
};
if (sectionName=="documentrequest"){
  console.log(tasksList)
  const documentRequestTasks = tasksList.filter(
    (task) => task.requesttype === "documentrequest"
    
  );
  console.log(documentRequestTasks)
  navigate(`/section-page/${sectionName}`,{state:{tasksToRender:documentRequestTasks}});
};
    }

    

    const getSectionTitleColorClass = (section) => {
      if (section === "contractreview") {
        return "section-title-contract-review";
      } else if (section === "templaterequest") {
        return "section-title-template-request";
      }else if (section === "documentrequest") {
        return "section-title-document-request";
      }else if (section === "otherrequest") {
        return "section-title-other-request";
      }
      return ""; // Default color class
    }; 

    const handleSearchInputChange = (event) => {
      const query = event.target.value;
      setSearchQuery(query);
  
      const filteredTasks = tasksList.filter((task) => {
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
  
      applyFilters(tasksList);
    };
  
    const handleRequestTypeFilterChange = (event) => {
      const requestType = event.target.value;
      setRequestTypeFilter(requestType);
  
      applyFilters(tasksList);
    };

    const handleTaskClick = (task) => {
       
    setSelectedTask(task);
    setIsTaskOpen(!isTaskOpen);;
    };
  
    
 return (
    <div className="task-page">

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
      
      <div className="section">
        <h2 className={`section-title ${getSectionTitleColorClass("contractreview")}`}>Contract Review</h2>
        <div className="task-cards">
        {/* Render tasks for Section 1 */}
        {filteredTasks
          .filter((task) => task.requesttype === "contractreview")
          .map((task) => (
            
            <div onClick={() => handleTaskClick(task)}>
            <TaskCard key={task.id} task={task}  
            />
            </div>
          ))}
      </div>
      <button
            onClick={() => handleViewMore("contractreview")}
            className="view-more-button"
          >
            View More
          </button>
      </div>
      <div className="section">
        <h2 className={`section-title ${getSectionTitleColorClass("templaterequest")}`}>Template Request</h2>
        <div className="task-cards">
        {/* Render tasks for Section 2 */}
        {filteredTasks
          .filter((task) => task.requesttype === "templaterequest")
          .map((task) => (
            <div onClick={() => handleTaskClick(task)}>
            <TaskCard key={task.id} task={task}  
            />
            </div>
            
          ))}
          </div>
      </div>
      <button
            onClick={() => handleViewMore("templaterequest")}
            className="view-more-button"
          >
            View More
          </button>
          <div className="section">
        <h2 className={`section-title ${getSectionTitleColorClass("documentrequest")}`}>Document Request</h2>
        <div className="task-cards">
        {/* Render tasks for Section 3 */}
        {filteredTasks
          .filter((task) => task.requesttype === "documentrequest")
          .map((task) => (
            <div onClick={() => handleTaskClick(task)}>
            <TaskCard key={task.id} task={task}  
            />
            </div>
            
          ))}
          </div>
      </div>
      
      <button
            onClick={() => handleViewMore("documentrequest")}
            className="view-more-button"
          >
            View More
          </button>

          <div className="section">
        <h2 className={`section-title ${getSectionTitleColorClass("otherrequest")}`}>Other Requests</h2>
        <div className="task-cards">
        {/* Render tasks for Section 3 */}
        {filteredTasks
          .filter((task) => task.requesttype === "otherrequest")
          .map((task) => (
            <div onClick={() => handleTaskClick(task)}>
            <TaskCard key={task.id} task={task}  
            />
            </div>
            
          ))}
          </div>
      </div>
      <button
            onClick={() => handleViewMore("otherrequest")}
            className="view-more-button"
          >
            View More
          </button>
           
          {selectedTask && (
        <div className={`task-component ${isTaskOpen ? "task-open" : ""}`}>
          {/* Render the detailed task component */}
          <Taskdetails task={selectedTask} />
        </div>
        
      )}
      {/* Add more sections as needed */}
    </div>
  );
};

export default TaskPage;