// ProjectDataContext.tsx
import { createContext, useState, useMemo, ReactNode, FC } from "react";

interface ProjectDataContextType {
  projectData: any | null;
  fetchProjectData: (projectId: string) => Promise<void>;
}

const ProjectDataContext = createContext<ProjectDataContextType | undefined>(
  undefined
);

interface ProjectDataProviderProps {
  children: ReactNode;
}

const ProjectDataProvider: FC<ProjectDataProviderProps> = ({ children }) => {
  const [projectData, setProjectData] = useState<any | null>(null);

  const fetchProjectData = async (projectId: string) => {
    try {
      const response = await fetch(
        `https://crm-x.onrender.com/api/project/${projectId}`
      );
      const jsonData = await response.json();
      setProjectData(jsonData.message);
      console.log(jsonData);
    } catch (error) {
      console.error(`Error fetching data for project ${projectId}:`, error);
    }
  };

  const contextValue = useMemo(
    () => ({ projectData, fetchProjectData }),
    [projectData]
  );

  return (
    <ProjectDataContext.Provider value={contextValue}>
      {children}
    </ProjectDataContext.Provider>
  );
};

export { ProjectDataContext, ProjectDataProvider };
