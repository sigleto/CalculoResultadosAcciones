import { Slot } from "expo-router";
import { OperationsProvider } from "../context/OperationsContext";

export default function Layout() {
  return (
    <OperationsProvider>
      <Slot />
    </OperationsProvider>
  );
}
