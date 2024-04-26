import { RefreshCwIcon } from 'lucide-react';
import React from 'react';

const LoadingOverlay = ({ show }: { show: boolean }) => {
    return (
        <div className={`fixed inset-0 flex items-center justify-center z-50 ${show ? 'block' : 'hidden'}`}>
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="relative z-60">
                <RefreshCwIcon className="animate-spin text-white text-4xl" />
            </div>
        </div>
    );
};

export default LoadingOverlay;