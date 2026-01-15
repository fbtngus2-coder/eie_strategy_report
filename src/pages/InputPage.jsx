import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Save, ChevronRight, ChevronLeft, Plus, Trash2, Check, Target, MapPin, Sparkles } from 'lucide-react';
import AcademyDetailForm from '../components/input/AcademyDetailForm';

const InputPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const scrollContainer = document.getElementById('scroll-container');
        if (scrollContainer) {
            scrollContainer.scrollTo(0, 0);
        } else {
            window.scrollTo(0, 0);
        }
    }, [step]);


    // Initial Empty State
    const [formData, setFormData] = useState({
        // V2 Fields
        operation_info: { isDirectorTeaching: false, hasCounselor: false, hasAdmin: false, useAnnualLeave: false, useInsurance: false },
        facility_info: { classrooms: 0, hasLab: false, shuttles: 0, hasHelper: false, nativeTeacher: false, maxCapacityPerRoom: 0, dailyClassCount: 6 },
        instructor_info: { total: 0 },
        student_info: { kinder: 0, elem_low: 0, elem_high: 0, middle: 0, high: 0 },
        tuition_info: { phonics: 0, elementary: 0, middle: 0, high: 0, isSeparateFee: false },

        // Legacy Fields
        targets: [],
        competitors: [
            { name: '', fee: '', strength: '', weakness: '', marketing: '' }
        ],
        myAcademy: {
            strength: '',
            weakness: '',
            fee: ''
        },
        environment: {
            location: '',
            parentsType: '', // '입시 중심', '영어 흥미/스피킹', '보육/관리', '가성비'
            flowPath: '',
            hotSpots: ''
        }
    });

    const handleTargetChange = (target) => {
        setFormData(prev => ({
            ...prev,
            targets: prev.targets.includes(target)
                ? prev.targets.filter(t => t !== target)
                : [...prev.targets, target]
        }));
    };

    const handleCompetitorChange = (index, field, value) => {
        const newCompetitors = [...formData.competitors];
        newCompetitors[index][field] = value;
        setFormData({ ...formData, competitors: newCompetitors });
    };

    const addCompetitor = () => {
        setFormData({
            ...formData,
            competitors: [...formData.competitors, { name: '', fee: '', strength: '', weakness: '', marketing: '' }]
        });
    };

    const removeCompetitor = (index) => {
        const newCompetitors = formData.competitors.filter((_, i) => i !== index);
        setFormData({ ...formData, competitors: newCompetitors });
    };

    const calculateTotalStudents = () => {
        const s = formData.student_info;
        return (s.kinder || 0) + (s.elem_low || 0) + (s.elem_high || 0) + (s.middle || 0) + (s.high || 0);
    };

    // --- AUTO FILL LOGIC (SCENARIO BASED) ---
    const SCENARIOS = [
        {
            name: "🔥 치열한 학군지 (대치/목동 스타일)",
            targets: ['초등 고학년', '중등부'],
            environment: {
                location: "대단지 아파트 정문 건너편 메인 상가 3층 (학원 밀집 지역)",
                parentsType: "입시 중심",
            },
            competitors: [
                {
                    name: '최상위 S어학원',
                    fee: '450000',
                    strength: '전국 100호점 이상의 대형 프랜차이즈 브랜드 파워를 보유하고 있으며, 7단계의 세분화된 레벨링 시스템과 100% 원어민 회화 수업을 강점으로 내세움',
                    weakness: '학생 수가 너무 많아 개별 케어가 전혀 이루어지지 않으며, 숙제 검사나 단어 시험 결과에 대한 학부모 피드백이 매우 늦어 불만이 누적됨',
                    marketing: '지역 맘카페 바이럴 마케팅 및 아파트 엘리베이터 영상 광고'
                },
                {
                    name: '하이엔드 영어',
                    fee: '520000',
                    strength: '철저한 내신 관리와 특목고 진학 실적(작년 과학고 3명 배출)을 적극 홍보하며, 상위권 학생 대상의 심화 문법/독해 수업이 강력함',
                    weakness: '수강료가 지역 평균 대비 20만원 이상 비싸고, 숙제 양이 과도하게 많아 중하위권 학생들이 적응하지 못하고 중도 포기하는 비율이 높음',
                    marketing: '대형 입시 설명회 개최 및 재원생 지인 소개 이벤트'
                }
            ],
            myAcademy: {
                operation_info: { isDirectorTeaching: true, hasCounselor: true, hasAdmin: true, useAnnualLeave: true, useInsurance: true },
                facility_info: { classrooms: 8, hasLab: true, shuttles: 0, hasHelper: false, nativeTeacher: false, maxCapacityPerRoom: 10, dailyClassCount: 7 },
                instructor_info: { total: 5 },
                student_info: { kinder: 0, elem_low: 10, elem_high: 60, middle: 80, high: 20 },
                tuition_info: { phonics: 0, elementary: 350000, middle: 420000, high: 500000, isSeparateFee: true },
                strength: "원장 직강의 '담임제 풀케어' 시스템으로 대형 학원이 놓치는 꼼꼼한 관리와 1:1 학습 피드백 제공",
                weakness: "대형 브랜드 대비 인지도가 부족하고 차량 운행을 하지 않아 원거리 학생 등원이 힘듦",
                fee: ''
            }
        },
        {
            name: "🏢 신도시/택지지구 (동탄/광교 스타일)",
            targets: ['유치부', '초등 저학년'],
            environment: {
                location: "초등학교 정문 맞은편 단독 상가 2층 (도보 통학 용이)",
                parentsType: "보육/관리",
            },
            competitors: [
                {
                    name: '펀펀 잉글리시',
                    fee: '280000',
                    strength: '넓은 체육관과 요리 실습실을 갖추고 있어, 영어를 놀이와 액티비티로 접근하여 저학년 아이들이 거부감 없이 즐겁게 다닐 수 있음',
                    weakness: '흥미 위주의 수업으로 인해 학습 아웃풋(파닉스 완성, 문장 발화)이 부족하고, 초등 3학년 이상이 되면 학습식 학원으로 이동하는 현상이 발생함',
                    marketing: '학교 앞 문구점 제휴 및 등하교 시간 판촉물 배포'
                },
                {
                    name: '튼튼 공부방',
                    fee: '200000',
                    strength: '아파트 단지 내 가정집에서 운영하여 이동 동선이 매우 안전하고, 시간 조율이 유연하여 맞벌이 학부모의 선호도가 높음',
                    weakness: '비전문적인 강사(아르바이트 대학생) 채용이 잦고, 교육 시설이 협소하며 체계적인 커리큘럼이 없어 고학년으로 갈수록 한계가 명확함',
                    marketing: '아파트 단지 게시판 전단지 직투'
                }
            ],
            myAcademy: {
                operation_info: { isDirectorTeaching: true, hasCounselor: false, hasAdmin: true, useAnnualLeave: true, useInsurance: true },
                facility_info: { classrooms: 6, hasLab: true, shuttles: 1, hasHelper: true, nativeTeacher: false, maxCapacityPerRoom: 8, dailyClassCount: 6 },
                instructor_info: { total: 3 },
                student_info: { kinder: 20, elem_low: 60, elem_high: 30, middle: 10, high: 0 },
                tuition_info: { phonics: 280000, elementary: 300000, middle: 350000, high: 0, isSeparateFee: true },
                strength: "매일 학습 결과를 학부모에게 카톡으로 전송하는 '데일리 리포트'와 안전한 등하원 차량 운행",
                weakness: "초등 고학년으로 올라갈수록 입시 전문 학원으로 이탈하는 경향이 있음",
                fee: ''
            }
        },
        {
            name: "🏠 일반 주거 지역 (가성비 중심)",
            targets: ['초등 저학년', '초등 고학년'],
            environment: {
                location: "구축 아파트 단지 내 상가 2층 (주변에 교습소 많음)",
                parentsType: "가성비",
            },
            competitors: [
                {
                    name: '스마트 해법영어',
                    fee: '220000',
                    strength: '매일 50분씩 주 5회 수업을 제공하면서도 수강료가 매우 저렴하며, 태블릿 PC를 활용한 자기주도 학습 시스템이 잘 갖춰져 있음',
                    weakness: '원장 1인이 수업과 상담, 차량 운행까지 모두 담당하여 관리가 매우 허술하고, 강사 전문성이 부족하여 심화 학습이 불가능함',
                    marketing: '아파트 입구 게시판 및 상가 1층 배너 광고'
                },
                {
                    name: '제임스 영어교습소',
                    fee: '250000',
                    strength: '최대 4명의 소수 정예 그룹 과외식 수업을 진행하여 꼼꼼한 문법 지도와 개별 첨삭 지도가 가능함',
                    weakness: '상가 건물이 매우 노후되어 화장실 등 시설 환경이 열악하고, 온라인 학습 프로그램이나 체계적인 레벨 테스트 시스템이 전무함',
                    marketing: '지역 생활정보지 및 아파트 외벽 현수막 광고'
                }
            ],
            myAcademy: {
                operation_info: { isDirectorTeaching: true, hasCounselor: false, hasAdmin: false, useAnnualLeave: false, useInsurance: true },
                facility_info: { classrooms: 4, hasLab: true, shuttles: 0, hasHelper: false, nativeTeacher: false, maxCapacityPerRoom: 6, dailyClassCount: 5 },
                instructor_info: { total: 2 },
                student_info: { kinder: 0, elem_low: 40, elem_high: 40, middle: 20, high: 0 },
                tuition_info: { phonics: 240000, elementary: 260000, middle: 300000, high: 0, isSeparateFee: false },
                strength: "합리적인 수강료로 매일 50분씩, 파닉스부터 문법까지 확실하게 잡아주는 '가성비 끝판왕' 커리큘럼",
                weakness: "차량 운행 불가 및 노후된 상가 건물로 인한 이미지 저하",
                fee: ''
            }
        }
    ];

    const handleAutoFill = () => {
        // Randomly select one scenario
        const scenario = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
        console.log("Selected Scenario:", scenario.name);

        if (step === 1) {
            setFormData(prev => ({
                ...prev,
                targets: scenario.targets,
                environment: {
                    ...prev.environment,
                    ...scenario.environment
                }
            }));
        } else if (step === 2) {
            setFormData(prev => ({
                ...prev,
                competitors: scenario.competitors
            }));
        } else if (step === 3) {
            setFormData(prev => ({
                ...prev,
                operation_info: scenario.myAcademy.operation_info,
                facility_info: scenario.myAcademy.facility_info,
                instructor_info: scenario.myAcademy.instructor_info,
                student_info: scenario.myAcademy.student_info,
                tuition_info: scenario.myAcademy.tuition_info,
                myAcademy: {
                    ...prev.myAcademy,
                    strength: scenario.myAcademy.strength,
                    weakness: scenario.myAcademy.weakness,
                    fee: ''
                }
            }));
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const formDataToSave = {
                ...formData,
                student_info: { ...formData.student_info, total: calculateTotalStudents() }
            };

            const payload = {
                target_audience: formDataToSave.targets,
                competitors: formDataToSave.competitors,
                our_analysis: formDataToSave.myAcademy,
                environment_analysis: formDataToSave.environment,
                operation_info: formDataToSave.operation_info,
                facility_info: formDataToSave.facility_info,
                instructor_info: formDataToSave.instructor_info,
                student_info: formDataToSave.student_info,
                tuition_info: formDataToSave.tuition_info,
                created_at: new Date()
            };

            const { data, error } = await supabase.from('input_data').insert([payload]).select();
            if (error) throw error;
            navigate('/strategy', { state: { sessionId: data[0].id } });
        } catch (error) {
            console.error('Data Save Error:', error);
            alert(`데이터 저장 실패!\n${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Validation
    const isStepValid = () => {
        if (step === 1) {
            if (formData.targets.length === 0) return false;
            if (!formData.environment.location.trim()) return false;
            if (!formData.environment.parentsType) return false;
            return true;
        }
        if (step === 2) {
            return formData.competitors.every(c => c.name.trim() !== '' && c.fee.trim() !== '');
        }
        if (step === 3) {
            if (!formData.myAcademy.strength.trim()) return false;
            if (!formData.myAcademy.weakness.trim()) return false;
            return true;
        }
        return true;
    };

    const getTargetContextString = () => {
        if (formData.targets.length === 0) return "선택된 타겟";
        return formData.targets.join(', ');
    };

    const steps = [
        { title: '시장/환경', subtitle: 'Step 1' },
        { title: '경쟁사', subtitle: 'Step 2' },
        { title: '자사 분석', subtitle: 'Step 3' },
    ];

    return (
        <div className="max-w-5xl mx-auto pb-20">
            {/* Header */}
            <div className="mb-10 text-center relative">
                <h2 className="text-2xl font-bold text-gray-900">데이터 입력</h2>
                <p className="text-gray-500 mt-2">
                    <span className="font-bold text-red-600">Step 1에서 타겟을 먼저 설정</span>하면, 이후 질문들이 해당 타겟에 맞춰 최적화됩니다.
                </p>

                {/* Auto Fill Button */}
                <button
                    onClick={handleAutoFill}
                    className="absolute right-0 top-0 flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-bold hover:bg-indigo-100 transition-colors"
                >
                    <Sparkles size={16} /> 자동 입력 (테스트용)
                </button>
            </div>

            {/* Progress Bar */}
            <div className="flex justify-between items-center mb-12 max-w-3xl mx-auto px-4">
                {steps.map((s, i) => (
                    <div key={i} className="flex flex-col items-center relative z-10 w-24">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-4 ${step > i + 1 ? 'bg-red-600 border-red-600 text-white' :
                            step === i + 1 ? 'bg-white border-red-600 text-red-600 shadow-md scale-110' :
                                'bg-gray-100 border-gray-200 text-gray-400'
                            }`}>
                            {step > i + 1 ? <Check size={18} /> : i + 1}
                        </div>
                        <div className={`mt-3 text-xs font-semibold uppercase tracking-wider ${step === i + 1 ? 'text-red-600' : 'text-gray-400'}`}>
                            {s.title}
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 sm:p-10 min-h-[500px]">

                {/* Step 1: Market & Environment */}
                {step === 1 && (
                    <div className="animate-slideIn">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <span className="w-1 h-6 bg-red-600 rounded-full"></span>
                            시장 및 환경 분석
                        </h2>

                        <div className="mb-10 p-6 bg-red-50/50 rounded-2xl border border-red-100">
                            <h4 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                                <Target size={20} className="text-red-600" /> 1. 주요 공략 타겟 설정 <span className="text-xs text-red-500 font-normal">* 필수 (먼저 선택하세요)</span>
                            </h4>
                            <p className="text-sm text-gray-600 mb-4">가장 집중하고 있는 연령대를 선택해주세요. 이 선택에 따라 이후 분석의 기준이 결정됩니다.</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {['유치부', '초등 저학년', '초등 고학년', '중등부'].map((target) => (
                                    <div
                                        key={target}
                                        onClick={() => handleTargetChange(target)}
                                        className={`
                                            relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md select-none
                                            ${formData.targets.includes(target) ? 'border-red-500 bg-white shadow-sm ring-1 ring-red-200' : 'border-gray-200 bg-white text-gray-500 hover:border-red-200'}
                                        `}
                                    >
                                        <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-colors ${formData.targets.includes(target) ? 'border-red-500' : 'border-gray-300'}`}>
                                            {formData.targets.includes(target) && <div className="w-2.5 h-2.5 bg-red-500 rounded-full" />}
                                        </div>
                                        <span className={`font-bold ${formData.targets.includes(target) ? 'text-red-700' : 'text-gray-500'}`}>{target}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={`transition-all duration-500 ${formData.targets.length > 0 ? 'opacity-100' : 'opacity-40 blur-[1px] pointer-events-none'}`}>
                            <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <MapPin size={20} className="text-gray-600" /> 2. 환경 및 입지 특성
                            </h4>
                            <p className="text-sm text-blue-600 mb-4 font-medium bg-blue-50 inline-block px-3 py-1 rounded-lg">
                                💡 Tip: <span className="underline">{getTargetContextString()}</span> 학부모님들이 주로 거주하거나 이동하는 동선을 고려해 작성해주세요.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-gray-700">입지/상권 특성 <span className="text-red-500">*</span></label>
                                    <input
                                        disabled={formData.targets.length === 0}
                                        className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 bg-gray-50/50 disabled:bg-gray-100"
                                        placeholder={`예: ${formData.targets[0] || '초등'} 학교 정문 앞, 2000세대 아파트 단지 등`}
                                        value={formData.environment.location}
                                        onChange={(e) => setFormData({ ...formData, environment: { ...formData.environment, location: e.target.value } })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-gray-700">주 타겟 학부모 성향 (택 1) <span className="text-red-500">*</span></label>
                                    <select
                                        disabled={formData.targets.length === 0}
                                        className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 bg-white cursor-pointer disabled:bg-gray-100"
                                        value={formData.environment.parentsType}
                                        onChange={(e) => setFormData({ ...formData, environment: { ...formData.environment, parentsType: e.target.value } })}
                                    >
                                        <option value="">성향을 선택해주세요</option>
                                        <option value="입시 중심">📈 입시/성과 중심 (엄격한 관리 선호)</option>
                                        <option value="영어 흥미/스피킹">🗣️ 체험/흥미/스피킹 중심</option>
                                        <option value="보육/관리">💕 케어/안전/인성 중시 (맞벌이)</option>
                                        <option value="가성비">💰 합리적 비용/실속 중시</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Competitors */}
                {step === 2 && (
                    <div className="animate-slideIn">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <span className="w-1 h-6 bg-red-600 rounded-full"></span>
                                경쟁사 분석
                            </h3>
                        </div>
                        <p className="text-gray-500 mb-6 bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <span className="font-bold text-gray-800">{getTargetContextString()}</span>를 대상으로 경쟁하고 있는 주변 학원을 입력해주세요. (최소 1개 필수)
                        </p>

                        <div className="space-y-6">
                            {formData.competitors.map((comp, idx) => (
                                <div key={idx} className="p-6 bg-gray-50/80 rounded-2xl border border-gray-200 relative group transition-all hover:bg-white hover:shadow-md hover:border-red-100">
                                    <div className="absolute -top-3 left-4 bg-gray-600 text-white text-xs px-2 py-1 rounded shadow-sm">
                                        경쟁사 {idx + 1}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-500 ml-1">학원명 <span className="text-red-500">*</span></label>
                                            <input
                                                placeholder="예: A어학원"
                                                className="w-full p-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                                                value={comp.name}
                                                onChange={(e) => handleCompetitorChange(idx, 'name', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-500 ml-1">수강료 <span className="text-red-500">*</span></label>
                                            <input
                                                placeholder={`숫자만 입력 (예: 250000)`}
                                                className="w-full p-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                                                value={comp.fee}
                                                onChange={(e) => handleCompetitorChange(idx, 'fee', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-500 ml-1">강점</label>
                                            <input
                                                placeholder="예: 차량운행, 원어민, 저렴한 수강료"
                                                className="w-full p-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                                                value={comp.strength}
                                                onChange={(e) => handleCompetitorChange(idx, 'strength', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-500 ml-1">약점</label>
                                            <input
                                                placeholder="예: 관리 소홀, 잦은 강사 교체"
                                                className="w-full p-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                                                value={comp.weakness}
                                                onChange={(e) => handleCompetitorChange(idx, 'weakness', e.target.value)}
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-1">
                                            <label className="text-xs font-semibold text-gray-500 ml-1">주요 마케팅 채널</label>
                                            <input
                                                placeholder="예: 블로그 체험단, 아파트 게시판 광고"
                                                className="w-full p-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                                                value={comp.marketing}
                                                onChange={(e) => handleCompetitorChange(idx, 'marketing', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    {formData.competitors.length > 1 && (
                                        <button
                                            onClick={() => removeCompetitor(idx)}
                                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                onClick={addCompetitor}
                                className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 font-medium hover:border-red-400 hover:text-red-500 hover:bg-red-50/10 transition-colors flex items-center justify-center gap-2"
                            >
                                <Plus size={20} /> 경쟁사 추가하기
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: My Academy */}
                {step === 3 && (
                    <div className="animate-slideIn">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">자사(학원) 현황 상세 입력</h2>
                        <p className="text-gray-500 mb-6 bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <span className="font-bold text-gray-800">{getTargetContextString()}</span> 중심의 학원 운영 현황을 입력해주세요.
                        </p>
                        <AcademyDetailForm data={formData} updateData={(newData) => setFormData(prev => ({ ...prev, ...newData }))} />
                    </div>
                )}

            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 px-4">
                <button
                    onClick={() => setStep(s => Math.max(1, s - 1))}
                    disabled={step === 1}
                    className={`
            px-6 py-3 rounded-xl font-medium flex items-center transition-all
            ${step === 1
                            ? 'opacity-0 cursor-default'
                            : 'text-gray-500 hover:bg-gray-200 hover:text-gray-800'
                        }
          `}
                >
                    <ChevronLeft size={20} className="mr-1" /> 이전 단계
                </button>

                {step < 3 ? (
                    <button
                        onClick={() => {
                            if (isStepValid()) {
                                setStep(s => Math.min(3, s + 1));
                            } else {
                                alert("필수 항목을 모두 입력해주세요.");
                            }
                        }}
                        className={`group px-8 py-3 rounded-xl font-bold text-white transition-all flex items-center
                            ${isStepValid() ? 'bg-[#1a1c23] hover:bg-gray-800 hover:shadow-lg' : 'bg-gray-300 cursor-not-allowed'}
                        `}
                    >
                        다음 <ChevronRight size={20} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !isStepValid()}
                        className={`px-10 py-4 rounded-xl font-bold bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-xl hover:shadow-red-200 hover:-translate-y-1 transition-all flex items-center disabled:opacity-70 disabled:cursor-not-allowed
                             ${!isStepValid() ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                    >
                        {loading ? '분석 중...' : '전략 생성 완료'} <Save size={20} className="ml-2" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default InputPage;
