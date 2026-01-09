import React, { useState, useEffect } from 'react';
import { Users, Crosshair, Flag, Bot, Loader2 } from 'lucide-react';
import { generateStpStrategy } from '../../lib/aiService';

const StpStrategy = ({ studentInfo, parentsType, targetAudience, ourAnalysis, competitors, apiKey }) => {
    if (!studentInfo) return null;

    // AI State
    const [aiAnalysis, setAiAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Legacy Logic (Fallback)
    const getPrimarySegment = () => {
        if (targetAudience) return { name: targetAudience, count: 0, isSelected: true };
        const { kinder = 0, elem_low = 0, elem_high = 0, middle = 0, high = 0 } = studentInfo || {};
        const eTotal = (elem_low || 0) + (elem_high || 0);
        const mTotal = typeof middle === 'object' ? 0 : (middle || 0);
        const counts = [
            { name: '유치부', count: kinder || 0 },
            { name: '초등부', count: eTotal },
            { name: '중등부', count: mTotal },
            { name: '고등부', count: high || 0 }
        ];
        return counts.sort((a, b) => b.count - a.count)[0] || { name: '초등부', count: 0 };
    };

    const primarySegment = getPrimarySegment();

    const getPositioning = () => {
        if (parentsType === '교육열 높음') return "프리미엄 심화/성적 관리 전문 학원";
        if (parentsType === '보육/관리') return "엄마의 마음으로 케어하는 1:1 관리형 학원";
        if (parentsType === '영어 흥미/스피킹') return "즐겁게 말하며 배우는 실용 영어 전문";
        if (parentsType === '가성비') return "합리적인 비용으로 최대 효율을 내는 실속형 학원";
        return "지역 내 독보적인 1등 영어 학원";
    };

    // AI Effect
    useEffect(() => {
        if (apiKey && studentInfo) {
            setLoading(true);
            setError(null);
            generateStpStrategy(apiKey, ourAnalysis, competitors, studentInfo, parentsType, targetAudience)
                .then(text => setAiAnalysis(text))
                .catch(err => {
                    console.error("STP AI Error:", err);
                    setError(err.message);
                })
                .finally(() => setLoading(false));
        }
    }, [apiKey, studentInfo, parentsType, targetAudience, ourAnalysis, competitors]);

    // Render Helper
    const renderContent = (type, defaultContent) => {
        if (!apiKey) return defaultContent; // No AI mode
        if (loading) return (
            <div className="flex items-center text-purple-600 text-sm animate-pulse">
                <Loader2 size={16} className="animate-spin mr-2" />
                AI 분석 중...
            </div>
        );

        // If error or no analysis, return default content with optional error indicator
        if (error || !aiAnalysis) {
            return (
                <div className="relative">
                    {defaultContent}
                    {error && (
                        <div className="mt-2 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-100 flex items-center gap-1">
                            <span>⚠️ AI 분석 지연/오류 (기본값 표시됨)</span>
                        </div>
                    )}
                </div>
            );
        }

        // Parse AI Content
        const pattern = new RegExp(`###\\s*${type}\\s*([\\s\\S]+?)(?=###|$)`, 'i');
        const match = aiAnalysis.match(pattern);

        if (match && match[1].trim()) {
            return (
                <div className="prose prose-sm max-w-none text-gray-800 leading-relaxed text-sm animate-fadeIn"
                    dangerouslySetInnerHTML={{ __html: match[1].trim().replace(/\n/g, '<br/>') }} />
            );
        }
        return defaultContent; // Fallback if parsing fails
    };

    return (
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/40 mb-8 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Flag className="text-purple-600" />
                STP 전략 (타겟팅 & 포지셔닝)
                {apiKey && !error && <span className="ml-auto flex items-center gap-1 text-sm font-normal text-purple-600 bg-purple-50 px-3 py-1 rounded-full"><Bot size={16} /> AI Enhanced</span>}
                {apiKey && error && <span className="ml-auto flex items-center gap-1 text-sm font-normal text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-xs">⚠️ AI Limit</span>}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Segmentation */}
                <div className="p-6 bg-purple-50 rounded-2xl border border-purple-100 flex flex-col h-full hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-purple-600 mb-5 shadow-sm border border-purple-50">
                        <Users size={24} />
                    </div>
                    <h3 className="font-bold text-purple-900 text-lg mb-3">Segmentation (세분화)</h3>
                    {renderContent('SEGMENTATION', (
                        <div className="text-sm text-purple-900/80 leading-relaxed flex-1 text-justify">
                            <p className="mb-3">
                                원장님께서 핵심 전략 타겟으로 설정하신 <strong>'{primarySegment.name}'</strong> 시장은
                                현재 우리 지역에서 가장 성장 잠재력이 높고, 학원 확장성(Scalability)이 뛰어난 세그먼트입니다.
                            </p>
                            <p className="mb-3">
                                백화점식 나열보다는, 모든 커리큘럼과 마케팅 메시지를 오직 <strong>'{primarySegment.name}'</strong> 학부모와 학생의
                                니즈(Needs)에 100% 맞추는 '핀셋 전략'을 통해 지역 내 해당 분야 1등 이미지를 선점해야 합니다.
                            </p>
                        </div>
                    ))}
                </div>

                {/* Targeting */}
                <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100 flex flex-col h-full hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-indigo-600 mb-5 shadow-sm border border-indigo-50">
                        <Crosshair size={24} />
                    </div>
                    <h3 className="font-bold text-indigo-900 text-lg mb-3">Targeting (타겟 선정)</h3>
                    {renderContent('TARGETING', (
                        <div className="text-sm text-indigo-900/80 leading-relaxed flex-1 text-justify">
                            <p className="mb-3">
                                우리가 최우선으로 공략해야 할 핵심 타겟(Core Target)은
                                <strong> '{primarySegment.name} 자녀를 둔, {parentsType || '교육'} 성향의 학부모'</strong>입니다.
                            </p>
                            <p className="mb-3">
                                이 타겟층은 단순한 성적 향상 그 이상을 원합니다. 우리 학원의 체계적인 관리 시스템과 강점 요소를
                                온/오프라인 채널을 통해 지속적으로 노출해야 합니다. 특히 기존 재원생 학부모를 통한
                                <strong> '구전 마케팅(WOM)'</strong>이 가장 효과적인 타겟이므로, 소개 이벤트 프로모션을 적극 활용하십시오.
                            </p>
                        </div>
                    ))}
                </div>

                {/* Positioning */}
                <div className="p-6 bg-pink-50 rounded-2xl border border-pink-100 flex flex-col h-full hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-pink-600 mb-5 shadow-sm border border-pink-50">
                        <Flag size={24} />
                    </div>
                    <h3 className="font-bold text-pink-900 text-lg mb-3">Positioning</h3>
                    {renderContent('POSITIONING', (
                        <div className="text-sm text-pink-900/80 leading-relaxed flex-1">
                            <p className="mb-4">
                                경쟁이 치열한 이 지역 학원가에서, 학부모님들의 뇌리에 우리 학원을 다음과 같이
                                확실하게 <strong>포지셔닝(Positioning)</strong> 해야 합니다.
                            </p>
                            <div className="p-5 bg-white rounded-xl shadow-md border border-pink-100 text-center mb-5 transform hover:scale-105 transition-transform">
                                <span className="text-xs text-pink-400 font-bold uppercase tracking-wider block mb-2">Our Brand Identity</span>
                                <strong className="text-xl text-pink-600 font-extrabold break-keep leading-snug">"{getPositioning()}"</strong>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StpStrategy;
