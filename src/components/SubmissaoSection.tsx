"use client";

import type { RefObject } from "react";

interface SubmissaoSectionProps {
    observacoes: string;
    password: string;
    passwordIsValid: boolean;
    isSubmitting: boolean;
    submitStatus: "idle" | "success" | "error";
    inputPassRef: RefObject<HTMLInputElement | null>;
    onObservacoesChange: (value: string) => void;
    onPasswordChange: (value: string) => void;
}

export function SubmissaoSection({
    observacoes,
    // password,
    // passwordIsValid,
    isSubmitting,
    submitStatus,
    // inputPassRef,
    onObservacoesChange,
    // onPasswordChange,
}: SubmissaoSectionProps) {
    return (
        <div className="space-y-6">
            {/* Observações */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observações adicionais
                </label>
                <textarea
                    value={observacoes}
                    onChange={(e) => onObservacoesChange(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 placeholder:text-gray-400"
                    placeholder="Ausência de aluno, observação sobre apresentação, etc."
                />
            </div>

            {/* Palavra Passe */}
            {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-0.5">
                    Palavra passe <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-red-600 mb-2">
                    Para submeter utilize a palavra passe enviada pela
                    organização.
                </p>

                <div className="relative flex items-center">
                    <input
                        ref={inputPassRef}
                        type="text"
                        className="w-full pr-12 px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Digite a palavra passe"
                        value={password}
                        onChange={(e) => onPasswordChange(e.target.value)}
                        required
                    />
                    <div
                        className={`absolute right-1 w-8 h-8 rounded-md flex items-center justify-center text-white text-sm font-bold transition-colors ${
                            passwordIsValid ? "bg-green-500" : "bg-red-500"
                        }`}
                    >
                        {passwordIsValid ? "✓" : "✕"}
                    </div>
                </div>
            </div> */}

            {/* Botão Submit */}
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-600 text-white font-medium py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
                {isSubmitting ? "Enviando Avaliação..." : "Enviar Avaliação"}
            </button>

            {/* Alertas visuais de status */}
            {submitStatus === "success" && (
                <div className="bg-green-50 border border-green-200 rounded-md p-4 text-green-800 text-sm font-medium">
                    ✅ Avaliação enviada com sucesso!
                </div>
            )}

            {submitStatus === "error" && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-800 text-sm font-medium">
                    ❌ Erro ao enviar avaliação. Tente novamente.
                </div>
            )}
        </div>
    );
}
