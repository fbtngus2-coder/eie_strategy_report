import React, { useState, useEffect } from 'react';
import { Settings, CheckCircle2, XCircle, Key, Lock, ExternalLink, Loader2 } from 'lucide-react';
import { testApiKey } from '../lib/aiService';

const AiSettingsModal = ({ isOpen, onClose, onSave }) => {
    const [apiKey, setApiKey] = useState('');
    const [status, setStatus] = useState('idle'); // idle, testing, success, error
    const [statusMsg, setStatusMsg] = useState('');

    useEffect(() => {
        if (isOpen) {
            const savedKey = localStorage.getItem('gemini_api_key');
            if (savedKey) setApiKey(savedKey);
            setStatus('idle');
            setStatusMsg('');
        }
    }, [isOpen]);

    const handleTestAndSave = async () => {
        if (!apiKey) {
            setStatus('error');
            setStatusMsg('API Key를 입력해주세요.');
            return;
        }

        setStatus('testing');
        const isValid = await testApiKey(apiKey);

        if (isValid) {
            setStatus('success');
            setStatusMsg('연동 성공! 키가 안전하게 저장되었습니다.');
            localStorage.setItem('gemini_api_key', apiKey);
            setTimeout(() => {
                onSave(apiKey);
                onClose();
            }, 1000);
        } else {
            setStatus('error');
            setStatusMsg('연동 실패. API Key를 확인해주세요.');
        }
    };

    const handleClear = () => {
        localStorage.removeItem('gemini_api_key');
        setApiKey('');
        setStatus('idle');
        setStatusMsg('저장된 키가 삭제되었습니다.');
        onSave(null);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Settings className="text-indigo-600" />
                        AI 분석 엔진 설정
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XCircle size={24} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                        <p className="text-indigo-900 text-sm leading-relaxed font-medium">
                            Google Gemini Pro의 강력한 인공지능을 연동합니다.<br />
                            입력하신 키는 브라우저에만 저장되며 서버로 전송되지 않습니다.
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Google API Key</label>
                        <div className="relative">
                            <Key className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                type="password"
                                value={apiKey}
                                onChange={(e) => {
                                    setApiKey(e.target.value);
                                    setStatus('idle');
                                }}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-mono text-sm"
                                placeholder="sk-..."
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <a
                            href="https://aistudio.google.com/app/apikey"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:text-indigo-600 underline"
                        >
                            <ExternalLink size={12} /> API Key 발급받기 (무료)
                        </a>
                        {localStorage.getItem('gemini_api_key') && (
                            <button onClick={handleClear} className="text-red-500 hover:underline">
                                저장된 키 삭제
                            </button>
                        )}
                    </div>

                    {statusMsg && (
                        <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${status === 'success' ? 'bg-green-50 text-green-700' :
                                status === 'error' ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-600'
                            }`}>
                            {status === 'testing' && <Loader2 className="animate-spin" size={16} />}
                            {status === 'success' && <CheckCircle2 size={16} />}
                            {status === 'error' && <Lock size={16} />}
                            {statusMsg}
                        </div>
                    )}

                    <button
                        onClick={handleTestAndSave}
                        disabled={status === 'testing' || !apiKey}
                        className={`w-full py-3 rounded-xl font-bold text-white transition-all shadow-md ${status === 'testing' || !apiKey
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'
                            }`}
                    >
                        {status === 'testing' ? '연동 확인 중...' : '연동하고 저장하기'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AiSettingsModal;
