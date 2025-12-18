import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Calendar, Megaphone, Target, Sparkles, ArrowRight } from 'lucide-react';

const MarketingPage = () => {
    const [marketingData, setMarketingData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMarketingData();
    }, []);

    const fetchMarketingData = async () => {
        try {
            const { data, error } = await supabase
                .from('marketing_calendar')
                .select('*')
                .order('month', { ascending: true }); // Month sort might need refinement if stored as string

            if (error) throw error;
            setMarketingData(data || []);
        } catch (error) {
            console.error('Error fetching marketing data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-100 border-t-red-600"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-red-100 rounded-xl text-red-600">
                    <Megaphone size={28} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">월별 마케팅 공략</h1>
                    <p className="text-gray-500 mt-1">EiE 본사가 제안하는 공식 마케팅 캘린더와 주요 전략을 확인하세요.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {marketingData.map((item, index) => (
                    <div key={item.id || index} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
                        <div className="flex flex-col md:flex-row">
                            {/* Month & Title */}
                            <div className="bg-gray-50 p-6 flex-shrink-0 md:w-48 flex flex-col justify-center items-center text-center border-b md:border-b-0 md:border-r border-gray-100 group-hover:bg-red-50/30 transition-colors">
                                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Month</span>
                                <span className="text-4xl font-extrabold text-gray-800 mb-2">{item.month}월</span>
                                <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-600 shadow-sm">
                                    {item.event_title || '정기 마케팅'}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex-1 space-y-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                                        {item.marketing_title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed bg-gray-50/50 p-3 rounded-lg border border-gray-100">
                                        <span className="font-bold text-gray-700 mr-2">🎯 주요 목적:</span>
                                        {item.purpose}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 p-1.5 bg-blue-50 text-blue-600 rounded-lg flex-shrink-0">
                                            <Sparkles size={16} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900 mb-1">기대 효과</h4>
                                            <p className="text-sm text-gray-500 leading-relaxed">
                                                {item.expected_effect}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 p-1.5 bg-green-50 text-green-600 rounded-lg flex-shrink-0">
                                            <Target size={16} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900 mb-1">필요 준비물</h4>
                                            <p className="text-sm text-gray-500 leading-relaxed">
                                                {item.required_goods || '별도 준비물 없음'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MarketingPage;
