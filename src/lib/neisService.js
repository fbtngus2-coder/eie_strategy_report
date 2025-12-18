
const NEIS_KEY = 'c5af302405954d3f92fd211f5a441293';
const BASE_URL = 'https://open.neis.go.kr/hub';

// Mapping Region Name to Office Code (Optional, but usually we search by LCTN_SC_NM)
// We will use LCTN_SC_NM directly as it is standard (e.g. '서울특별시', '경기도')

/**
 * Search Schools by Region and Keyword (Address/Name)
 * - Fetches ALL Elementary/Middle schools in the specified region.
 * - Filters result where Name OR Address contains the keyword.
 * - Excludes High Schools.
 * 
 * @param {string} region - "서울특별시", "경기도", etc.
 * @param {string} keyword - "잠실", "잠원동", etc.
 */
/**
 * Search Schools by Name (Simple)
 * - Excludes High Schools.
 */
export const searchSchoolByName = async (query) => {
    try {
        const url = `${BASE_URL}/schoolInfo?KEY=${NEIS_KEY}&Type=json&pIndex=1&pSize=100&SCHUL_NM=${encodeURIComponent(query)}`;
        const response = await fetch(url);
        const data = await response.json();

        const schools = data.schoolInfo?.[1]?.row || [];

        // Filter out High Schools and Special Schools
        return schools.filter(s =>
            s.SCHUL_KND_SC_NM !== '고등학교' &&
            s.SCHUL_KND_SC_NM !== '특수학교' &&
            s.SCHUL_KND_SC_NM !== '고등기술학교'
        );
    } catch (error) {
        console.error("NEIS Search Error:", error);
        return [];
    }
};

export const getSchoolSchedule = async (officeCode, schoolCode, yyyymm) => {
    try {
        const url = `${BASE_URL}/SchoolSchedule?KEY=${NEIS_KEY}&Type=json&pIndex=1&pSize=100&ATPT_OFCDC_SC_CODE=${officeCode}&SD_SCHUL_CODE=${schoolCode}&AA_YMD=${yyyymm}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.SchoolSchedule && data.SchoolSchedule[1] && data.SchoolSchedule[1].row) {
            return data.SchoolSchedule[1].row;
        }
        return [];
    } catch (error) {
        console.error("NEIS Schedule Error:", error);
        return [];
    }
};

export const extractKeyEvents = (scheduleList) => {
    const keyKeywords = ['졸업', '방학', '입학', '소집', '개학', '종업'];

    // 1. Filter
    const filtered = scheduleList.filter(event =>
        keyKeywords.some(keyword => event.EVENT_NM.includes(keyword))
    );

    // 2. Map
    const mapped = filtered.map(event => ({
        date: event.AA_YMD,
        name: event.EVENT_NM,
        dDay: Math.ceil((new Date(event.AA_YMD.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')) - new Date()) / (1000 * 60 * 60 * 24))
    }));

    // 3. Deduplicate (Keep earliest)
    const uniqueEvents = Object.values(mapped.reduce((acc, current) => {
        if (!acc[current.name] || current.dDay < acc[current.name].dDay) {
            acc[current.name] = current;
        }
        return acc;
    }, {}));

    // 4. Sort
    return uniqueEvents.sort((a, b) => a.dDay - b.dDay);
};
