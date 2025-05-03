// context/OperationsContext.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export type Operation = {
  id: string;
  type: "buy" | "sell";
  company: string;
  date: string; // formato ISO: "yyyy-mm-dd"
  shares: number;
  totalAmount: number;
};

type OperationsContextType = {
  operations: Operation[];
  addOperation: (op: Operation) => void;
};

const OperationsContext = createContext<OperationsContextType>({
  operations: [],
  addOperation: () => {},
});

export const OperationsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [operations, setOperations] = useState<Operation[]>([]);

  const STORAGE_KEY = "@operations";

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await AsyncStorage.getItem(STORAGE_KEY);
        if (data) setOperations(JSON.parse(data));
      } catch (err) {
        console.error("Error loading operations", err);
      }
    };

    loadData();
  }, []);

  const addOperation = async (op: Operation) => {
    const updated = [...operations, op];
    setOperations(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("Error saving operation", err);
    }
  };

  return (
    <OperationsContext.Provider value={{ operations, addOperation }}>
      {children}
    </OperationsContext.Provider>
  );
};

export const useOperations = () => useContext(OperationsContext);
