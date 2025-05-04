import React from "react";
import {
  Alert,
  Button,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useOperations } from "../../context/OperationsContext";
import { exportOperacionesToExcel } from "../../utils/exportToExcel";

export default function ListaOperaciones() {
  const { operations, deleteOperation } = useOperations();

  if (operations.length === 0) {
    return (
      <View style={{ padding: 16 }}>
        <Text style={{ fontStyle: "italic" }}>
          No hay operaciones registradas.
        </Text>
      </View>
    );
  }

  const operacionesPorEmpresa = operations.reduce<
    Record<string, typeof operations>
  >((acc, op) => {
    if (!acc[op.company]) acc[op.company] = [];
    acc[op.company].push(op);
    return acc;
  }, {});

  const confirmarEliminacion = (id: string) => {
    Alert.alert(
      "Eliminar operación",
      "¿Estás seguro de que deseas eliminar esta operación?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => deleteOperation(id),
        },
      ]
    );
  };

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
                <TouchableOpacity
                  onPress={() => deleteOperation(op.id)}
                  style={{
                    backgroundColor: "#ff5252",
                    paddingVertical: 4,
                    paddingHorizontal: 8,
                    borderRadius: 4,
                    alignSelf: "flex-start",
                    marginTop: 6,
                  }}
                >
                  <Text style={{ color: "white", fontSize: 12 }}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        );
      })}
    </ScrollView>
  );
}
