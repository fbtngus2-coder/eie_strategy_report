import React from 'react';
import { Building, Users, GraduationCap, DollarSign } from 'lucide-react';

const AcademyDetailForm = ({ data, updateData }) => {

    const handleChange = (section, field, value) => {
        updateData({
            [section]: {
                ...data[section],
                [field]: value
            }
        });
    };

    const handleStudentChange = (category, value) => {
        updateData({
            student_info: {
                ...data.student_info,
                [category]: parseInt(value) || 0
            }
        });
    };

    const handleTuitionChange = (category, value) => {
        updateData({
            tuition_info: {
                ...data.tuition_info,
                [category]: parseInt(value) || 0
            }
        });
    };

    return (
        <div className="space-y-8">

            {/* 1. Facility & Staff */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Building size={20} className="text-gray-500" /> 시설 및 인력
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">강의실 수</label>
                        <input
                            type="number"
                            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                            value={data.facility_info.classrooms}
                            onChange={(e) => handleChange('facility_info', 'classrooms', parseInt(e.target.value) || 0)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">강의실 당 최대 수용 인원</label>
                        <input
                            type="number"
                            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                            placeholder="예: 10"
                            value={data.facility_info.maxCapacityPerRoom || ''}
                            onChange={(e) => handleChange('facility_info', 'maxCapacityPerRoom', parseInt(e.target.value) || 0)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">하루 총 수업 타임 수 (교시)</label>
                        <input
                            type="number"
                            min="1" max="12"
                            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                            placeholder="예: 6"
                            value={data.facility_info.dailyClassCount || ''}
                            onChange={(e) => handleChange('facility_info', 'dailyClassCount', parseInt(e.target.value) || 6)}
                        />
                        <p className="text-xs text-gray-400 mt-1">예: 2시, 3시 ... 7시 수업 = 6타임</p>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">강사 수 (명)</label>
                        <input
                            type="number"
                            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                            value={data.instructor_info.total}
                            onChange={(e) => handleChange('instructor_info', 'total', parseInt(e.target.value) || 0)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">셔틀 차량 운행 (대)</label>
                        <input
                            type="number"
                            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                            value={data.facility_info.shuttles}
                            onChange={(e) => handleChange('facility_info', 'shuttles', parseInt(e.target.value) || 0)}
                        />
                    </div>
                </div>
                <div className="mt-4 flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-5 h-5 text-red-600 rounded"
                            checked={data.facility_info.hasLab}
                            onChange={(e) => handleChange('facility_info', 'hasLab', e.target.checked)}
                        />
                        <span className="text-gray-700 font-medium">어학 실습실(Lab) 보유</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-5 h-5 text-red-600 rounded"
                            checked={data.facility_info.nativeTeacher}
                            onChange={(e) => handleChange('facility_info', 'nativeTeacher', e.target.checked)}
                        />
                        <span className="text-gray-700 font-medium">원어민 강사 근무</span>
                    </label>
                </div>
            </div>

            {/* 2. Operations */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Users size={20} className="text-gray-500" /> 운영 현황
                </h3>
                <div className="flex flex-wrap gap-6">
                    <label className="flex items-center gap-2 cursor-pointer p-4 bg-gray-50 rounded-xl hover:bg-red-50 hover:text-red-700 transition-colors border border-transparent hover:border-red-200 w-full sm:w-auto">
                        <input type="checkbox" className="w-5 h-5 text-red-600 rounded"
                            checked={data.operation_info.isDirectorTeaching}
                            onChange={(e) => handleChange('operation_info', 'isDirectorTeaching', e.target.checked)}
                        />
                        <span className="font-bold">원장님 직접 수업 진행</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer p-4 bg-gray-50 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-colors border border-transparent hover:border-emerald-200 w-full sm:w-auto">
                        <input type="checkbox" className="w-5 h-5 text-emerald-600 rounded"
                            checked={data.operation_info.hasCounselor}
                            onChange={(e) => handleChange('operation_info', 'hasCounselor', e.target.checked)}
                        />
                        <span className="font-bold">상담 전문 인력(실장) 보유</span>
                    </label>
                </div>
            </div>

            {/* 3. Student Status */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <GraduationCap size={20} className="text-gray-500" /> 학생 현황 (명)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">유치부</label>
                        <input
                            type="number"
                            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 font-mono"
                            value={data.student_info.kinder}
                            onChange={(e) => handleStudentChange('kinder', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">초등 저학년</label>
                        <input
                            type="number"
                            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 font-mono"
                            value={data.student_info.elem_low}
                            onChange={(e) => handleStudentChange('elem_low', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">초등 고학년</label>
                        <input
                            type="number"
                            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 font-mono"
                            value={data.student_info.elem_high}
                            onChange={(e) => handleStudentChange('elem_high', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">중등부</label>
                        <input
                            type="number"
                            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 font-mono"
                            value={data.student_info.middle}
                            onChange={(e) => handleStudentChange('middle', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* 4. Tuition */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <DollarSign size={20} className="text-gray-500" /> 수강료 설정 (원)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">유치/파닉스</label>
                        <input
                            type="number" step="10000"
                            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 font-mono"
                            value={data.tuition_info.phonics}
                            onChange={(e) => handleTuitionChange('phonics', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">초등부</label>
                        <input
                            type="number" step="10000"
                            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 font-mono"
                            value={data.tuition_info.elementary}
                            onChange={(e) => handleTuitionChange('elementary', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">중등부</label>
                        <input
                            type="number" step="10000"
                            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 font-mono"
                            value={data.tuition_info.middle}
                            onChange={(e) => handleTuitionChange('middle', e.target.value)}
                        />
                    </div>
                </div>
                <div className="mt-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-5 h-5 text-red-600 rounded"
                            checked={data.tuition_info.isSeparateFee}
                            onChange={(e) => handleChange('tuition_info', 'isSeparateFee', e.target.checked)}
                        />
                        <span className="text-gray-700 font-medium">차량비/교재비 별도</span>
                    </label>
                </div>
            </div>
            {/* Additional Self-Analysis Text Areas */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Building size={20} className="text-gray-500" /> 자사 분석 서술
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Strength */}
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700">우리 학원의 강점 (Strength)</label>
                        <textarea
                            className="w-full p-4 rounded-2xl border border-gray-200 bg-blue-50/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 h-32 resize-none"
                            placeholder="예: 꼼꼼한 1:1 관리, EiE 본사 프로그램 활용, 셔틀 운행 등"
                            value={data.myAcademy.strength}
                            onChange={(e) => updateData({ myAcademy: { ...data.myAcademy, strength: e.target.value } })}
                        ></textarea>
                    </div>
                    {/* Weakness */}
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700">보완해야 할 약점 (Weakness)</label>
                        <textarea
                            className="w-full p-4 rounded-2xl border border-gray-200 bg-red-50/20 focus:outline-none focus:ring-2 focus:ring-red-500/50 h-32 resize-none"
                            placeholder="예: 강사 변동, 시설 노후화, 차량 미운행 등"
                            value={data.myAcademy.weakness}
                            onChange={(e) => updateData({ myAcademy: { ...data.myAcademy, weakness: e.target.value } })}
                        ></textarea>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AcademyDetailForm;
