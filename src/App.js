import Design from "./components/Design";
import Homepage from "./components/HomePage";
import ManagerPage from "./components/ManagerPage";
import Taskpage from "./components/TaskPage";
import { createBrowserRouter,RouterProvider } from "react-router-dom";
import SectionPage from "./components/SectionPage";
import Taskdetails from "./components/taskdetails";


const router = createBrowserRouter([

  {path:'/', element:<Homepage/> },
  {path:'/manager-page', element:<Taskpage></Taskpage>},
  {path:'/task-page',element:<ManagerPage></ManagerPage>},
  {path:'/section-page/:sectionName',element:<SectionPage></SectionPage>},
  {path:'/task-page/:taskName',element:<Taskdetails></Taskdetails>}
])

function App() {
  return (
    <div>
   {/* <Design></Design> */}
   <RouterProvider router={router}></RouterProvider>
    
   </div>

  );
}

export default App;
