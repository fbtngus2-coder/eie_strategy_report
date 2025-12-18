import React from 'react';
import { PieChart, Building, School } from 'lucide-react';

const ThreeCAnalysis = ({ competitors, ourAnalysis, tuitionInfo }) => {

    const renderComparisonRow = (label, value, colorClass = "text-gray-800") => (
        <div className="flex items-start gap-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors px-4 -mx-4">
            <span className="w-16 shrink-0 text-sm font-extrabold text-gray-400 uppercase tracking-wide pt-0.5">{label}</span>
            <span className={`text-base font-medium flex-1 leading-relaxed ${colorClass}`}>
                {value || <span className="text-gray-300 font-normal">정보 없음</span>}
            </span>
        </div>
    );

    const formatFee = (val) => {
        if (!val) return '정보 없음';
        const num = parseInt(String(val).replace(/[^0-9]/g, ''));
        if (isNaN(num) || num === 0) return val; // Return original text if not a number
        // If number is small (e.g. 30), assume Man-won unit, but input usually full number.
        // Assuming full number from input.
        return `${num.toLocaleString()}원`;
    };

    return (
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/40 mb-8 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                <PieChart className="text-cyan-600" />
                3C 경쟁 환경 심층 분석
            </h2>

            <div className="flex flex-col gap-6">
                {/* Competitors List */}
                {competitors?.map((comp, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <div className="bg-gray-50 px-8 py-4 flex items-center gap-3 border-b border-gray-200">
                            <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 font-bold shadow-sm">
                                {String.fromCharCode(65 + idx)}
                            </div>
                            <h3 className="font-bold text-gray-700 text-lg">경쟁사: {comp.name}</h3>
                        </div>
                        <div className="px-8 py-4 bg-white">
                            {renderComparisonRow("강점", comp.strength)}
                            {renderComparisonRow("약점", comp.weakness)}
                            {renderComparisonRow("수강료", formatFee(comp.fee))}
                        </div>
                    </div>
                ))}

                {/* My Academy */}
                <div className="border-2 border-indigo-500 rounded-2xl overflow-hidden shadow-md ring-4 ring-indigo-50">
                    <div className="bg-indigo-600 px-8 py-4 flex items-center justify-between border-b border-indigo-700">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-indigo-600 font-bold shadow-sm">
                                <School size={18} />
                            </div>
                            <h3 className="font-bold text-white text-lg">우리 학원 (EiE)</h3>
                        </div>
                        <span className="bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full border border-indigo-400">ME</span>
                    </div>
                    <div className="px-8 py-4 bg-white">
                        {renderComparisonRow("강점", ourAnalysis?.strength, "text-indigo-800")}
                        {renderComparisonRow("약점", ourAnalysis?.weakness, "text-gray-600")}
                        {renderComparisonRow("수강료", formatFee(tuitionInfo?.elementary), "text-indigo-600 font-bold")}
                    </div>
                </div>
            </div>

            <p className="text-center text-gray-400 text-sm mt-8">
                * 경쟁사 데이터는 입력해주신 정보를 바탕으로 비교 분석됩니다.
            </p>
        </div>
    );
};

export default ThreeCAnalysis;
