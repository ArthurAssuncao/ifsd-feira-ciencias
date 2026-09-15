"use client";

import { useEffect, useId } from "react";

interface AlertProps {
    isOpen: boolean;
    title?: string;
    message: string;
    onClose: () => void;
    onConfirm?: () => void;
    showCancel?: boolean;
    confirmText?: string;
    cancelText?: string;
}

export default function Alert({
    isOpen,
    title = "Alerta",
    message,
    onClose,
    onConfirm,
    showCancel = false,
    confirmText = "OK",
    cancelText = "Cancelar",
}: AlertProps) {
    const titleId = useId();

    // Fecha o alerta ao pressionar ESC
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    // Previne scroll do body quando alerta está aberto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm?.();
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden animate-fade-in border border-gray-100"
                onClick={(e) => e.stopPropagation()} // Impede que o clique dentro do card feche o modal
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3
                        id={titleId}
                        className="text-lg font-semibold text-gray-900"
                    >
                        {title}
                    </h3>
                </div>

                {/* Message */}
                <div className="px-6 py-5">
                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                        {message}
                    </p>
                </div>

                {/* Actions */}
                <div className="px-6 py-3.5 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
                    {showCancel && (
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors cursor-pointer"
                        >
                            {cancelText}
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={showCancel ? handleConfirm : onClose}
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors cursor-pointer"
                        autoFocus
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
