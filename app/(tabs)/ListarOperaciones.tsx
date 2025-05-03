import React from "react";
import { ScrollView, Text, View } from "react-native";
import { useOperations } from "../../context/OperationsContext";

export default function ListaOperaciones() {
  const { operations } = useOperations();

  if (operations.length === 0) {
    return (
      <View style={{ padding: 16 }}>
        <Text style={{ fontStyle: "italic" }}>
          No hay operaciones registradas.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ padding: 16 }}>
      {operations.map((op, index) => (
        <View
          key={op.id || index}
          style={{
            backgroundColor: "#e0f7fa",
            padding: 10,
            borderRadius: 8,
            marginBottom: 10,
          }}
        >
          <Text>🏷️ Empresa: {op.company}</Text>
          <Text>🗓️ Fecha: {op.date}</Text>
          <Text>📥 Tipo: {op.type === "buy" ? "Compra" : "Venta"}</Text>
          <Text>🔢 Acciones: {op.shares}</Text>
          <Text>💶 Total: {op.totalAmount.toFixed(2)} €</Text>
        </View>
      ))}
    </ScrollView>
  );
}
