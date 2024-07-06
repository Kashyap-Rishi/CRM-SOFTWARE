import {
  createContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
  FC,
} from "react";

interface AllProjectDataContextType {
  data: any[] | null;
}

const AllProjectDataContext = createContext<
  AllProjectDataContextType | undefined
>(undefined);

interface AllProjectDataProviderProps {
  children: ReactNode;
}

const AllProjectDataProvider: FC<AllProjectDataProviderProps> = ({
  children,
}) => {
  const [data, setData] = useState<any[] | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://crm-x.onrender.com/api/project/fetch-project"
      );
      const jsonData = await response.json();

      setData(jsonData.message);
      console.log(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
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
