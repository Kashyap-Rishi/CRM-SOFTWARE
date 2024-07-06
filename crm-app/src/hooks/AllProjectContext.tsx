import { createContext, useState, useEffect, useMemo, ReactNode, FC } from 'react';



interface AllProjectDataContextType {
  data: any[] | null;
}

const AllProjectDataContext = createContext<AllProjectDataContextType | undefined>(undefined);

interface AllProjectDataProviderProps {
  children: ReactNode;
}

const AllProjectDataProvider: FC<AllProjectDataProviderProps> = ({ children }) => {
  const [data, setData] = useState<any[] | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/project/fetch-project');
      const jsonData = await response.json();
      // Assuming jsonData.message contains an array of employees
      setData(jsonData.message);
      console.log(jsonData); // Log jsonData to understand its structure
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData(); 
    const intervalId = setInterval(fetchData, 6000); 

    return () => clearInterval(intervalId); 
  }, []);

  const contextValue = useMemo(() => ({ data }), [data]);

  return (
    <AllProjectDataContext.Provider value={contextValue}>
      {children}
    </AllProjectDataContext.Provider>
  );
};

export { AllProjectDataContext, AllProjectDataProvider };
