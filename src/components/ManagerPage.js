// import React, { useEffect, useState } from "react";
// import {
//   getDocs,
//   collection,
//   addDoc,
//   deleteDoc,
//   updateDoc,
//   doc,
// } from "firebase/firestore";
// import { db } from "../firebase-config";
// import ManagerTaskPage from "./ManagerTaskCard";
// import Draggable from "react-draggable";
// import "./ManagerPage.css";
// import { Link, useNavigate } from "react-router-dom";

// const ManagerPage = () => {
//   const [tasksList, setTasksList] = useState([]);
//   const tasksCollectionRef = collection(db, "tasks");
//   const navigate = useNavigate();

//   const getTasksList = async () => {
//     try {
//       const data = await getDocs(tasksCollectionRef);
//       const filteredData = data.docs.map((doc) => ({
//         ...doc.data(),
//         id: doc.id,
//       }));
//       setTasksList(filteredData);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     getTasksList();
//   }, []);

//   const handleDrag = async(task, newStatus) => {
//     const updatedTasksList = tasksList.map((t) => {
//       if (t.id === task.id) {
//         return { ...t, status: newStatus };
//       }
//       return t;
//     });
//     setTasksList(updatedTasksList);
//     try {
//       const taskDocRef = doc(db, "tasks", task.id);
//       await updateDoc(taskDocRef, { status: newStatus });
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const calculateNewStatus = (y) => {
//     // Define the y-coordinate thresholds for each status
//     const statusThresholds = [
//       { status: "todo", threshold: 100 },
//       { status: "inprogress", threshold: 300 },
//       { status: "completed", threshold: 700},
//     ];

//     // Find the new status based on the y-coordinate
//     let newStatus = "todo"; // Default to "Todo" status

//     statusThresholds.forEach((threshold) => {
//       if (y >= threshold.threshold) {
//         newStatus = threshold.status;
//       }
//       console.log(newStatus)
//     });

//     return newStatus;
//   };

   
//   const OpenTaskCard = (e,taskName) => {
//     e.stopPropagation(); 
//     navigate(`/task-page/${taskName}`);
//     console.log("Hello World")
//     console.log(taskName)
//   }

//   return (
//     <div>
//       <div className="alltasksdiv"><h2 className="alltasks">Task Repository</h2></div>
    
//     <div className="manager-page">
      
//       <div className="section">  
//         <h2 className="section-title">Todo</h2>
//         <div className="section-container">
//           {tasksList.map((task) => {
//             if (task.requesttype === "contractreview" && task.status === "todo"  ) {
//               return (
//                 <Draggable
//                   key={task.id}
//                   onStop={(e, data) => {
//                     const newStatus = calculateNewStatus(data.lastX);
//                     console.log(data.lastX)
//                     console.log(newStatus)
//                     handleDrag(task, newStatus);
//                   }}
//                 >
//                   <div onClick={(e) => OpenTaskCard(e, task.Name)}>
//                     <ManagerTaskPage key={task.id} task={task}  />
//                   </div>
//                 </Draggable>
//               );
//             }
//             return null;
//           })}
//         </div>
//       </div>
//       <div className="section">
//         <h2 className="section-title">In Progress</h2>
//         <div className="section-container">
//           {tasksList.map((task) => {
//             if (
//               task.requesttype === "contractreview" &&
//               task.status === "inprogress"
//             ) {
//               return ( <Draggable
//               key={task.id}
//               onStop={(e, data) => {
//                 const newStatus = calculateNewStatus(data.lastX);
//                 console.log(data.lastX)
//                 console.log(newStatus)
//                 handleDrag(task, newStatus);
//               }}
//             >
//               <div>
//                 <ManagerTaskPage key={task.id} task={task} />
//               </div>
//             </Draggable>)
//             }
//             return null;
//           })}
//         </div>
//       </div>
//       <div className="section">
//         <h2 className="section-title">Completed</h2>
//         <div className="section-container">
//           {tasksList.map((task) => {
//             if (
//               task.requesttype === "contractreview" &&
//               task.status === "completed"
//             ) {
//               return (
//                 <Draggable
//                   key={task.id}
//                   onStop={(e, data) => {
//                     const newStatus = calculateNewStatus(data.lastX);
//                     console.log(data.lastX)
//                     console.log(newStatus)
//                     handleDrag(task, newStatus);
//                   }}
//                 >
//                   <div>
//                     <ManagerTaskPage key={task.id} task={task} />
//                   </div>
//                 </Draggable>
//               );
//             }
//             return null;
//           })}
//         </div>
//       </div>
//     </div>
//     </div>
//   );
// };

// export default ManagerPage;


import React, { useEffect, useState } from "react";
import {
  getDocs,
  collection,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db,storage } from "../firebase-config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import ManagerTaskCard from "./ManagerTaskCard";
import Draggable from "react-draggable";
import "./ManagerPage.css";
import Taskdetails from "./taskdetails";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import axios from "axios";
 
GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js";
const ManagerPage = () => {
  const OPENAI_API_KEY = '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';

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
  };
  const [tasksList, setTasksList] = useState([]);
  const tasksCollectionRef = collection(db, "tasks");
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [assigneeFilter, setAssigneeFilter] = useState("");
  const [requestTypeFilter, setRequestTypeFilter] = useState("");
  const [fileURL, setFileURL] = useState(null);
  const [messageContent, setMessageContent] = useState('');
  



  const getTasksList = async () => {
    try {
      const data = await getDocs(tasksCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setTasksList(filteredData);
      setFilteredTasks(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getTasksList();
  }, []);

  const handleDrag = async (task, newStatus) => {
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
      { status: "completed", threshold: 500 },
    ];

    // Find the new status based on the y-coordinate
    let newStatus = "todo"; // Default to "Todo" status

    statusThresholds.forEach((threshold) => {
      if (y >= threshold.threshold) {
        newStatus = threshold.status;
        console.log(newStatus)
      }
    });

    return newStatus;
  };

  const handleTaskClick = async (e, task) => {
    e.stopPropagation();
    setSelectedTask(task);
    setIsTaskOpen(!isTaskOpen);
    if (task.pdfdocument) {
      // Assuming you have the reference to your Firebase storage
      const storageRef = ref(storage, "taskFiles/" + task.pdfdocument);
      const downloadURL = await getDownloadURL(storageRef);
      setFileURL(downloadURL);

       
    }
    if (task.requesttype == "otherrequest"){
      const requestData = {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'please summarize this for me: Hi, I consider myself to be a power house of ideas and taking initiatives. Moreover, Im an innovator seeking a leadership role in people and project management and I have completed my undergraduate at ALU and Im going to graduate with a first class honor in July. Ihave used my self-driven nature and people management experience to deliver high-caliber service in challenging situations and create user-centric solutions. I have been doing administrative work for the last three years, and I specialize in helping companies and entrepreneurs scale up and grow their companies. In my most recent work role, while working as a Research Project Intern for African Parks, I prepared proposals and donor reports, ensuring compliance with community donor requirements resulting in a 95% success rate in community capacity building. In fact, I have listed some of my work experience in the resume I shared while applying for the role. What Im looking for is a company where I can add value to while contributing to the company mission, and that I will be able to produce a positive return on investment. Where I can join a strong team. Is this what FIXA is looking for?' }],
        temperature: 0.7,
      };
  
      axios
        .post('https://api.openai.com/v1/chat/completions', requestData, { headers })
        .then((response) => {
          const messageContent = response.data.choices[0].message.content;
          setMessageContent(messageContent);
          // Do something with the generated message content
        })
        .catch((error) => {
          console.error('Error:', error.response);
        });


    }else if (task.requesttype == "contractreview"){
      const requestData = {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'What are the steps I have to take to review a contract as a lawyer' }],
        temperature: 0.7,
      };
  
      axios
        .post('https://api.openai.com/v1/chat/completions', requestData, { headers })
        .then((response) => {
          const messageContent = response.data.choices[0].message.content;
          setMessageContent(messageContent);
          // Do something with the generated message content
        })
        .catch((error) => {
          console.error('Error:', error.response);
        });


    }
    


  };

  const handleDragEnd = (task, dragInfo) => {
    const newStatus = calculateNewStatus(dragInfo.x);
    handleDrag(task, newStatus);
  };
  // const handleSearchInputChange = (event) => {
  //   const query = event.target.value;
  //   setSearchQuery(query);

  //   const filteredTasks = tasksList.filter((task) => {
  //     // Implement your search logic here based on task properties
  //     // For example, you can check if the task name or any other property contains the search query
  //     return task.Name.toLowerCase().includes(query.toLowerCase());
  //   });

  //   setFilteredTasks(filteredTasks);
  // };

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
    
    <div className="manager-page">


      <div className="section">
        <h2 className="section-title">Todo</h2>
        <div className="section-container">
          {filteredTasks.map((task) => {
            if (task.status === "todo") {
              return (
                <Draggable
                  key={task.id}
                  onStop={(e, data) => {
                    const newStatus = calculateNewStatus(data.lastX);
                    handleDrag(task, newStatus);
                  }}
                  onDragEnd={(e, data) => handleDragEnd(task, data)}

                >
                  <div onClick={(e) => handleTaskClick(e, task)}>
                    <ManagerTaskCard key={task.id} task={task} />
                  </div>
                </Draggable>
              );
            }
            return null;
          })}
        </div>
      </div>
      <div className="section">
        <h2 className="section-title">In Progress</h2>
        <div className="section-container">
          {filteredTasks.map((task) => {
            if ( task.status === "inprogress") {
              return (
                <Draggable
                  key={task.id}
                  onStop={(e, data) => {
                    const newStatus = calculateNewStatus(data.lastX);
                    handleDrag(task, newStatus);
                  }}
                  onDragEnd={(e, data) => handleDragEnd(task, data)}
                >
                  
                  <div onClick={(e) => handleTaskClick(e, task)}>
                    <ManagerTaskCard key={task.id} task={task}  />
                  </div>
                </Draggable>
              );
            }
            return null;
          })}
        </div>
      </div>
      <div className="section">
        <h2 className="section-title">Completed</h2>
        <div className="section-container">
          {filteredTasks.map((task) => {
            if ( task.status === "completed") {
              return (
                <Draggable
                  key={task.id}
                  onStop={(e, data) => {
                    const newStatus = calculateNewStatus(data.lastX);
                    handleDrag(task, newStatus);
                  }}
                  onDragEnd={(e, data) => handleDragEnd(task, data)}
                >
                  <div onClick={(e) => handleTaskClick(e, task)}>
                    <ManagerTaskCard key={task.id} task={task} />
                  </div>
                </Draggable>
              );
            }
            return null;
          })}
        </div>
      </div>
       
      {selectedTask && (
        <div className={`task-component ${isTaskOpen ? "task-open" : ""}`}>
          {/* Render the detailed task component */}
          {/* {fileURL && <embed src={fileURL} type="application/pdf" width="100%" height="300" />} */}
          <Taskdetails  task={selectedTask} messageContent={messageContent} pdfPreview={fileURL && <embed src={fileURL} type="application/pdf" width="100%" height="300"    />} />
         
        </div>
        
      )}
    </div>
    </div>
  );
};

export default ManagerPage;
