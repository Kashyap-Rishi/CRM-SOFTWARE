import { createContext, useState, useEffect, useMemo, ReactNode, FC } from 'react';

interface AllCustomerDataContextType {
  data: any[] | null;
}

const AllCustomerDataContext = createContext<AllCustomerDataContextType | undefined>(undefined);

interface AllCustomerDataProviderProps {
  children: ReactNode;
}

const AllCustomerDataProvider: FC<AllCustomerDataProviderProps> = ({ children }) => {
  const [data, setData] = useState<any[] | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/customer/fetch-customer');
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
    <AllCustomerDataContext.Provider value={contextValue}>
      {children}
    </AllCustomerDataContext.Provider>
  );
};

export { AllCustomerDataContext, AllCustomerDataProvider };

