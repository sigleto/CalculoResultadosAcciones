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
  costoVenta: number;
  accionesDisponiblesPostVenta: number;
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

    const filePath = FileSystem.cacheDirectory + "ventas_resultados.xlsx";

    await FileSystem.writeAsStringAsync(filePath, binaryExcel, {
      encoding: FileSystem.EncodingType.Base64,
    });

    if (!(await Sharing.isAvailableAsync())) {
      throw new Error(
        "El sistema de compartir no está disponible en este dispositivo."
      );
    }

    await Sharing.shareAsync(filePath, {
      mimeType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      dialogTitle: "Compartir archivo Excel",
      UTI: "com.microsoft.excel.xlsx",
    });
  } catch (error) {
    console.error("Error exportando a Excel:", error);
  }
};
