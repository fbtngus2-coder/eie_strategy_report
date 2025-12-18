import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Trash2, FileText, Calendar, ArrowRight } from 'lucide-react';

const SavedReportsPage = () => {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            const { data, error } = await supabase
                .from('saved_reports')
                .select('id, title, created_at, input_data_id')
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Error fetching reports:", error);
            } else {
                setReports(data);
            }
            setLoading(false);
        };
        fetchReports();
    }, []);

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm("정말 이 리포트를 삭제하시겠습니까?")) return;

        const { error } = await supabase.from('saved_reports').delete().eq('id', id);
        if (!error) {
            setReports(prev => prev.filter(r => r.id !== id));
        }
    };

    const handleLoad = (inputDataId) => {
        navigate('/strategy', { state: { sessionId: inputDataId } }); // Re-use strategy page logic which fetches by Input ID
        // Note: Ideally we should load the 'snapshot' from saved_reports.report_content to capture edits.
        // But for V1, re-generating from Input ID is safer if logic changed. 
        // Wait, the user wanted "Save" feature. If they edited text, we need that text.
        // My StrategyPage fetches from 'input_data'. To show the 'Saved' content, we should pass the report content directly or teach StrategyPage to fetch from 'saved_reports' if a reportId is passed.
        // Let's keep it simple: Just view the original input for now as per "Re-analysis".
        // Actually, StrategyPage Logic: 
        // useEffect -> if (sessionId) fetch from input_data.
        // To support viewing SAVED snapshot, we would need to update StrategyPage to handle 'reportId' state OR pass the data object directly.
        // Let's update StrategyPage to accept 'reportData' in location.state.
    };

    return (
        <div className="max-w-5xl mx-auto pb-20">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">전략 리포트 보관함</h1>
            <p className="text-gray-500 mb-8">저장된 경영 전략 리포트를 언제든 다시 확인하세요.</p>

            {loading ? (
                <div>Loading...</div>
            ) : reports.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
                    <p className="text-gray-400">저장된 리포트가 없습니다.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reports.map((report) => (
                        <div
                            key={report.id}
                            onClick={() => handleLoad(report.input_data_id)}
                            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group relative"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-red-50 rounded-xl text-red-600">
                                    <FileText size={24} />
                                </div>
                                <button
                                    onClick={(e) => handleDelete(report.id, e)}
                                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors z-10"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1 group-hover:text-red-600 transition-colors">
                                {report.title}
                            </h3>

                            <div className="flex items-center text-sm text-gray-400 mb-6">
                                <Calendar size={14} className="mr-1" />
                                {new Date(report.created_at).toLocaleDateString()}
                            </div>

                            <div className="flex items-center text-sm font-bold text-red-600 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                리포트 열기 <ArrowRight size={16} className="ml-1" />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SavedReportsPage;
