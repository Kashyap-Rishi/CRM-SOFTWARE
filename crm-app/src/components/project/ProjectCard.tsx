import { useContext } from "react";
import { AllProjectDataContext } from "../../hooks/AllProjectContext";
import {CircularProgress} from '@mui/material';

const ProjectCard = () => {
    const contextValue = useContext(AllProjectDataContext);
    if (!contextValue || contextValue.data === null) {
        return <CircularProgress />; // Loading indicator while data is being fetched
      }
    
      const { data: projects } = contextValue;
      console.log(projects);
  return (
    <div>ProjectCard</div>
  )
}

export default ProjectCard