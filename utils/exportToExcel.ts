import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import XLSX from "xlsx";
import { Operation } from "../context/OperationsContext"; // Asegúrate de importar el tipo Operation

type OperacionExcel = {
  Empresa: string;
  Fecha: string;
  Tipo: string;
  Acciones: number;
  "Importe Total (€)": number;
  "Precio por Acción (€)": string;
};

export const exportOperacionesToExcel = async (operations: Operation[]) => {
  try {
    // Transformar las operaciones al formato para Excel
    const operacionesFormateadas: OperacionExcel[] = operations.map((op) => ({
      Empresa: op.company,
      Fecha: op.date,
      Tipo: op.type === "buy" ? "Compra" : "Venta",
      Acciones: op.shares,
      "Importe Total (€)": op.totalAmount,
      "Precio por Acción (€)": (op.totalAmount / op.shares).toFixed(4),
    }));

    // Ordenar por empresa y fecha
    operacionesFormateadas.sort((a, b) => {
      if (a.Empresa < b.Empresa) return -1;
      if (a.Empresa > b.Empresa) return 1;
      return new Date(a.Fecha).getTime() - new Date(b.Fecha).getTime();
    });

    const worksheet = XLSX.utils.json_to_sheet(operacionesFormateadas);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Operaciones");

    // Ajustar el ancho de las columnas
    const wscols = [
      { wch: 20 }, // Empresa
      { wch: 12 }, // Fecha
      { wch: 8 }, // Tipo
      { wch: 10 }, // Acciones
      { wch: 15 }, // Importe Total
      { wch: 15 }, // Precio por Acción
    ];
    worksheet["!cols"] = wscols;

    const binaryExcel = XLSX.write(workbook, {
      type: "base64",
      bookType: "xlsx",
    });

    const fileUri = FileSystem.documentDirectory + "operaciones.xlsx";

    await FileSystem.writeAsStringAsync(fileUri, binaryExcel, {
      encoding: FileSystem.EncodingType.Base64,
    });

    await Sharing.shareAsync(fileUri, {
      mimeType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      dialogTitle: "Exportar operaciones",
      UTI: "com.microsoft.excel.xlsx",
    });
  } catch (error) {
    console.error("Error exportando operaciones a Excel:", error);
    throw error; // Puedes manejar este error en el componente que llama a la función
  }
};
