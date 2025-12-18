import XLSX from 'xlsx';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env file");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, '../source/월 별 주요 행사 및 마케팅.xlsx');

async function importData() {
    try {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        // Read as array of arrays to handle headers manually if needed, or just json
        // The previous debug showed headers are on row 1 (0-indexed)
        const rawData = XLSX.utils.sheet_to_json(sheet);

        console.log(`Found ${rawData.length} rows in Excel.`);

        const records = rawData.map(row => {
            // Map Excel columns to DB columns
            // Excel Headers based on previous log: 
            // '월', '추천 마케팅', '추천 이벤트', '주요 행사', '목적', 
            // '물품', '외부 인력\r\n필요여부', '예상 소요 예산', '기대 수익', '기대 효과'

            // Clean keys (remove newlines if any)
            const cleanRow = {};
            Object.keys(row).forEach(key => {
                cleanRow[key.replace(/\r\n/g, ' ').trim()] = row[key];
            });

            return {
                month: parseInt(cleanRow['월']) || 0,
                marketing_title: cleanRow['추천 마케팅'] || '',
                event_title: cleanRow['추천 이벤트'] || '',
                key_events: cleanRow['주요 행사'] || '',
                purpose: cleanRow['목적'] || '',
                required_goods: cleanRow['물품'] || '',
                need_external_manpower: cleanRow['외부 인력 필요여부'] || '',
                estimated_budget: cleanRow['예상 소요 예산'] || '', // Keep as text for now as it contains text
                expected_revenue: cleanRow['기대 수익'] || '',
                expected_effect: cleanRow['기대 효과'] || ''
            };
        }).filter(r => r.month > 0); // Filter out invalid rows

        console.log(`Prepared ${records.length} valid records to insert.`);

        const { data, error } = await supabase
            .from('marketing_calendar')
            .insert(records)
            .select();

        if (error) {
            console.error('Supabase Insert Error:', error);
        } else {
            console.log(`Successfully inserted ${data.length} rows into marketing_calendar.`);
        }

    } catch (error) {
        console.error('Import Error:', error);
    }
}

importData();
