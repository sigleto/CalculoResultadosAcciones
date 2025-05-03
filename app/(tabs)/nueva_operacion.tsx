import React, { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import uuid from "react-native-uuid";
import { useOperations } from "../../context/OperationsContext";

export default function NuevaOperacion() {
  const { addOperation, operations } = useOperations();
  const [type, setType] = useState<"buy" | "sell">("buy");
  const [company, setCompany] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [shares, setShares] = useState("");
  const [totalAmount, setTotalAmount] = useState("");

  const formatDate = (text: string) => {
    const digitsOnly = text.replace(/\D/g, "").slice(0, 8);
    let formatted = "";

    if (digitsOnly.length <= 2) {
      formatted = digitsOnly;
    } else if (digitsOnly.length <= 4) {
      formatted = `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`;
    } else {
      formatted = `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(
        2,
        4
      )}/${digitsOnly.slice(4)}`;
    }

    setDateInput(formatted);
  };

  const parseDate = (input: string): string | null => {
    const [day, month, year] = input.split("/");
    if (!day || !month || !year || year.length !== 4) return null;

    const isoString = `${year}-${month.padStart(2, "0")}-${day.padStart(
      2,
      "0"
    )}`;
    const parsedDate = new Date(isoString);
    return isNaN(parsedDate.getTime()) ? null : isoString;
  };

  const accionesDisponibles = (company: string) => {
    const ops = operations.filter((op) => op.company === company);
    const totalCompradas = ops
      .filter((op) => op.type === "buy")
      .reduce((acc, op) => acc + op.shares, 0);
    const totalVendidas = ops
      .filter((op) => op.type === "sell")
      .reduce((acc, op) => acc + op.shares, 0);
    return totalCompradas - totalVendidas;
  };

  const precioMedioPonderado = (company: string) => {
    const compras = operations
      .filter((op) => op.company === company && op.type === "buy")
      .reduce(
        (acc, op) => {
          const totalCost = acc.totalCost + op.totalAmount;
          const totalShares = acc.totalShares + op.shares;
          return { totalCost, totalShares };
        },
        { totalCost: 0, totalShares: 0 }
      );

    return compras.totalShares > 0
      ? (compras.totalCost / compras.totalShares).toFixed(2)
      : "N/A";
  };

  const handleAdd = () => {
    const parsedDate = parseDate(dateInput);
    const parsedShares = parseFloat(shares.replace(",", "."));
    const parsedAmount = parseFloat(totalAmount.replace(",", "."));

    if (!company || !parsedDate || isNaN(parsedShares) || isNaN(parsedAmount)) {
      Alert.alert(
        "Error",
        "Por favor, rellena todos los campos correctamente."
      );
      return;
    }

    if (type === "sell") {
      const disponibles = accionesDisponibles(company);
      if (parsedShares > disponibles) {
        Alert.alert(
          "Error",
          `No puedes vender más acciones (${parsedShares}) de las que tienes disponibles (${disponibles}).
Precio medio actual: ${precioMedioPonderado(company)} €`
        );
        return;
      }
    }

    addOperation({
      id: uuid.v4() as string,
      type,
      company,
      date: parsedDate,
      shares: parsedShares,
      totalAmount: parsedAmount,
    });

    setCompany("");
    setDateInput("");
    setShares("");
    setTotalAmount("");
  };

  return (
    <View style={{ padding: 16 }}>
      <Text>Tipo: {type === "buy" ? "Compra" : "Venta"}</Text>
      <Button
        title={`Cambiar a ${type === "buy" ? "Venta" : "Compra"}`}
        onPress={() => setType(type === "buy" ? "sell" : "buy")}
      />

      <TextInput
        placeholder="Empresa"
        value={company}
        onChangeText={setCompany}
        style={{ borderWidth: 1, marginVertical: 4, padding: 8 }}
      />

      <TextInput
        placeholder="Fecha (dd/mm/aaaa)"
        value={dateInput}
        onChangeText={formatDate}
        keyboardType="numeric"
        maxLength={10}
        style={{ borderWidth: 1, marginVertical: 4, padding: 8 }}
      />

      <TextInput
        placeholder="Acciones"
        value={shares}
        onChangeText={setShares}
        keyboardType="numeric"
        style={{ borderWidth: 1, marginVertical: 4, padding: 8 }}
      />

      <TextInput
        placeholder="Importe total (€)"
        value={totalAmount}
        onChangeText={setTotalAmount}
        keyboardType="numeric"
        style={{ borderWidth: 1, marginVertical: 4, padding: 8 }}
      />

      <Button title="Guardar operación" onPress={handleAdd} />
    </View>
  );
}
