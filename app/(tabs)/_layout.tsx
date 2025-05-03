import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case "index":
              iconName = "home-outline";
              break;
            case "nueva_operacion":
              iconName = "add-circle-outline";
              break;
            case "ListarOperaciones":
              iconName = "list-outline";
              break;
            case "resultados":
              iconName = "bar-chart-outline";
              break;
            default:
              iconName = "ellipse-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        tabBarStyle: {
          backgroundColor: "#f9f9f9",
          borderTopWidth: 1,
          borderTopColor: "#ccc",
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
        },
        headerShown: false,
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Inicio" }} />
      <Tabs.Screen name="nueva_operacion" options={{ title: "Nueva Op" }} />
      <Tabs.Screen name="ListarOperaciones" options={{ title: "Listado Op" }} />
      <Tabs.Screen name="resultados" options={{ title: "Resultados" }} />
    </Tabs>
  );
}
