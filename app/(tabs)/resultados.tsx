import React from "react";
import { Button, ScrollView, Text, View } from "react-native";
import { useOperations } from "../../context/OperationsContext";
import { exportVentasToExcel } from "../../utils/exportToExcel";

export default function Resultados() {
  const { operations } = useOperations();

  type Venta = {
    empresa: string;
    fecha: string;
    accionesVendidas: number;
    ingreso: number;
    precioMedioCompra: string;
    beneficio: string;
    costoVenta: number;
    accionesDisponiblesPostVenta: number;
  };

  // Agrupar por empresa
  const operacionesPorEmpresa = operations.reduce<
    Record<string, typeof operations>
  >((acc, op) => {
    if (!acc[op.company]) acc[op.company] = [];
    acc[op.company].push(op);
    return acc;
  }, {});

  // Calcular ventas por empresa usando PMP
  const ventasPorEmpresa: Record<string, Venta[]> = {};

  Object.entries(operacionesPorEmpresa).forEach(([empresa, ops]) => {
    // Ordenar por fecha
    const sortedOps = [...ops].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let accionesAcumuladas = 0;
    let totalInvertido = 0;
    let ventas: Venta[] = [];

    for (const op of sortedOps) {
      if (op.type === "buy") {
        accionesAcumuladas += op.shares;
        totalInvertido += op.totalAmount;
      } else if (op.type === "sell") {
        // PMP justo antes de la venta
        const pmp =
          accionesAcumuladas > 0 ? totalInvertido / accionesAcumuladas : 0;
        const costoVenta = op.shares * pmp;
        const beneficio = op.totalAmount - costoVenta;

        ventas.push({
          empresa,
          fecha: op.date,
          accionesVendidas: op.shares,
          ingreso: op.totalAmount,
          precioMedioCompra: pmp.toFixed(4),
          beneficio: beneficio.toFixed(2),
          costoVenta,
          accionesDisponiblesPostVenta: accionesAcumuladas - op.shares,
        });

        // Actualizar inventario después de la venta
        accionesAcumuladas -= op.shares;
        totalInvertido -= costoVenta; // restar el coste proporcional, no el ingreso
      }
    }
    ventasPorEmpresa[empresa] = ventas;
  });

  // Unir todas las ventas para exportación
  const ventasTotales: Venta[] = Object.values(ventasPorEmpresa).flat();

  return (
    <ScrollView style={{ padding: 16 }}>
      <Button
        title="📤 Exportar a Excel"
        onPress={() => exportVentasToExcel(ventasTotales)}
      />
      {Object.entries(ventasPorEmpresa).map(([empresa, ventas]) => (
        <View key={empresa} style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 8 }}>
            {empresa}
          </Text>
          {ventas.length === 0 ? (
            <Text style={{ fontStyle: "italic" }}>
              No hay ventas registradas.
            </Text>
          ) : (
            ventas.map((venta, idx) => (
              <View
                key={idx}
                style={{
                  marginBottom: 12,
                  backgroundColor: "#f0f0f0",
                  padding: 8,
                  borderRadius: 8,
                }}
              >
                <Text>📅 Fecha: {venta.fecha}</Text>
                <Text>🔢 Acciones vendidas: {venta.accionesVendidas}</Text>
                <Text>💰 Ingreso: {venta.ingreso.toFixed(2)} €</Text>
                <Text>📉 Precio medio compra: {venta.precioMedioCompra} €</Text>
                <Text>💵 Coste venta: {venta.costoVenta.toFixed(2)} €</Text>
                <Text
                  style={{
                    color: Number(venta.beneficio) >= 0 ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  {Number(venta.beneficio) >= 0 ? "📈 Beneficio" : "📉 Pérdida"}
                  : {venta.beneficio} €
                </Text>
                <Text>
                  🔄 Acciones restantes: {venta.accionesDisponiblesPostVenta}
                </Text>
              </View>
            ))
          )}
        </View>
      ))}
    </ScrollView>
  );
}
