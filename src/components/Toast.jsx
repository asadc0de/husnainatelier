import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
    useEffect(() => {
        if (duration) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    return (
        <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-right-full duration-500">
            <div className="flex items-center gap-4 px-8 py-5 rounded-none shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-[#d3cbb8] bg-[#FFF7E4]">
                {type === 'success' ? (
                    <div className="bg-black text-white p-1 rounded-full"><CheckCircle size={16} /></div>
                ) : (
                    <div className="bg-red-500 text-white p-1 rounded-full"><XCircle size={16} /></div>
                )}
                <div className="flex flex-col">
                    <span className="font-serif text-lg text-black">{type === 'success' ? 'Success' : 'Error'}</span>
                    <p className="font-sans text-xs tracking-widest text-gray-500 uppercase">{message}</p>
                </div>
                <button onClick={onClose} className="ml-4 text-gray-400 hover:text-black transition-colors">
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};

export default Toast;
