"use client";

import { useMemo } from "react";
import { AutoCompleteInput } from "./AutoCompleteInput";
import { EQUIPES } from "../data/data-fixed";
import type { Equipe } from "../types/equipe";

interface SelecaoTrabalhoSectionProps {
    numeroEquipeTitulo: string;
    numeroEquipe: string;
    titulo: string;
    hasObservacoes: boolean;
    onChange: (value: string) => void;
}

export function SelecaoTrabalhoSection({
    numeroEquipeTitulo,
    numeroEquipe,
    titulo,
    hasObservacoes,
    onChange,
}: SelecaoTrabalhoSectionProps) {
    // Gera e ordena as opções no formato "G1 - Título"
    const opcoesTrabalho = useMemo(() => {
        return EQUIPES.map((t: Equipe) => `${t.equipe} - ${t.titulo}`).sort(
            (a, b) => {
                const getNumber = (str: string) => {
                    const match = str.match(/G(\d+)/);
                    return match ? parseInt(match[1]) : 0;
                };
                return getNumber(a) - getNumber(b);
            },
        );
    }, []);

    return (
        <div>
            <AutoCompleteInput
                label="Número e Título do Trabalho"
                value={numeroEquipeTitulo}
                onChange={onChange}
                options={opcoesTrabalho}
                placeholder="Selecione ou digite o número/título"
                required
            />

            {(numeroEquipe || titulo) && (
                <p className="text-xs text-gray-500 mt-1 flex flex-col space-y-0.5">
                    <span>
                        <strong>Equipe:</strong> {numeroEquipe}
                    </span>
                    <span>
                        <strong>Título:</strong> {titulo}
                    </span>
                </p>
            )}

            {hasObservacoes && (
                <p className="text-xs text-red-500 mt-1.5 font-medium">
                    ⚠️ Este trabalho possui observações sobre a equipe. Consulte
                    a organização para entender.
                </p>
            )}
        </div>
    );
}
