import React from 'react';
import { UserCheck, AlertTriangle, CheckCircle } from 'lucide-react';

const ManagementDiagnosis = ({ operationInfo, targetAudience }) => {
    if (!operationInfo) return null;

    const { isDirectorTeaching, hasCounselor, maxStudentCapacity } = operationInfo;

    // Diagnosis Logic
    const isIdeal = !isDirectorTeaching && hasCounselor;
    const isRisky = isDirectorTeaching && !hasCounselor;

    return (
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/40 mb-8 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <UserCheck className="text-blue-600" />
                경영 효율성 진단
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Director Role Diagnosis */}
                <div className={`p-6 rounded-2xl border-2 ${isDirectorTeaching ? 'border-orange-200 bg-orange-50' : 'border-blue-200 bg-blue-50'}`}>
                    <h3 className="font-bold text-lg mb-2 text-gray-800">원장님 역할 진단</h3>
                    {isDirectorTeaching ? (
                        <div>
                            <div className="flex items-center gap-2 text-orange-600 font-bold mb-2">
                                <AlertTriangle size={20} /> 수업 비중 과다
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                현재 원장님이 직접 수업을 진행하고 계십니다.<br />
                                수업 준비와 강의로 인해 <strong>경영 전략 수립과 학부모 상담</strong>에 소홀해질 위험이 있습니다.<br />
                                <span className="font-bold underline text-orange-700">Action: 파트타임 강사 고용 후 경영 시간 확보 필요</span>
                            </p>
                        </div>
                    ) : (
                        <div>
                            <div className="flex items-center gap-2 text-blue-600 font-bold mb-2">
                                <CheckCircle size={20} /> 경영 중심 체제
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                수업을 위임하고 경영에 집중하고 계십니다.<br />
                                현재 구조를 유지하며 <strong>마케팅과 외부 제휴</strong>를 확장할 최적의 타이밍입니다.
                            </p>
                        </div>
                    )}
                </div>

                {/* Counseling System Diagnosis */}
                <div className={`p-6 rounded-2xl border-2 ${!hasCounselor ? 'border-red-200 bg-red-50' : 'border-emerald-200 bg-emerald-50'}`}>
                    <h3 className="font-bold text-lg mb-2 text-gray-800">상담 관리 시스템</h3>
                    {!hasCounselor ? (
                        <div>
                            <div className="flex items-center gap-2 text-red-600 font-bold mb-2">
                                <AlertTriangle size={20} /> 상담 인력 부재
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                전담 상담 직원이 없어, 신규 문의 대응이나 재원생 관리가 <br />원장님의 스케줄에 의존적입니다.<br />
                                <span className="font-bold underline text-red-700">Action: 상담 실장 채용 또는 상담 매뉴얼화 시급</span>
                            </p>
                        </div>
                    ) : (
                        <div>
                            <div className="flex items-center gap-2 text-emerald-600 font-bold mb-2">
                                <CheckCircle size={20} /> 상담 체계 안정
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                전담 인력을 통해 체계적인 상담이 가능합니다.<br />
                                <strong>상담 성공률(등록률)을 데이터화</strong>하여 분석해보세요.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Overall Summary */}
            <div className="mt-6 p-4 bg-gray-900 text-white rounded-xl text-center">
                {isIdeal
                    ? `이상적인 경영 시스템을 갖추고 계십니다. 이제 원장님이 설정하신 '${targetAudience || '핵심 타겟'}' 시장 점유율 확장에 집중하십시오.`
                    : isRisky
                        ? `현재 구조로는 '${targetAudience || '핵심 타겟'}' 시장을 공략하기 어렵습니다. 시스템형 학원으로 전환하여 원장님의 전략 구상 시간을 확보하세요.`
                        : `기반은 갖춰져 있습니다. '${targetAudience || '핵심 타겟'}' 맞춤형 마케팅을 강화하여 지역 1등 학원으로 도약하십시오.`}
            </div>
        </div>
    );
};

export default ManagementDiagnosis;
