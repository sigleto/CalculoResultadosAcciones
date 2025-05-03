import { Link } from "expo-router";
import React from "react";
import { Button, Text, View } from "react-native";
import { useOperations } from "../../context/OperationsContext";

export default function Home() {
  const { operations } = useOperations();

  const totalVentas = operations.filter((op) => op.type === "sell").length;
  const totalCompras = operations.filter((op) => op.type === "buy").length;
  const totalOperaciones = operations.length;

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Bienvenido a Cálculo de Acciones
      </Text>

      <Text>Total de operaciones: {totalOperaciones}</Text>
      <Text>Compras: {totalCompras}</Text>
      <Text>Ventas: {totalVentas}</Text>

      <View style={{ marginTop: 24 }}>
        <Link href="/nueva_operacion" asChild>
          <Button title="➕ Añadir operación" />
        </Link>
        <View style={{ marginTop: 12 }}>
          <Link href="/resultados" asChild>
            <Button title="📊 Ver resultados" />
          </Link>
        </View>
      </View>
    </View>
  );
}
