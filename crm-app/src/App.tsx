import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/Dashboard/DashboardLayout";
import Statistics from "./components/Dashboard/Statistics";
import Campaigns from "./components/Dashboard/Campaigns";
import Signup from "./components/Auth/Signup";
import ProjectManagement from "./components/Dashboard/ProjectManagement";
import CreateTaskButton from "./components/task/TaskManagement";

function App() {
  return (
    <div className="App-main">
      <Router>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/dashboard/:username" element={<DashboardLayout />}>
            <Route path="statistics" element={<Statistics />} />
            <Route path="campaigns" element={<Campaigns />} />
            <Route path="projects" element={<ProjectManagement />}/>           
            <Route path=":projectId/task" element={<CreateTaskButton />} />
         
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
