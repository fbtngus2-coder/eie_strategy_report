import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Target, BarChart3, Calendar, Layers } from 'lucide-react';

const Dashboard = () => {
    return (
        <div className="space-y-10">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-white rounded-2xl shadow-lg border border-gray-100 p-10">
                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                        전략적 성장의 시작, <br />
                        <span className="text-red-600 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-500">
                            EiE Self-Consulting Program
                        </span>
                    </h1>
                    <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                        "싸우기 전에 이미 이길 조건을 만들어 놓고 시작하라"<br />
                        데이터 기반의 경쟁력 분석과 마케팅 전략으로 불패(不敗)의 조건을 완성합니다.
                    </p>
                    <div className="flex gap-4">
                        <Link
                            to="/input"
                            className="inline-flex items-center gap-2 bg-[#1a1c23] text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                        >
                            전략 생성 시작하기 <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>

                {/* Abstract Background Decoration */}
                <div className="absolute top-0 right-0 w-[500px] h-full opacity-10 pointer-events-none">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#FF0066" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-4.9C93.5,9.4,82.2,23.1,71.6,35.2C61,47.3,51.1,57.9,39.3,64.3C27.5,70.7,13.8,72.9,-0.6,73.9C-15,74.9,-30,74.7,-42.9,69.5C-55.8,64.2,-66.6,53.9,-75.4,41.9C-84.2,29.9,-91,16.2,-90.1,2.9C-89.2,-10.4,-80.6,-23.3,-70.7,-34.7C-60.8,-46.1,-49.6,-56,-37.2,-64.3C-24.8,-72.6,-11.2,-79.3,1.4,-81.7C14,-84.1,28,-82.2,44.7,-76.4Z" transform="translate(100 100)" />
                    </svg>
                </div>
            </div>

            {/* Feature Grids */}
            <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Layers className="text-red-500" size={24} />
                    프로세스 안내
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-red-100 transition-colors group">
                        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-6 group-hover:scale-110 transition-transform">
                            <Target size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">1. 정밀 진단</h3>
                        <p className="text-gray-500 leading-relaxed">
                            분원의 타겟, 경쟁사 현황, 입지 환경을 체계적으로 입력하여 분석의 기초를 다집니다.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-red-100 transition-colors group">
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                            <BarChart3 size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">2. AI 매칭 & 분석</h3>
                        <p className="text-gray-500 leading-relaxed">
                            입력 데이터와 EiE 본사 마케팅 DB를 결합, 가장 효과적인 시기별 공략 포인트를 도출합니다.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-red-100 transition-colors group">
                        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
                            <Calendar size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">3. 실행 전략 수립</h3>
                        <p className="text-gray-500 leading-relaxed">
                            구체적인 예산 시뮬레이션과 기대 수익이 포함된 실행 가능한 Action Plan을 제공합니다.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
