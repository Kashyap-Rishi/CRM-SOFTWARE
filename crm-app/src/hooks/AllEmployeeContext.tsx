import { createContext, useState, useEffect, useMemo, ReactNode, FC } from 'react';

interface Employee {
  id: string;
  name: string;
  employeeId:string
}

interface AllEmployeeDataContextType {
  data: Employee[] | null;
}

const AllEmployeeDataContext = createContext<AllEmployeeDataContextType | undefined>(undefined);

interface AllEmployeeDataProviderProps {
  children: ReactNode;
}

const AllEmployeeDataProvider: FC<AllEmployeeDataProviderProps> = ({ children }) => {
  const [data, setData] = useState<Employee[] | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/user/fetch-user');
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
  }, []);

  const contextValue = useMemo(() => ({ data }), [data]);

  return (
    <AllEmployeeDataContext.Provider value={contextValue}>
      {children}
    </AllEmployeeDataContext.Provider>
  );
};

export { AllEmployeeDataContext, AllEmployeeDataProvider };
