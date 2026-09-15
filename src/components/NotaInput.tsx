import { useMemo } from "react";
import { MAX_NOTA } from "../data/data";

interface NotaInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
}

export function NotaInput({
    label,
    value,
    onChange,
    required,
}: NotaInputProps) {
    // Converte o valor em string para número decimal
    const numericValue = value ? parseFloat(value.replace(",", ".")) : 0;
    const isNotaMaxima = numericValue === MAX_NOTA;

    // Recria a regex apenas se o MAX_NOTA alterar
    const regex = useMemo(() => {
        return new RegExp(`^(${MAX_NOTA}([.,]0)?|[0-9]([.,][0-9])?)$`);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        if (inputValue === "" || regex.test(inputValue)) {
            onChange(inputValue);
        }
    };

    const adjustValue = (amount: number) => {
        // Math.round previne bugs de precisão de ponto flutuante no JS (ex: 0.1 + 0.2)
        const rawNewValue = Math.round((numericValue + amount) * 10) / 10;
        const newValue = Math.max(0, Math.min(MAX_NOTA, rawNewValue));
        onChange(newValue.toFixed(1).replace(".", ","));
    };

    const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        onChange(val.toFixed(1).replace(".", ","));
    };

    return (
        <div className="w-full">
            {/* Label */}
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            {/* Controles: Botão - Input - Botão */}
            <div className="flex items-center gap-2">
                {/* Botão de Decremento */}
                <button
                    type="button"
                    onClick={() => adjustValue(-0.1)}
                    disabled={numericValue <= 0}
                    className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors shrink-0"
                    title="Diminuir 0,1"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 12H4"
                        />
                    </svg>
                </button>

                {/* Input Text + Slider integrados */}
                <div className="flex-1 space-y-2">
                    <input
                        type="text"
                        value={value}
                        onChange={handleChange}
                        placeholder="0,0"
                        required={required}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-center font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 placeholder:text-gray-400"
                        inputMode="decimal"
                    />
                    <input
                        type="range"
                        min="0"
                        max={MAX_NOTA}
                        step="0.1"
                        value={isNaN(numericValue) ? 0 : numericValue}
                        onChange={handleRangeChange}
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600 block"
                    />
                </div>

                {/* Botão de Incremento */}
                <button
                    type="button"
                    onClick={() => adjustValue(0.1)}
                    disabled={numericValue >= MAX_NOTA}
                    className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors shrink-0"
                    title="Aumentar 0,1"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                </button>
            </div>

            {/* Textos auxiliares */}
            <div className="mt-2 text-center text-xs text-gray-500 space-y-0.5">
                <p>Notas de 0 a {MAX_NOTA} com uma casa decimal</p>
                <p>Ajuste pelos botões, slider ou digite a nota</p>
                <p className="text-red-500 font-medium">
                    {isNotaMaxima
                        ? "⚠️ Tem certeza que o trabalho está perfeito?"
                        : ""}
                </p>
            </div>
        </div>
    );
}
