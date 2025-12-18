import XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Adjust path based on where I run this. 
// If run from jipijigi_web, path is ../source/
const filePath = path.join(__dirname, '../source/월 별 주요 행사 및 마케팅.xlsx');

try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    console.log("Sheet Name:", sheetName);
    console.log("Headers:", JSON.stringify(data[0], null, 2));
    console.log("First Row:", data[1]);
    console.log("Second Row:", data[2]);
} catch (error) {
    console.error("Error reading file:", error);
}
