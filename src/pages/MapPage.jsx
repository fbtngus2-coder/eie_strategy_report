import React, { useEffect, useRef } from 'react';

const MapPage = () => {
    const mapElement = useRef(null);

    useEffect(() => {
        if (!mapElement.current || !window.naver) return;

        const location = new window.naver.maps.LatLng(37.5665, 126.9780); // Seoul City Hall
        const mapOptions = {
            center: location,
            zoom: 15,
            zoomControl: true,
            zoomControlOptions: {
                position: window.naver.maps.Position.TOP_RIGHT,
            },
        };

        const map = new window.naver.maps.Map(mapElement.current, mapOptions);

        // Add a marker for demo
        new window.naver.maps.Marker({
            position: location,
            map: map,
            title: "EiE Campus"
        });

    }, []);

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">상권 지도 분석 (Beta)</h2>
                <p className="text-gray-500">지도를 통해 주변 상권과 아파트 단지를 분석합니다.</p>
            </div>
            <div className="flex-1 bg-gray-100 rounded-2xl border border-gray-200 overflow-hidden relative shadow-inner">
                <div ref={mapElement} className="w-full h-full" />
                {!window.naver && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
                        지도를 불러오는 중이거나 API 키 설정이 필요합니다.
                    </div>
                )}
            </div>
        </div>
    );
};

export default MapPage;
