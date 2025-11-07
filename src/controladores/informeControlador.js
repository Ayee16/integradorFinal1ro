    // // src/controladores/informeControlador.js
    // import ReportesServicio from "../servicios/reportesServicio.js";
    // import InformeServicio from "../servicios/informeServicio.js";

    // const reportesServicio = new ReportesServicio();
    // const informeServicio = new InformeServicio();

    // export const generarInforme = async (req, res) => {
    // try {
    //     const { formato } = req.query;

    //     // 1️⃣ Trae los datos desde la DB
    //     const datosReporte = await reportesServicio.obtenerReporteReservas();

    //     if (!datosReporte || datosReporte.length === 0) {
    //     return res.status(404).json({
    //         estado: false,
    //         mensaje: "No hay datos para generar el informe",
    //     });
    //     }

    //     // 2️⃣ Genera CSV o PDF según el formato
    //     if (formato === "csv") {
    //     const filePath = await informeServicio.informeReservasCsv(datosReporte);
    //     return res.download(filePath);
    //     }

    //     if (formato === "pdf") {
    //     const buffer = await informeServicio.informeReservasPdf(datosReporte);
    //     res.setHeader("Content-Type", "application/pdf");
    //     res.setHeader("Content-Disposition", 'inline; filename="reservas.pdf"');
    //     return res.send(buffer);
    //     }

    //     // 3️⃣ Si llega otro formato
    //     return res.status(400).json({
    //     estado: false,
    //     mensaje: "Formato inválido. Usa formato=csv o formato=pdf",
    //     });

    // } catch (error) {
    //     console.error("Error generando informe:", error);
    //     res.status(500).json({
    //     estado: false,
    //     mensaje: "Error interno del servidor",
    //     });
    // }
    // };
import ReportesServicio from "../servicios/reportesServicio.js";
import InformeServicio from "../servicios/informeServicio.js";

const reportesServicio = new ReportesServicio();
const informeServicio = new InformeServicio();

export const generarInforme = async (req, res) => {
    console.log("✅ Entrando al controlador generarInforme...");

    try {
        const { formato } = req.query;
        console.log("🟢 Formato recibido:", formato);

        // 1️⃣ Trae los datos desde la DB
        console.log("📦 Consultando datos desde la base de datos...");
        const datosReporte = await reportesServicio.obtenerReporteReservas();
        console.log("📊 Datos obtenidos:", datosReporte);

        if (!datosReporte || datosReporte.length === 0) {
        console.warn("⚠️ No hay datos para generar el informe");
        return res.status(404).json({
            estado: false,
            mensaje: "No hay datos para generar el informe",
        });
        }

        // 2️⃣ Genera CSV o PDF según el formato
        if (formato === "csv") {
        console.log("🧾 Generando informe CSV...");
        const filePath = await informeServicio.informeReservasCsv(datosReporte);
        console.log("✅ CSV generado:", filePath);
        return res.download(filePath);
        }

        if (formato === "pdf") {
        console.log("🧾 Generando informe PDF...");
        const buffer = await informeServicio.informeReservasPdf(datosReporte);
        console.log("✅ PDF generado correctamente.");
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", 'inline; filename="reservas.pdf"');
        return res.send(buffer);
        }

        // 3️⃣ Si llega otro formato
        console.warn("⚠️ Formato inválido recibido:", formato);
        return res.status(400).json({
        estado: false,
        mensaje: "Formato inválido. Usa formato=csv o formato=pdf",
        });

    } catch (error) {
        console.error("❌ Error generando informe:", error);
        res.status(500).json({
        estado: false,
        mensaje: "Error interno del servidor",
        });
    }
};