import React from "react";
import { Button, ScrollView, Text, View } from "react-native";
import { useOperations } from "../../context/OperationsContext";
import { exportOperacionesToExcel } from "../../utils/exportToExcel";

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

  // Agrupar por empresa
  const operacionesPorEmpresa = operations.reduce<
    Record<string, typeof operations>
  >((acc, op) => {
    if (!acc[op.company]) acc[op.company] = [];
    acc[op.company].push(op);
    return acc;
  }, {});

  return (
    <ScrollView style={{ padding: 16 }}>
      <Button
        title="📤 Exportar a Excel"
        onPress={() => exportOperacionesToExcel(operations)}
      />
      {Object.entries(operacionesPorEmpresa).map(([empresa, ops]) => {
        const ordenadas = [...ops].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        return (
          <View key={empresa} style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 8 }}>
              {empresa}
            </Text>
            {ordenadas.map((op) => (
              <View
                key={op.id}
                style={{
                  backgroundColor: "#e0f7fa",
                  padding: 10,
                  borderRadius: 8,
                  marginBottom: 10,
                }}
              >
                <Text>🗓️ Fecha: {op.date}</Text>
                <Text>📥 Tipo: {op.type === "buy" ? "Compra" : "Venta"}</Text>
                <Text>🔢 Acciones: {op.shares}</Text>
                <Text>💶 Total: {op.totalAmount.toFixed(2)} €</Text>
              </View>
            ))}
          </View>
        );
      })}
    </ScrollView>
  );
}
