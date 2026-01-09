import React, { useState, useEffect } from 'react';
import { Target, Shield, Zap, TrendingUp, Sparkles, Bot, Loader2, AlertTriangle } from 'lucide-react';
import { generateSwotAnalysis } from '../../lib/aiService';

const SwotAnalysis = ({ ourAnalysis, competitors, apiKey }) => {

    // AI State
    const [aiAnalysis, setAiAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Auto-generate SWOT factors from raw input data (Legacy)
    const generateSwot = () => {
        let s = [], w = [], o = [], t = [];

        // Strength (My Academy)
        if (ourAnalysis?.strength) s.push(ourAnalysis.strength);

        // Weakness (My Academy)
        if (ourAnalysis?.weakness) w.push(ourAnalysis.weakness);

        // Opportunity (Competitor's Weakness)
        competitors?.forEach(comp => {
            if (comp.weakness) o.push(`${comp.name}의 약점(${comp.weakness}) 공략`);
        });

        // Threat (Competitor's Strength)
        competitors?.forEach(comp => {
            if (comp.strength) t.push(`${comp.name}의 강점(${comp.strength}) 견제 필요`);
        });

        return { s, w, o, t };
    };

    const [swotData, setSwotData] = useState({ s: [], w: [], o: [], t: [] });

    useEffect(() => {
        setSwotData(generateSwot());
    }, [ourAnalysis, competitors]);

    // AI Analysis Effect
    useEffect(() => {
        if (apiKey && ourAnalysis) {
            setLoading(true);
            setError(null);
            generateSwotAnalysis(apiKey, ourAnalysis, competitors)
                .then(text => {
                    setAiAnalysis(text);
                })
                .catch(err => {
                    console.error('SWOT AI Error:', err);
                    setError(err.message);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [apiKey, ourAnalysis, competitors]);

    const renderCard = (title, items, color, icon) => (
        <div className={`p-6 rounded-2xl border-2 h-full ${color}`}>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                {icon}
                {title}
            </h3>
            <ul className="space-y-2">
                {items.length > 0 ? items.map((item, i) => (
                    <li key={i} className="flex gap-2 text-sm font-medium opacity-80">
                        <span className="font-bold">•</span>
                        {item}
                    </li>
                )) : (
                    <li className="text-gray-400 text-sm italic">데이터 없음</li>
                )}
            </ul>
        </div>
    );

    return (
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/40 mb-8 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Target className="text-red-600" />
                SWOT 전략 분석
                {apiKey && <span className="ml-auto flex items-center gap-1 text-sm font-normal text-purple-600 bg-purple-50 px-3 py-1 rounded-full"><Bot size={16} /> AI Enhanced</span>}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderCard('Strength (강점)', swotData.s, 'border-blue-100 bg-blue-50/50 text-blue-900', <Zap size={18} className="text-blue-600" />)}
                {renderCard('Weakness (약점)', swotData.w, 'border-red-100 bg-red-50/50 text-red-900', <AlertTriangle size={18} className="text-red-600" />)}
                {renderCard('Opportunity (기회)', swotData.o, 'border-emerald-100 bg-emerald-50/50 text-emerald-900', <TrendingUp size={18} className="text-emerald-600" />)}
                {renderCard('Threat (위협)', swotData.t, 'border-gray-200 bg-gray-50 text-gray-900', <Shield size={18} className="text-gray-600" />)}
            </div>

            <div className="mt-8">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    {apiKey ? <Bot className="text-purple-600" size={20} /> : <span>💡</span>}
                    {apiKey ? 'AI 기반 필승 전략 분석' : '필승 전략 제안 (SO 전략)'}
                </h4>

                {loading && (
                    <div className="flex items-center justify-center py-8 text-purple-600">
                        <Loader2 className="animate-spin mr-2" size={20} />
                        AI가 전략을 분석하고 있습니다...
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
                        AI 분석 중 오류가 발생했습니다: {error}
                    </div>
                )}

                {!loading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(() => {
                            // 1. Prepare Default (Rule-based) Data
                            const strength = swotData.s[0] || '우수한 강사진';
                            const weakness = swotData.w[0] || '약점 보완 필요';
                            const opportunity = swotData.o[0] ? swotData.o[0].split('(')[1]?.replace(')', '') : '시장 기회';
                            const threat = swotData.t[0] ? swotData.t[0].split('(')[1]?.replace(')', '') : '경쟁 심화';

                            const defaultSections = [
                                {
                                    icon: '📌',
                                    title: '핵심 승부수 (SO 전략)',
                                    content: `현재 원장님 학원의 가장 큰 자산인 <strong>'${strength}'</strong> 경쟁력을 최대한 활용해야 합니다. 경쟁사들이 흉내 낼 수 없는 우리만의 디테일한 관리 시스템과 커리큘럼을 학부모 설명회나 상담 시 시각 자료로 준비하여, 학부모가 "여기는 확실히 다르다"는 것을 즉각적으로 느낄 수 있게 하십시오.`,
                                    color: 'from-blue-50 to-blue-100 border-blue-200'
                                },
                                {
                                    icon: '🎯',
                                    title: '기회 포착',
                                    content: opportunity && opportunity !== '시장 기회'
                                        ? `현재 지역 내 경쟁 학원들이 <strong>'${opportunity}'</strong> 부분에서 취약점을 보이고 있습니다. 이는 우리에게 절호의 기회입니다. 경쟁사의 해당 약점에 불만을 가진 학부모들에게 우리의 강점이 확실한 해결책(Solution)이 될 수 있음을 강조하는 '비교 우위 마케팅'을 전개하십시오.`
                                        : `지역 내 시장 기회를 포착하여 우리 학원만의 차별화된 강점을 부각시키는 전략이 필요합니다.`,
                                    color: 'from-green-50 to-green-100 border-green-200'
                                },
                                {
                                    icon: '🛡',
                                    title: '위협 대응',
                                    content: threat && threat !== '경쟁 심화'
                                        ? `경쟁사의 <strong>'${threat}'</strong> 강점은 경계해야 할 요소입니다. 우리도 이에 대응할 수 있는 방어 논리를 개발하거나, 경쟁사가 따라올 수 없는 차별화된 감성 마케팅(학생 케어, 동기부여 등)으로 전장을 옮기는 지혜가 필요합니다.`
                                        : `경쟁 학원들의 강점에 대응하여 우리만의 차별화 포인트를 명확히 하는 것이 중요합니다.`,
                                    color: 'from-orange-50 to-orange-100 border-orange-200'
                                },
                                {
                                    icon: '✨',
                                    title: '최종 제언',
                                    content: `결국 학원의 본질은 '성적 향상'과 '학생 관리'입니다. <strong>'${strength}'</strong>을(를) 바탕으로 신규 원생 유입을 늘리되, <strong>'${weakness}'</strong>을(를) 지속적으로 보완하여 재원생의 만족도를 높이는 '내실 경영'을 병행한다면, 지역 내 압도적인 1등 학원으로 자리매김할 것입니다.`,
                                    color: 'from-purple-50 to-purple-100 border-purple-200'
                                }
                            ];

                            // 2. Parse AI Data (if available)
                            let sections = [...defaultSections]; // Start with defaults

                            if (apiKey && aiAnalysis) {
                                const aiSections = [];
                                const sectionPattern = /###?\s*[📌🎯🛡✨]\s*\*\*(.+?)\*\*\s*([\s\S]+?)(?=###?\s*[📌🎯🛡✨]|$)/g;
                                let match;
                                while ((match = sectionPattern.exec(aiAnalysis)) !== null) {
                                    aiSections.push({
                                        title: match[1].trim(),
                                        content: match[2].trim().replace(/\n/g, '<br/>')
                                    });
                                }

                                // If AI parsing was successful (found at least 1 section), merge it
                                if (aiSections.length > 0) {
                                    sections = sections.map((defSection) => {
                                        // Find matching AI section by keyword
                                        let matchedAiSection = null;

                                        if (defSection.title.includes('승부수') || defSection.title.includes('SO')) {
                                            matchedAiSection = aiSections.find(s => s.title.includes('승부수') || s.title.includes('SO'));
                                        } else if (defSection.title.includes('기회')) {
                                            matchedAiSection = aiSections.find(s => s.title.includes('기회'));
                                        } else if (defSection.title.includes('위협')) {
                                            matchedAiSection = aiSections.find(s => s.title.includes('위협'));
                                        } else if (defSection.title.includes('제언')) {
                                            matchedAiSection = aiSections.find(s => s.title.includes('제언') || s.title.includes('요약'));
                                        }

                                        if (matchedAiSection) {
                                            return {
                                                ...defSection,
                                                title: matchedAiSection.title, // Use AI title
                                                content: matchedAiSection.content // Use AI content
                                            };
                                        }
                                        return defSection;
                                    });
                                }
                            }

                            // 3. Render
                            return sections.map((section, idx) => (
                                <div key={idx} className={`p-5 bg-gradient-to-br ${section.color} rounded-xl border-2 hover:shadow-lg transition-shadow`}>
                                    <h5 className="font-bold text-gray-900 mb-3 text-base flex items-center gap-2">
                                        <span className="text-lg">{section.icon}</span>
                                        {section.title}
                                    </h5>
                                    <div className="text-sm text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: section.content }} />
                                </div>
                            ));
                        })()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SwotAnalysis;
