import { createContext, useState, useEffect, useMemo, ReactNode, FC } from 'react';

interface AllLogDataContextType {
  data: any[] | null;
}

const AllLogDataContext = createContext<AllLogDataContextType | undefined>(undefined);

interface AllLogDataProviderProps {
  children: ReactNode;
}

const AllLogDataProvider: FC<AllLogDataProviderProps> = ({ children }) => {
  const [data, setData] = useState<any[] | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch('https://crm-x.onrender.com/api/log/fetch-log');
      const jsonData = await response.json();
      setData(jsonData.message);
      console.log(data);
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
    <AllLogDataContext.Provider value={contextValue}>
      {children}
    </AllLogDataContext.Provider>
  );
};

export { AllLogDataContext, AllLogDataProvider };

