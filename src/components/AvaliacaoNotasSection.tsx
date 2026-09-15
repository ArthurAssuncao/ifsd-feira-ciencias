"use client";

import type { FormData } from "../types/form";
import { NotaInput } from "./NotaInput";

interface AvaliacaoNotasSectionProps {
    formData: FormData;
    notaFinal: number;
    onNotaChange: (field: keyof FormData, value: string) => void;
}

const CRITERIOS: { field: keyof FormData; label: string }[] = [
    { field: "dominioTema", label: "Domínio do tema" },
    { field: "exposicaoOral", label: "Exposição oral e integração da equipe" },
    {
        field: "usoRecursos",
        label: "Uso dos recursos empregados e qualidade do material",
    },
    {
        field: "cumprimentoProposta",
        label: "Cumprimento da proposta e organização da equipe",
    },
    { field: "inovacaoCriatividade", label: "Inovação e criatividade" },
];

export function AvaliacaoNotasSection({
    formData,
    notaFinal,
    onNotaChange,
}: AvaliacaoNotasSectionProps) {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
                {CRITERIOS.map(({ field, label }) => (
                    <NotaInput
                        key={field}
                        label={label}
                        value={formData[field] as string}
                        onChange={(val) => onNotaChange(field, val)}
                        required
                    />
                ))}
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                <span className="text-sm font-medium text-gray-800">
                    Nota final:
                </span>
                <span className="text-lg font-bold text-green-600">
                    {notaFinal.toFixed(1)}
                </span>
            </div>
        </div>
    );
}
