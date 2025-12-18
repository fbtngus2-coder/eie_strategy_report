import React from 'react';
import { Package, Tag, MapPin, Megaphone } from 'lucide-react';

const MixStrategy = ({ facilityInfo, tuitionInfo, environment, targetAudience }) => {

    return (
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/40 mb-8 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Package className="text-indigo-600" />
                4P Marketing Mix
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Product */}
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 transition-hover hover:border-indigo-300 hover:shadow-md">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                        <Package size={20} className="text-indigo-600" /> Product (학원 상품)
                    </h3>
                    <div className="space-y-3 text-sm text-gray-700 leading-relaxed text-justify">
                        <p>
                            우리 학원의 핵심 상품 경쟁력은 바로 <strong>'{targetAudience}' 전문 '{facilityInfo?.hasLab ? '어학 실습실(Lab) 기반의 매일 훈련 시스템' : '체계적인 커리큘럼'}'</strong>입니다.
                            단순히 영어를 가르치는 것을 넘어, <strong>'{targetAudience}'</strong> 아이들의 눈높이에 맞춘 성장 과정을 시각화하여 학부모에게 정기적으로 공유하는 <strong>'성장 리포트 시스템'</strong>을 강력하게 어필해야 합니다.
                        </p>
                        <p>
                            또한 <strong className="text-indigo-700">원어민 강사</strong> 또는 <strong className="text-indigo-700">관리형 시스템</strong> 등 우리 학원만의 차별화된 요소를 '시그니처 프로그램'으로 브랜드화하여 홍보하십시오.
                        </p>
                    </div>
                </div>

                {/* Price */}
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 transition-hover hover:border-emerald-300 hover:shadow-md">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                        <Tag size={20} className="text-emerald-600" /> Price (가격/수강료)
                    </h3>
                    <div className="space-y-3 text-sm text-gray-700 leading-relaxed text-justify">
                        <p>
                            <strong>{targetAudience}</strong> 프로그램의 수강료 <strong>{tuitionInfo?.elementary?.toLocaleString()}원</strong>은 제공되는 교육 서비스의 가치와 비교했을 때 합리적인 투자가 될 것입니다.
                            {tuitionInfo?.isSeparateFee
                                ? " 다만, 교재비 등이 별도로 청구될 때 학부모가 예상치 못한 지출로 느끼지 않도록 상담 시 전체 비용 구조를 투명하게 안내하고, 그 비용이 아깝지 않을 만큼의 양질의 교재임을 강조해야 합니다."
                                : " 수업료 외 추가 비용이 없는 'All-in-One' 수강료 정책을 통해, 학부모의 경제적 심리 부담을 덜어주는 '가성비 마케팅'을 전개하십시오."}
                        </p>
                        <p>
                            가격 할인은 신중해야 하지만, '장기 등록 혜택'이나 '형제 동시 등록 할인'과 같은 명분 있는 혜택은 적극적으로 활용하십시오.
                        </p>
                    </div>
                </div>

                {/* Place */}
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 transition-hover hover:border-orange-300 hover:shadow-md">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                        <MapPin size={20} className="text-orange-600" /> Place (유통/장소)
                    </h3>
                    <div className="space-y-3 text-sm text-gray-700 leading-relaxed text-justify">
                        <p>
                            <strong>{environment?.location}</strong>은 교육 수요가 꾸준한 지역이지만, 경쟁 학원과의 물리적 거리가 가까워 치열한 경쟁이 예상됩니다.
                            {facilityInfo?.shuttles > 0
                                ? ` 현재 운행 중인 셔틀버스 ${facilityInfo.shuttles}대를 단순한 운송 수단이 아닌, **{targetAudience}** 학생들이 등하원하는 모든 경로를 '움직이는 빌보드 광고판'으로 활용하십시오.`
                                : ` 셔틀버스를 운행하지 않는다면, 오히려 **'{targetAudience}** 아이들이 도보로 안전하게 다닐 수 있는 가까운 학원'이라는 점을 역설적으로 강조하십시오.`}
                        </p>
                    </div>
                </div>

                {/* Promotion */}
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 transition-hover hover:border-pink-300 hover:shadow-md">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                        <Megaphone size={20} className="text-pink-600" /> Promotion (홍보)
                    </h3>
                    <div className="space-y-3 text-sm text-gray-700 leading-relaxed text-justify">
                        <p>
                            오프라인에서는 <strong>{targetAudience}</strong> 학생과 학부모의 주 이동 동선인 <strong>{environment?.flowPath}</strong> 등을 장악하는 현수막/배너 광고를 집행하여 학원의 존재감을 각인시켜야 합니다.
                            특히 <strong>{environment?.hotSpots}</strong>에서 <strong>{targetAudience}</strong> 타겟에 맞춘 홍보 물품 배포나 설문 조사 이벤트를 진행하여 접점을 늘리십시오.
                        </p>
                        <p>
                            온라인에서는 <strong>'{environment?.parentsType}'</strong> 성향을 가진 <strong>{targetAudience}</strong> 맘(Mom)들이 주로 검색하는 지역 커뮤니티나 키워드를 선점하여, 우리 학원의 교육 철학과 성공 사례(후기)를 지속적으로 노출해야 합니다.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MixStrategy;
