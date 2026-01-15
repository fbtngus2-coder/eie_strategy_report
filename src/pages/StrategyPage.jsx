import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Calendar, Wallet, CheckCircle2, AlertTriangle, Save, GraduationCap, Users, Building, Activity, Megaphone, Search, School, MapPin, Settings, Sparkles, Bot, Loader2 } from 'lucide-react';
import ManagementDiagnosis from '../components/strategy/ManagementDiagnosis';
import SwotAnalysis from '../components/strategy/SwotAnalysis';
import ThreeCAnalysis from '../components/strategy/ThreeCAnalysis';
import StpStrategy from '../components/strategy/StpStrategy';
import MixStrategy from '../components/strategy/MixStrategy';
import { searchSchoolByName, getSchoolSchedule, extractKeyEvents } from '../lib/neisService';
import { getSchoolDetailedStats } from '../lib/schoolAlimiService';
import AiSettingsModal from '../components/AiSettingsModal';
import { generateMarketingStrategy, generateBudgetFeedback, generateTotalReview } from '../lib/aiService';

const SchoolAnalysisSection = ({ inputData, onSchoolSelect }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [nearbySchools, setNearbySchools] = useState([]);
    const [selectedSchool, setSelectedSchool] = useState(null);
    const [schedule, setSchedule] = useState([]);
    const [schoolStats, setSchoolStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [marketShare, setMarketShare] = useState(0);

    const handleSearch = async () => {
        if (!searchQuery) return;
        setLoading(true);
        const schools = await searchSchoolByName(searchQuery);
        setNearbySchools(schools);
        setSelectedSchool(null);
        setLoading(false);

        if (schools.length === 0) {
            alert("검색된 학교가 없습니다.\n정확한 학교 이름으로 검색해보세요.");
        }
    };

    const handleSelectSchool = async (school) => {
        setLoading(true);
        setSelectedSchool(school);

        // Notify parent value
        if (onSchoolSelect) onSchoolSelect(school);

        // 1. Fetch Advanced Stats (Alimi)
        const stats = await getSchoolDetailedStats(school.SCHUL_NM);
        setSchoolStats(stats);

        // 2. Market Share Analysis
        const myStudents = (inputData.student_info.kinder || 0) + (inputData.student_info.elem_low || 0) + (inputData.student_info.elem_high || 0) + (inputData.student_info.middle || 0);
        const total = stats.totalStudents;
        // setMarketShare(((myStudents / total) * 100).toFixed(1)); // Legacy logic removed, using Potential Analysis

        // 3. Fetch Schedule (NEIS)
        const today = new Date();
        const yyyymm = today.getFullYear().toString() + (today.getMonth() + 1).toString().padStart(2, '0');
        const events = await getSchoolSchedule(school.ATPT_OFCDC_SC_CODE, school.SD_SCHUL_CODE, yyyymm);
        setSchedule(extractKeyEvents(events));

        setLoading(false);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden print:break-inside-avoid print:border print:shadow-none mt-8">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-2 bg-green-50/50">
                <School className="text-green-600" size={24} />
                <h2 className="text-xl font-bold text-gray-800">주변 학교 탐색 및 정밀 분석</h2>
            </div>
            <div className="p-8">
                {/* Clean Search Bar */}
                <div className="flex flex-col md:flex-row gap-2 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <input
                        type="text"
                        className="w-full md:flex-1 p-4 border border-gray-300 rounded-xl text-lg font-medium shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all placeholder-gray-400"
                        placeholder="분석할 학교 이름 입력 (예: 잠실초, 대치중)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button onClick={handleSearch} disabled={loading} className="w-full md:w-auto bg-green-600 text-white px-8 py-4 md:py-0 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-sm text-lg whitespace-nowrap">
                        {loading ? '검색 중...' : '검색'}
                    </button>
                </div>

                {/* School List (Search Results) */}
                {!selectedSchool && (
                    <div className="animate-fadeIn">
                        {loading ? (
                            <div className="text-center py-10">
                                <div className="animate-spin w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full mx-auto mb-2"></div>
                                <p className="text-gray-500">주변 학교 정보를 불러오는 중입니다...</p>
                            </div>
                        ) : nearbySchools.length > 0 ? (
                            <>
                                <p className="text-sm text-gray-500 mb-3 font-medium">✨ 분석할 학교를 선택하여 상세 전략을 확인하세요.</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                                    {nearbySchools.map((school, idx) => (
                                        <button key={idx} onClick={() => handleSelectSchool(school)} className="bg-white hover:bg-green-50 text-left p-4 rounded-xl border border-gray-200 hover:border-green-500 hover:shadow-md transition-all group">
                                            <div className="flex justify-between items-start">
                                                <span className="font-bold text-gray-800 group-hover:text-green-700 text-lg">{school.SCHUL_NM}</span>
                                                <span className="bg-gray-100 text-gray-500 text-[10px] px-1.5 py-0.5 rounded group-hover:bg-green-200 group-hover:text-green-800">{school.LCTN_SC_NM}</span>
                                            </div>
                                            <div className="text-xs text-gray-400 mt-1">{school.ORG_RDNMA}</div>
                                        </button>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-8 text-gray-400">
                                <Search className="mx-auto mb-2 opacity-30" size={32} />
                                <p>검색된 학교가 없습니다.<br />주소의 '동' 이름을 확인하거나 직접 입력해보세요.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Selected School Detail Analysis */}
                {selectedSchool && schoolStats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-slideIn">
                        {/* Left: Stats & Market Share */}
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800 mb-1">{selectedSchool.SCHUL_NM} 심층 분석</h3>
                            <button onClick={() => setSelectedSchool(null)} className="text-xs text-green-600 underline mb-4 print:hidden hover:text-green-800">← 학교 목록으로 돌아가기</button>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-white p-4 rounded-xl border border-gray-200 text-center shadow-sm">
                                    <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Total Students</div>
                                    <div className="font-extrabold text-2xl text-gray-800">{schoolStats.totalStudents.toLocaleString()}</div>
                                    <div className="text-[10px] text-gray-400">전체 학생 수 (공시 기준)</div>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-gray-200 text-center shadow-sm">
                                    <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Class Size</div>
                                    <div className="font-extrabold text-2xl text-gray-800">{Math.floor(schoolStats.totalStudents / schoolStats.classes)}</div>
                                    <div className="text-[10px] text-gray-400">학급당 평균 학생 수</div>
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-2xl border border-indigo-100 shadow-sm relative overflow-hidden flex flex-col justify-center">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-50 rounded-bl-full -mr-3 -mt-3"></div>
                                <h4 className="text-sm font-bold text-indigo-800 mb-2 flex items-center gap-2 relative z-10">
                                    <Megaphone size={16} /> 학교 특징 기반 마케팅 포인트
                                </h4>
                                <p className="text-xs text-indigo-900 leading-relaxed font-medium relative z-10">
                                    "<strong>{selectedSchool.SCHUL_NM}</strong>은 학급당 <strong>{Math.floor(schoolStats.totalStudents / schoolStats.classes)}명</strong>의 학생이 재학 중입니다.<br />
                                    {Math.floor(schoolStats.totalStudents / schoolStats.classes) > 25
                                        ? "과밀 학급 경향이 있어, '꼼꼼한 1:1 개별 관리'를 강조하는 마케팅이 학부모님께 강력하게 소구될 수 있습니다."
                                        : "학생 수가 적절하여, '소수 정예 맞춤형 수업'이나 '친구와 함께하는 짝꿍 이벤트'를 제안하기 좋은 환경입니다."}
                                    <br /><br />
                                    특히 등하교 시간 학교 앞 홍보는 <strong>학원 인지도 상승</strong>에 가장 효과적인 수단임을 잊지 마세요!"
                                </p>
                            </div>
                        </div>

                        {/* Right: Schedule & Action */}
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">📅 학사 일정 기반 마케팅 적기</h3>
                            {schedule.length > 0 ? (
                                <ul className="space-y-3">
                                    {schedule.map((event, idx) => (
                                        <li key={idx} className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${event.dDay <= 7 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-green-50 text-green-600'}`}>
                                                    {event.dDay === 0 ? "D-Day" : `D-${event.dDay}`}
                                                </span>
                                                <span className="font-bold text-gray-700">{event.name}</span>
                                            </div>
                                            <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded">{event.date}</span>
                                        </li>
                                    ))}
                                    <div className="mt-6 p-4 bg-indigo-50 border border-indigo-100 text-indigo-900 text-sm rounded-xl font-medium shadow-sm relative">
                                        <div className="absolute -top-3 left-4 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">ACTION PLAN</div>
                                        {schedule[0].name.includes('졸업')
                                            ? <span className="leading-relaxed">🎓 <strong>졸업 시즌 타겟팅:</strong><br />"{selectedSchool.SCHUL_NM} 졸업생 {Math.floor(schoolStats.totalStudents / 6)}명을 잡아라!"<br />예비중등 문법 특강(3주 완성) 홍보물 배포를 시작하세요.</span>
                                            : schedule[0].name.includes('방학')
                                                ? <span className="leading-relaxed">🏖 <strong>방학 특강 홍보:</strong><br />"다음 학기 성적은 방학에 결정된다!"<br />{selectedSchool.SCHUL_NM} 방학식 날 학교 앞 배포를 진행하세요.</span>
                                                : <span className="leading-relaxed">📚 <strong>학기 중 관리:</strong><br />중간/기말고사 대비 내신 클리닉 프로그램을 문자메시지로 안내하세요.</span>}
                                    </div>
                                </ul>
                            ) : (
                                <div className="text-center text-gray-400 py-10 flex flex-col items-center">
                                    <Calendar className="mb-2 opacity-20" size={40} />
                                    <p>이번 달 예정된 주요 학사 일정이 없습니다.<br />(다음 달 일정을 확인해보세요)</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const StrategyPage = () => {
    const location = useLocation();
    const sessionId = location.state?.sessionId;
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [marketingData, setMarketingData] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const [saving, setSaving] = useState(false);

    // AI Integration States
    const [apiKey, setApiKey] = useState(localStorage.getItem('openai_api_key'));
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [aiMarketingData, setAiMarketingData] = useState(null);
    const [aiMarketingLoading, setAiMarketingLoading] = useState(false);
    const [aiBudgetFeedback, setAiBudgetFeedback] = useState(null);
    const [aiBudgetLoading, setAiBudgetLoading] = useState(false);
    const [aiTotalReview, setAiTotalReview] = useState(null);
    const [aiTotalLoading, setAiTotalLoading] = useState(false);
    const [schoolLocation, setSchoolLocation] = useState(null);

    const handleSchoolSelect = (school) => {
        // Extract Administrative Region from Road Address (ORG_RDNMA)
        // Format: "Seoul Gangnam-gu ..." -> "Seoul Gangnam-gu"
        // Format: "Gyeonggi-do Suwon-si Paldal-gu ..." -> "Gyeonggi-do Suwon-si Paldal-gu"
        const addr = school.ORG_RDNMA || '';
        const parts = addr.split(' ');
        let region = parts[0] || '';
        if (parts.length > 1) region += ' ' + parts[1];
        if (parts.length > 2 && (parts[1].endsWith('시') || parts[1].endsWith('군'))) {
            region += ' ' + parts[2];
        }
        setSchoolLocation(region);
    };

    // Budget Presets
    const MONTHLY_PRESETS = {
        // Peak: New Semester (Dec, Jan, Feb, Mar) - Aggressive Promotion
        peak: { flyerCount: 5000, manpowerCount: 4, manpowerHours: 4, aptBoardCost: 440000, giftCount: 50, snackCost: 100000 },
        // Event: Family Month, Halloween (May, Oct) - Experience & Gifts
        event: { flyerCount: 2000, manpowerCount: 2, manpowerHours: 3, aptBoardCost: 220000, giftCount: 200, snackCost: 300000 },
        // Normal: Exam Preparation, Vacation (Apr, Jun, Jul, Aug, Sep, Nov) - Maintenance
        normal: { flyerCount: 1000, manpowerCount: 1, manpowerHours: 2, aptBoardCost: 150000, giftCount: 30, snackCost: 50000 }
    };

    const handleMonthChange = (e) => {
        const m = Number(e.target.value);
        setCurrentMonth(m);

        // Auto-apply preset
        const key = [12, 1, 2, 3].includes(m) ? 'peak' : [5, 10].includes(m) ? 'event' : 'normal';
        const preset = MONTHLY_PRESETS[key];

        setSimCalcs(prev => ({
            ...prev,
            ...preset
        }));
    };

    // Editable Content States (Legacy Support)
    const [editableContent, setEditableContent] = useState({
        strengthStrategy: '',
        opportunityStrategy: '',
        hotSpotGuide: ''
    });

    // Budget Simulation State
    const [simCalcs, setSimCalcs] = useState({
        flyerCount: 4000,
        flyerCostPerUnit: 80,
        manpowerCount: 2,
        manpowerHours: 4,
        manpowerCostPerHour: 13000,
        aptBoardCost: 330000,
        giftUnitCost: 3500,
        giftCount: 50,
        snackCost: 100000,
        conversionRate: 0.5,
        tuitionFee: 280000
    });

    useEffect(() => {
        fetchData();
    }, [sessionId]);

    // Auto-run AI Total Review when data loads if API key exists
    useEffect(() => {
        if (data && apiKey && !aiTotalReview) {
            runAiTotalReview();
        }
    }, [data, apiKey]);

    // AI Analysis Functions
    const runAiMarketingAnalysis = async () => {
        if (!apiKey) {
            alert('AI 기능을 사용하려면 먼저 Gemini API 키를 설정해주세요.');
            setIsSettingsOpen(true);
            return;
        }
        setAiMarketingLoading(true);
        try {
            const location = data?.environment_analysis?.location || '지역정보 없음';
            const parentsType = data?.environment_analysis?.parentsType || '학부모 유형 정보 없음';
            const result = await generateMarketingStrategy(apiKey, currentMonth, location, parentsType);
            setAiMarketingData(result);
        } catch (err) {
            console.error('AI Marketing Error:', err);
            alert('AI 마케팅 전략 생성에 실패했습니다: ' + err.message);
        } finally {
            setAiMarketingLoading(false);
        }
    };

    const runAiBudgetAnalysis = async () => {
        if (!apiKey) {
            alert('AI 기능을 사용하려면 먼저 Gemini API 키를 설정해주세요.');
            setIsSettingsOpen(true);
            return;
        }
        setAiBudgetLoading(true);
        try {
            const budgetData = {
                flyerCount: simCalcs.flyerCount,
                manpowerCount: simCalcs.manpowerCount,
                manpowerHours: simCalcs.manpowerHours,
                aptBoardCost: simCalcs.aptBoardCost,
                giftCount: simCalcs.giftCount,
                tuitionFee: simCalcs.tuitionFee
            };
            const result = await generateBudgetFeedback(apiKey, budgetData, {});
            setAiBudgetFeedback(result);
        } catch (err) {
            console.error('AI Budget Error:', err);
            alert('AI 예산 분석 생성에 실패했습니다: ' + err.message);
        } finally {
            setAiBudgetLoading(false);
        }
    };

    const runAiTotalReview = async () => {
        if (!apiKey) return;
        setAiTotalLoading(true);
        try {
            const { student_info, instructor_info, tuition_info, competitors, our_analysis, environment_analysis, facility_info } = data;
            const totalStudents = student_info.total || ((student_info.kinder || 0) + (student_info.elem_low || 0) + (student_info.elem_high || 0) + (student_info.middle || 0));
            const rooms = facility_info?.classrooms || 0;
            const capacityPerRoom = facility_info?.maxCapacityPerRoom || 10;
            const totalCapacity = rooms * capacityPerRoom;
            const utilizationRate = totalCapacity > 0 ? (totalStudents / totalCapacity) * 100 : 0;
            const instructors = instructor_info?.total || 1;
            const ratio = totalStudents / instructors;
            const myFee = parseInt(String(tuition_info?.elementary || 0).replace(/[^0-9]/g, '')) || 0;
            let compFeeRaw = competitors?.[0]?.fee || '0';
            let compFee = parseInt(String(compFeeRaw).replace(/[^0-9]/g, ''));
            if (compFee < 1000) compFee = compFee * 10000;
            let priceStat = '적정';
            if (myFee > compFee * 1.1) priceStat = '고가(Premium)';
            else if (myFee < compFee * 0.9) priceStat = '저가(Value)';

            const metrics = { utilizationRate: utilizationRate.toFixed(1), ratio: ratio.toFixed(1), priceStat };
            const narrativeContext = {
                target: environment_analysis?.target_student || '초등 저학년',
                competitorName: competitors?.[0]?.name || '경쟁 학원',
                competitorStrength: competitors?.[0]?.strength || '강점 정보 없음'
            };
            const result = await generateTotalReview(apiKey, metrics, narrativeContext);
            setAiTotalReview(result);
        } catch (err) {
            console.error('AI Total Review Error:', err);
        } finally {
            setAiTotalLoading(false);
        }
    };

    const handleSettingsSave = (newKey) => {
        setApiKey(newKey);
        setIsSettingsOpen(false);
        // Reset AI states to trigger re-generation
        setAiTotalReview(null);
        setAiMarketingData(null);
        setAiBudgetFeedback(null);
    };

    const fetchData = async () => {
        if (!sessionId) return;
        try {
            const { data: inputData, error: inputError } = await supabase
                .from('input_data')
                .select('*')
                .eq('id', sessionId)
                .single();

            if (inputError) throw inputError;

            // Fetch All Marketing Calendar Data
            const { data: calendarData } = await supabase
                .from('marketing_calendar')
                .select('*');

            setData(inputData);
            setMarketingData(calendarData || []);

            // Initialize legacy fields
            if (inputData.our_analysis) {
                setEditableContent({
                    strengthStrategy: `경쟁사 대비 확실한 우위인 "${inputData.our_analysis.strength}"을(를) 활용하여 경쟁사(${inputData.competitors?.[0]?.name})의 약점을 공략하십시오.`,
                    opportunityStrategy: `경쟁사의 취약점인 "${inputData.competitors?.[0]?.weakness || '약점'}"을(를) 파고드는 설명회를 개최하여 이탈 수요를 흡수하세요.`,
                    hotSpotGuide: `주요 타겟인 "${inputData.environment_analysis?.parentsType}" 학부모가 모이는 ${inputData.environment_analysis?.hotSpots || '핫스팟'}을 집중 공략하세요.`
                });
            }

            // Set Tuition Fee Simulation
            if (inputData?.tuition_info?.elementary) {
                setSimCalcs(prev => ({ ...prev, tuitionFee: inputData.tuition_info.elementary }));
            } else if (inputData?.our_analysis?.fee) {
                const feeNum = parseInt(inputData.our_analysis.fee.replace(/[^0-9]/g, '')) || 280000;
                setSimCalcs(prev => ({ ...prev, tuitionFee: feeNum }));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveReport = async () => {
        setSaving(true);
        try {
            const { error } = await supabase.from('saved_reports').insert([{
                title: `${new Date().toLocaleDateString()} 전략 리포트 (${data.environment_analysis.location || '분석'})`,
                input_data_id: sessionId,
                report_data: data,
                location: schoolLocation || data.environment_analysis.location // Use parsed school location if available
            }]);
            if (error) throw error;
            alert("리포트가 보관함에 저장되었습니다!");
        } catch (e) {
            alert("저장 실패: " + e.message);
        } finally {
            setSaving(false);
        }
    };

    const calculateBudget = () => {
        const flyerCost = simCalcs.flyerCount * simCalcs.flyerCostPerUnit;
        const laborCost = simCalcs.manpowerCount * simCalcs.manpowerHours * simCalcs.manpowerCostPerHour;
        const boardCost = simCalcs.aptBoardCost;
        const giftCost = (simCalcs.giftUnitCost * simCalcs.giftCount) + simCalcs.snackCost;

        const totalCost = flyerCost + laborCost + boardCost + giftCost;

        const newStudents = Math.floor(simCalcs.flyerCount * (simCalcs.conversionRate / 100)); // Assuming flyer yield
        const revenue = newStudents * simCalcs.tuitionFee;
        const profit = revenue - totalCost;

        return { totalCost, newStudents, revenue, profit, breakdown: { flyerCost, laborCost, boardCost, giftCost } };
    };

    const results = calculateBudget();

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[500px]">
            <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium">전략 데이터를 분석하고 있습니다...</p>
        </div>
    );

    if (!sessionId || !data) return <div className="p-10 text-center text-red-500 bg-red-50 rounded-xl">데이터를 찾을 수 없습니다.</div>;

    const isV2 = data?.operation_info && Object.keys(data.operation_info).length > 0;

    const COST_LABELS = {
        1: { flyer: "신입생 전단지", manpower: "학교 앞/아파트 홍보 인력", board: "아파트 게시판 광고", gift: "입학 축하 선물" },
        2: { flyer: "신학기 브로셔", manpower: "홍보 도우미", board: "마지막 TO 모집 공고", gift: "노트/알림장 세트" },
        3: { flyer: "친구초청 티켓", manpower: "등하교 안내 스탭", board: "브랜드 홍보 포스터", gift: "웰컴 굿즈 (가방 등)" },
        4: { flyer: "내신대비 홍보물", manpower: "시험 응원단", board: "내신대비반 모집 공고", gift: "시험대비 간식/문구" },
        5: { flyer: "발표회 초대장", manpower: "행사 진행 요원", board: "영어 발표회 홍보", gift: "어린이날/행사 기념품" },
        6: { flyer: "여름방학 안내문", manpower: "학교 홍보 스탭", board: "특강 프로그램 안내", gift: "부채/얼음물" },
        7: { flyer: "썸머캠프 브로셔", manpower: "캠프 인솔/홍보", board: "방학 특강 게시", gift: "캠프 티셔츠/굿즈" },
        8: { flyer: "2학기 커리큘럼 안내", manpower: "개학 맞이 홍보", board: "2학기 원생 모집", gift: "2학기 학용품 세트" },
        9: { flyer: "설명회 초청장", manpower: "설명회 안내 스탭", board: "설명회 홍보 포스터", gift: "설명회 참석 답례품" },
        10: { flyer: "할로윈 초대장", manpower: "파티 진행 스탭", board: "할로윈 페스티벌 홍보", gift: "사탕/초콜릿 패키지" },
        11: { flyer: "예비학년 모집요강", manpower: "수능 응원단", board: "윈터스쿨 조기 모집", gift: "수능 응원 간식" },
        12: { flyer: "겨울방학 안내문", manpower: "방학식 홍보 스탭", board: "새학년 준비반 모집", gift: "핫팩/크리스마스 선물" }
    };
    const labels = COST_LABELS[currentMonth] || COST_LABELS[1];

    return (
        <div className="space-y-8 pb-20 print:p-0 print:space-y-6 text-gray-800">
            {/* Disclaimer & Header */}
            <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-4 flex items-start gap-3 shadow-sm print:hidden">
                <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={20} />
                <div>
                    <h4 className="font-bold text-amber-800 text-sm">AI 자동 생성 리포트 주의사항</h4>
                    <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                        본 리포트는 입력된 데이터를 기반으로 AI가 생성한 초안입니다.
                        <span className="font-bold underline"> 반드시 원장님의 통찰력을 더해 내용을 수정 및 보완하여 사용하시기 바랍니다.</span>
                    </p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">종합 경영/마케팅 전략 리포트</h1>
                    <p className="text-gray-500 mt-1">#{data.environment_analysis.location} #{data.environment_analysis.parentsType} 맞춤 전략</p>
                </div>
                <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
                >
                    <Settings size={18} />
                    {apiKey ? 'AI 설정 변경' : 'AI 기능 활성화'}
                </button>
            </div>

            {/* AI Settings Modal */}
            <AiSettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                onSave={handleSettingsSave}
            />

            <div className="hidden print:block text-center border-b pb-4 mb-4">
                <h1 className="text-3xl font-bold text-red-600">EiE Self-Consulting Program 전략 리포트</h1>
                <p className="text-sm text-gray-500 mt-2">{new Date().toLocaleDateString()} 생성</p>
            </div>

            {/* V2 Components */}
            {isV2 ? (
                <div className="space-y-6 animate-fadeIn">
                    <ManagementDiagnosis
                        operationInfo={data.operation_info}
                        targetAudience={data.environment_analysis?.target_student}
                    />
                    <ThreeCAnalysis
                        competitors={data.competitors}
                        ourAnalysis={data.our_analysis}
                        tuitionInfo={data.tuition_info}
                    />
                    <SwotAnalysis ourAnalysis={data.our_analysis} competitors={data.competitors} apiKey={apiKey} />
                    <StpStrategy
                        studentInfo={data.student_info}
                        parentsType={data.environment_analysis?.parentsType}
                        targetAudience={data.environment_analysis?.target_student}
                        ourAnalysis={data.our_analysis}
                        competitors={data.competitors}
                        apiKey={apiKey}
                    />
                    <MixStrategy
                        facilityInfo={data.facility_info}
                        tuitionInfo={data.tuition_info}
                        environment={data.environment_analysis}
                        targetAudience={data.environment_analysis?.target_student}
                    />
                </div>
            ) : (
                <div className="bg-red-50 p-6 rounded-xl text-center">
                    이 리포트는 구버전 데이터형식을 사용하고 있어 일부 기능이 제한됩니다.
                </div>
            )}

            {/* NEIS School Integration Section (Moved) */}
            <SchoolAnalysisSection className="mb-8" inputData={data} onSchoolSelect={handleSchoolSelect} />

            {/* Monthly Marketing Strategy - Expanded */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden print:break-inside-avoid print:border print:shadow-none mt-8">
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-indigo-50/50">
                    <div className="flex items-center gap-2">
                        <Calendar className="text-indigo-600" size={24} />
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-1">
                            <select value={currentMonth} onChange={handleMonthChange} className="bg-transparent border border-indigo-200 focus:ring-2 focus:ring-indigo-500 text-indigo-700 font-extrabold rounded-lg px-2 py-1 cursor-pointer hover:bg-white transition-colors">
                                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                    <option key={m} value={m}>{m}월</option>
                                ))}
                            </select>
                            EiE 입체 마케팅 전략
                        </h2>
                    </div>
                </div>
                <div className="p-8">
                    {(() => {
                        const strategies = [
                            { type: "설명회", title: "학부모 설명회/간담회", icon: "Users", color: "blue", desc: "신학기 대비 커리큘럼 안내 및 학습 로드맵 제시" },
                            { type: "학교앞", title: "학교 앞 아웃리치", icon: "School", color: "green", desc: "등하교 시간 학교 앞 판촉물 배포 및 이미지 노출" },
                            { type: "아파트", title: "아파트 게시판 광고", icon: "Building", color: "orange", desc: "주요 타겟 아파트 단지 내 게시판/엘리베이터 광고 집행" }
                        ];

                        // Monthly Details (Contextual)
                        const monthDetails = {
                            1: { "설명회": "예비초등 입학 전 최종 설명회 (학교생활 가이드)", "학교앞": "졸업식 시즌 학교 앞 축하 꽃/선물 배포", "아파트": "신학기 원생 모집 집중 광고 (D-30)" },
                            2: { "설명회": "새학년 대비 학습법 특강 (학부모 교실)", "학교앞": "신학기 대비 노트/알림장 배포", "아파트": "3월 개강반 마지막 TO 모집" },
                            3: { "설명회": "신학기 적응 및 내신 대비 전략 간담회", "학교앞": "새학기 학교 앞 '친구야 반가워' 캠페인", "아파트": "우리 아이 첫 영어 학원, EiE 브랜드 홍보" },
                            4: { "설명회": "중간고사 대비 분석 및 입시 전략 설명회", "학교앞": "시험 기간 응원 간식 배포 (중등부)", "아파트": "중간고사 내신 100점 대비반 모집" },
                            5: { "설명회": "가정의 달 기념 영어 발표회/공개수업", "학교앞": "어린이날 기념 풍선/캐릭터 굿즈 배포", "아파트": "영어 말하기 대회 수상작 전시 및 홍보" },
                            6: { "설명회": "여름방학 특강 프리뷰 설명회", "학교앞": "무더위 탈출 'EiE 부채/얼음물' 배포", "아파트": "여름방학 집중 몰입반 사전 예약" },
                            7: { "설명회": "여름방학 학습 관리 및 캠프 설명회", "학교앞": "방학식 날 학교 앞 집중 홍보", "아파트": "여름방학 특강 개강 안내" },
                            8: { "설명회": "2학기 대비 및 선행 학습 전략 설명회", "학교앞": "개학 맞이 학교 앞 문구 세트 배포", "아파트": "2학기 성적 향상 및 레벨업 반 모집" },
                            9: { "설명회": "2학기 내신 및 고입/대입 입시 설명회", "학교앞": "가을 운동회/축제 시즌 학교 앞 지원 사격", "아파트": "독서의 계절, 영어 원서 읽기 프로그램 홍보" },
                            10: { "설명회": "할로윈 파티 초청 및 오픈 클래스", "학교앞": "할로윈 사탕/초콜릿 배포 이벤트", "아파트": "EiE 할로윈 페스티벌 초대장 게시" },
                            11: { "설명회": "예비학년(초/중/고) 진학 로드맵 설명회", "학교앞": "수능 응원 및 예비중등 홍보물 배포", "아파트": "겨울방학 윈터스쿨 조기 등록 할인" },
                            12: { "설명회": "겨울방학 설명회 및 크리스마스 이벤트", "학교앞": "겨울방학식 핫팩/간식 배포", "아파트": "겨울방학 특강 및 새학년 대비반 모집" }
                        };

                        const details = monthDetails[currentMonth] || monthDetails[1];

                        return (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {strategies.map((s, idx) => (
                                    <div key={idx} className={`bg-white border-l-4 border-${s.color}-500 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100`}>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className={`bg-${s.color}-100 text-${s.color}-700 text-xs font-bold px-2 py-1 rounded`}>{s.title}</span>
                                            {s.type === '설명회' && <Users size={18} className="text-gray-400" />}
                                            {s.type === '학교앞' && <School size={18} className="text-gray-400" />}
                                            {s.type === '아파트' && <Building size={18} className="text-gray-400" />}
                                        </div>
                                        <h4 className="font-bold text-gray-800 text-lg mb-2 leading-tight">{details[s.type]}</h4>
                                        <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                                    </div>
                                ))}
                            </div>
                        );
                    })()}
                </div>
            </div>


            {/* Simulation - Expanded */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden print:break-inside-avoid print:border print:shadow-none mt-8">
                <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
                    <Wallet className="text-amber-600" size={24} />
                    <h2 className="text-xl font-bold text-gray-800">예산 및 수익 시뮬레이션 (상세)</h2>
                </div>
                <div className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Cost Inputs */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-extrabold text-gray-500 uppercase tracking-widest border-b pb-2 mb-4">지출 계획 (Cost Plan)</h3>

                            {/* 1. Flyer */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-600 mb-1 block">{labels.flyer} 수량</label>
                                    <div className="relative">
                                        <input type="number" className="w-full p-2 pr-10 border rounded-lg font-bold" value={simCalcs.flyerCount} onChange={(e) => setSimCalcs({ ...simCalcs, flyerCount: Number(e.target.value) })} />
                                        <span className="absolute right-3 top-2.5 text-xs text-gray-400">장</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-600 mb-1 block">장당 단가</label>
                                    <div className="relative">
                                        <input type="number" className="w-full p-2 pr-14 border rounded-lg text-right" value={simCalcs.flyerCostPerUnit} onChange={(e) => setSimCalcs({ ...simCalcs, flyerCostPerUnit: Number(e.target.value) })} />
                                        <span className="absolute right-8 top-2.5 text-xs text-gray-400">원</span>
                                    </div>
                                </div>
                            </div>

                            {/* 2. Manpower */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-gray-600 mb-1 block">{labels.manpower}</label>
                                    <div className="relative">
                                        <input type="number" className="w-full p-2 pr-10 border rounded-lg font-bold" value={simCalcs.manpowerCount} onChange={(e) => setSimCalcs({ ...simCalcs, manpowerCount: Number(e.target.value) })} />
                                        <span className="absolute right-3 top-2.5 text-xs text-gray-400">명</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-600 mb-1 block">투입 시간</label>
                                    <input type="number" className="w-full p-2 border rounded-lg" value={simCalcs.manpowerHours} onChange={(e) => setSimCalcs({ ...simCalcs, manpowerHours: Number(e.target.value) })} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-600 mb-1 block">시급</label>
                                    <input type="number" className="w-full p-2 border rounded-lg text-right" value={simCalcs.manpowerCostPerHour} onChange={(e) => setSimCalcs({ ...simCalcs, manpowerCostPerHour: Number(e.target.value) })} />
                                </div>
                            </div>

                            {/* 3. Apt Board */}
                            <div>
                                <label className="text-xs font-bold text-gray-600 mb-1 block">{labels.board} (월/주)</label>
                                <div className="relative">
                                    <input type="number" className="w-full p-2 pr-14 border rounded-lg text-right font-bold" value={simCalcs.aptBoardCost} onChange={(e) => setSimCalcs({ ...simCalcs, aptBoardCost: Number(e.target.value) })} />
                                    <span className="absolute right-8 top-2.5 text-xs text-gray-400">원</span>
                                </div>
                            </div>

                            {/* 4. Gift & Snack */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-gray-600 mb-1 block">{labels.gift} 단가</label>
                                    <input type="number" className="w-full p-2 border rounded-lg text-right" value={simCalcs.giftUnitCost} onChange={(e) => setSimCalcs({ ...simCalcs, giftUnitCost: Number(e.target.value) })} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-600 mb-1 block">선물 수량</label>
                                    <input type="number" className="w-full p-2 border rounded-lg" value={simCalcs.giftCount} onChange={(e) => setSimCalcs({ ...simCalcs, giftCount: Number(e.target.value) })} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-600 mb-1 block">음료/다과비</label>
                                    <input type="number" className="w-full p-2 border rounded-lg text-right" value={simCalcs.snackCost} onChange={(e) => setSimCalcs({ ...simCalcs, snackCost: Number(e.target.value) })} />
                                </div>
                            </div>
                        </div>

                        {/* Results */}
                        <div className="flex flex-col justify-center space-y-4">
                            <h3 className="text-sm font-extrabold text-gray-500 uppercase tracking-widest border-b pb-2 mb-4">예상 결과 (Result)</h3>

                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                                <div className="flex justify-between items-end mb-4">
                                    <span className="font-bold text-gray-600">총 지출 (Total Cost)</span>
                                    <span className="text-3xl font-extrabold text-gray-900">{results.totalCost.toLocaleString()}원</span>
                                </div>
                                <div className="space-y-1 text-xs text-gray-500 text-right">
                                    <p>전단지: {results.breakdown.flyerCost.toLocaleString()}원</p>
                                    <p>인건비: {results.breakdown.laborCost.toLocaleString()}원</p>
                                    <p>게시판: {results.breakdown.boardCost.toLocaleString()}원</p>
                                    <p>선물/다과: {results.breakdown.giftCost.toLocaleString()}원</p>
                                </div>
                            </div>

                            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200">
                                <span className="font-bold text-amber-700 block mb-2">월 예상 추가 매출 (Monthly Recurring Revenue)</span>
                                <div className="flex justify-between items-end">
                                    <div className="text-sm text-amber-600">
                                        신규 {results.newStudents}명 x {simCalcs.tuitionFee.toLocaleString()}원
                                    </div>
                                    <div className="text-right">
                                        <span className="text-3xl font-extrabold text-amber-600">{results.revenue.toLocaleString()}원</span>
                                        <span className="text-[10px] text-amber-500 block mt-1">* 지출은 1회성 투자 비용</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Comprehensive Strategy - ENHANCED */}
            {isV2 && (
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-10 text-white shadow-2xl print:break-before-page mt-12">
                    <h2 className="text-3xl font-extrabold mb-10 flex items-center gap-3 text-yellow-400">
                        <CheckCircle2 size={32} color="#facc15" /> AI 종합 성장 전략 (Growth Roadmap)
                    </h2>

                    {(() => {
                        // --- Logic Block ---
                        const { student_info, instructor_info, tuition_info, competitors, our_analysis, environment_analysis, facility_info, operation_info } = data;

                        // 1. Efficiency Analysis
                        const totalStudents = student_info.total || ((student_info.kinder || 0) + (student_info.elem_low || 0) + (student_info.elem_high || 0) + (student_info.middle || 0));
                        const rooms = facility_info?.classrooms || 0;
                        const capacityPerRoom = facility_info?.maxCapacityPerRoom || 10;
                        const totalCapacity = rooms * capacityPerRoom;
                        const utilizationRate = totalCapacity > 0 ? (totalStudents / totalCapacity) * 100 : 0;

                        let effStatus = "여유";
                        let effAdvice = "강의실 가동률이 여유롭습니다. 공격적인 신규 모집이 필요합니다.";
                        if (utilizationRate > 80) {
                            effStatus = "포화 임박";
                            effAdvice = "강의실 가동률이 높습니다. 대기자 명단을 운영하거나 분반 확장, 혹은 수강료 인상을 통한 수익성 강화를 고려할 시점입니다.";
                        }

                        // 2. Instructor Ratio
                        const instructors = instructor_info?.total || 1;
                        const ratio = totalStudents / instructors;

                        // 3. Price Analysis
                        const myFee = parseInt(String(tuition_info?.elementary || 0).replace(/[^0-9]/g, '')) || 0;
                        let compFeeRaw = competitors?.[0]?.fee || '0';
                        let compFee = parseInt(String(compFeeRaw).replace(/[^0-9]/g, ''));
                        if (compFee < 1000) compFee = compFee * 10000; // Handle '32' case

                        let priceStat = "적정";
                        if (myFee > compFee * 1.1) priceStat = "고가(Premium)";
                        else if (myFee < compFee * 0.9) priceStat = "저가(Value)";

                        // 4. Branding & Product (Requested by User)
                        const brandMsg = "EiE 고려대학교 영어교육 프로그램은 단순한 프랜차이즈가 아닙니다. 학부모들에게 '대학이 만든 검증된 교육'이라는 강력한 신뢰 자산(Brand Trust)을 전달합니다. 이를 통해 신생 학원이나 개인 교습소가 줄 수 없는 '교육의 권위'를 마케팅 핵심 포인트로 삼아야 합니다.";

                        return (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                {/* Left Column: Current Status Synthesis */}
                                <div className="space-y-8">
                                    <div className="bg-white/10 p-8 rounded-2xl border border-white/10">
                                        <h3 className="text-2xl font-bold text-blue-300 mb-6 flex items-center gap-2"><Activity /> 운영 효율성 진단</h3>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center border-b border-white/10 pb-2">
                                                <span className="text-gray-300 text-lg">강의실 가동률</span>
                                                <span className="text-xl font-bold">{utilizationRate.toFixed(1)}% <span className={`text-sm ml-2 ${utilizationRate > 80 ? 'text-red-400' : 'text-green-400'}`}>({effStatus})</span></span>
                                            </div>
                                            <div className="flex justify-between items-center border-b border-white/10 pb-2">
                                                <span className="text-gray-300 text-lg">강사 1인당 학생</span>
                                                <span className="text-xl font-bold">{ratio.toFixed(1)}명</span>
                                            </div>
                                            <p className="text-gray-200 mt-4 leading-relaxed text-lg">{effAdvice}</p>
                                        </div>
                                    </div>

                                    <div className="bg-white/10 p-8 rounded-2xl border border-white/10">
                                        <h3 className="text-2xl font-bold text-yellow-300 mb-6 flex items-center gap-2"><Megaphone /> 4P Marketing Mix 제언</h3>
                                        <ul className="space-y-6">
                                            <li className="flex gap-4">
                                                <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded text-sm font-bold h-fit mt-1 shrink-0">PRODUCT</span>
                                                <p className="text-gray-200 leading-relaxed text-lg">{brandMsg}</p>
                                            </li>
                                            <li className="flex gap-4">
                                                <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded text-sm font-bold h-fit mt-1 shrink-0">PRICE</span>
                                                <p className="text-gray-200 leading-relaxed text-lg">
                                                    경쟁사({competitors?.[0]?.name}) 대비 {priceStat} 포지션입니다.
                                                    {priceStat.includes("고가")
                                                        ? " 높은 수강료에 대한 심리적 저항을 줄이기 위해 '개별 맞춤 관리 리포트'와 '프리미엄 시설'을 강조하십시오."
                                                        : " 합리적인 가격경쟁력을 활용하되, '싼 게 비지떡'이라는 인식을 주지 않도록 '가성비 최고의 아웃풋'을 강조하십시오."}
                                                </p>
                                            </li>
                                            <li className="flex gap-4">
                                                <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded text-sm font-bold h-fit mt-1 shrink-0">PLACE</span>
                                                <p className="text-gray-200 leading-relaxed text-lg">
                                                    {environment_analysis?.location}의 입지 특성을 고려했을 때,
                                                    {environment_analysis?.parentsType?.includes("입시")
                                                        ? " 학구열이 높은 학부모를 타겟으로 '차량 운행 범위 확대'보다 '학원 내 면학 분위기 조성'에 집중하십시오."
                                                        : " 접근성을 강조하며 '안전한 등하원'과 '학교 앞 픽업 서비스'를 적극 홍보하십시오."}
                                                </p>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Right Column: Strategic Narrative */}
                                <div className="bg-indigo-900/40 border-2 border-indigo-400/30 p-8 rounded-2xl flex flex-col h-full">
                                    <h3 className="text-2xl font-bold text-indigo-300 mb-6">🚀 원장님을 위한 1:1 총평</h3>

                                    <div className="prose prose-lg prose-invert text-gray-100 space-y-6">
                                        <p>
                                            원장님, 우리 학원은 <strong>{environment_analysis?.parentsType}</strong> 성향의 학부모가 많은
                                            <strong> {environment_analysis?.location}</strong> 상권에 위치해 있습니다.
                                            현재 경쟁사인 <strong>{competitors?.[0]?.name}</strong>은 <strong>"{competitors?.[0]?.strength}"</strong>를 강점으로 내세우고 있지만,
                                            동시에 <strong>"{competitors?.[0]?.weakness}"</strong>라는 결정적인 약점을 가지고 있습니다.
                                        </p>

                                        <p>
                                            우리는 <strong>"{our_analysis?.strength}"</strong>라는 강력한 무기를 통해 이 빈틈을 파고들어야 합니다.
                                            특히 <strong>1분기/새학기(1~3월)</strong>에는 신규 유입이 가장 많은 시기이므로,
                                            상단에 추천드린 마케팅 액션플랜을 즉시 실행에 옮기시기 바랍니다.
                                        </p>

                                        <p>
                                            현재 자원 현황을 볼 때 (강의실 수 {rooms}개, 강사 {instructors}명),
                                            {utilizationRate > 70
                                                ? " 하드웨어적 자원이 포화 상태에 가까워지고 있습니다. 이제는 양적 성장보다 '수익성 위주'의 질적 성장을 도모할 때입니다."
                                                : " 아직 성장 잠재력이 충분합니다. 운영 효율을 극대화하기 위해 공격적인 원생 모집에 모든 역량을 집중하십시오."}
                                        </p>

                                        <div className="mt-8 pt-8 border-t border-white/10">
                                            <p className="text-xl font-bold text-white">
                                                "승리는 준비된 자에게 찾아옵니다. EiE의 브랜드 파워와 원장님의 실행력이 만나면, 지역 1등 학원은 반드시 달성 가능한 목표입니다."
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}
                </div>
            )}
            {/* Save Button (Bottom) */}
            <div className="mt-12 text-center pb-10">
                <button onClick={handleSaveReport} disabled={saving} className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white text-lg rounded-xl hover:bg-indigo-700 font-bold shadow-lg transition-transform hover:scale-105 animate-bounce-subtle">
                    <Save size={24} />
                    {saving ? '저장 중...' : '전략 리포트 보관함에 저장하기'}
                </button>
                <p className="text-gray-400 mt-4 text-sm">
                    * 위에서 분석한 학교 정보와 마케팅 전략이 모두 함께 저장됩니다.
                </p>
            </div>
        </div>
    );
};

export default StrategyPage;
