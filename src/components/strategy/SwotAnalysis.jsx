import React, { useState, useEffect } from 'react';
import { Target, Shield, Zap, TrendingUp } from 'lucide-react';

const SwotAnalysis = ({ ourAnalysis, competitors }) => {

    // Auto-generate SWOT factors from raw input data
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
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderCard('Strength (강점)', swotData.s, 'border-blue-100 bg-blue-50/50 text-blue-900', <Zap size={18} className="text-blue-600" />)}
                {renderCard('Weakness (약점)', swotData.w, 'border-red-100 bg-red-50/50 text-red-900', <AlertTriangle size={18} className="text-red-600" />)}
                {renderCard('Opportunity (기회)', swotData.o, 'border-emerald-100 bg-emerald-50/50 text-emerald-900', <TrendingUp size={18} className="text-emerald-600" />)}
                {renderCard('Threat (위협)', swotData.t, 'border-gray-200 bg-gray-50 text-gray-900', <Shield size={18} className="text-gray-600" />)}
            </div>

            <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-2">💡 필승 전략 제안 (SO 전략)</h4>
                <p className="text-gray-600 text-sm">
                    {(() => {
                        const strength = swotData.s[0] || '우수한 강사진';
                        const weakness = swotData.w[0] || '약점 보완 필요';
                        const opportunity = swotData.o[0] ? swotData.o[0].split('(')[1]?.replace(')', '') : '시장 기회';
                        const threat = swotData.t[0] ? swotData.t[0].split('(')[1]?.replace(')', '') : '경쟁 심화';

                        // Enhanced AI Generation Logic (Longer & Detailed)
                        const paragraphs = [];

                        paragraphs.push(`📌 **핵심 승부수 (SO 전략)**\n현재 원장님 학원의 가장 큰 자산인 **'${strength}'** 경쟁력을 최대한 활용해야 합니다. 경쟁사들이 흉내 낼 수 없는 우리만의 디테일한 관리 시스템과 커리큘럼을 학부모 설명회나 상담 시 시각 자료로 준비하여, 학부모가 "여기는 확실히 다르다"는 것을 즉각적으로 느낄 수 있게 하십시오.`);

                        if (opportunity && opportunity !== '시장 기회') {
                            paragraphs.push(`🎯 **기회 포착**\n현재 지역 내 경쟁 학원들이 **'${opportunity}'** 부분에서 취약점을 보이고 있습니다. 이는 우리에게 절호의 기회입니다. 경쟁사의 해당 약점에 불만을 가진 학부모들에게 우리의 강점이 확실한 해결책(Solution)이 될 수 있음을 강조하는 '비교 우위 마케팅'을 전개하십시오.`);
                        }

                        if (threat && threat !== '경쟁 심화') {
                            paragraphs.push(`🛡 **위협 대응**\n경쟁사의 **'${threat}'** 강점은 경계해야 할 요소입니다. 우리도 이에 대응할 수 있는 방어 논리를 개발하거나, 경쟁사가 따라올 수 없는 차별화된 감성 마케팅(학생 케어, 동기부여 등)으로 전장을 옮기는 지혜가 필요합니다.`);
                        }

                        paragraphs.push(`✨ **최종 제언**\n결국 학원의 본질은 '성적 향상'과 '학생 관리'입니다. '${strength}'을(를) 바탕으로 신규 원생 유입을 늘리되, '${weakness}'을(를) 지속적으로 보완하여 재원생의 만족도를 높이는 '내실 경영'을 병행한다면, 지역 내 압도적인 1등 학원으로 자리매김할 것입니다.`);

                        return <div className="text-gray-800 text-sm leading-7 space-y-4 whitespace-pre-wrap">{paragraphs.map((p, i) => <p key={i} dangerouslySetInnerHTML={{ __html: p.replace(/\n/g, '<br/>') }}></p>)}</div>;
                    })()}
                </p>
            </div>
        </div>
    );
};

// Helper icon
import { AlertTriangle } from 'lucide-react';

export default SwotAnalysis;
