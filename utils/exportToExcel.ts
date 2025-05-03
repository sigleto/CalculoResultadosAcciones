import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import XLSX from "xlsx";

type Venta = {
  empresa: string;
  fecha: string;
  accionesVendidas: number;
  ingreso: number;
  precioMedioCompra: string;
  beneficio: string;
};

export const exportVentasToExcel = async (ventas: Venta[]) => {
  try {
    const worksheet = XLSX.utils.json_to_sheet(ventas);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Resultados");

    const binaryExcel = XLSX.write(workbook, {
      type: "base64",
      bookType: "xlsx",
    });

    const fileUri = FileSystem.documentDirectory + "resultados.xlsx";

    await FileSystem.writeAsStringAsync(fileUri, binaryExcel, {
      encoding: FileSystem.EncodingType.Base64,
    });

    await Sharing.shareAsync(fileUri, {
      mimeType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      dialogTitle: "Exportar resultados",
      UTI: "com.microsoft.excel.xlsx",
    });
  } catch (error) {
    console.error("Error exportando Excel:", error);
  }
};
