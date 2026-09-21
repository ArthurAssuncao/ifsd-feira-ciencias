"use client";

import { AVALIADORES, type Avaliador } from "../data/data";
import { toTitleCase } from "../util/string";
import { AutoCompleteInput } from "./AutoCompleteInput";

interface DadosAvaliadorSectionProps {
    nomeAvaliador: string;
    emailAvaliador: string;
    onNomeChange: (nome: string) => void;
    onEmailChange: (email: string) => void;
}

export function DadosAvaliadorSection({
    nomeAvaliador,
    emailAvaliador,
    onNomeChange,
    onEmailChange,
}: DadosAvaliadorSectionProps) {
    const nomesAvaliadores = AVALIADORES.map((av: Avaliador) =>
        toTitleCase(av.nome, true),
    );
    const emailsAvaliadores = AVALIADORES.map((a: Avaliador) => a.email);
    const trabalhosAvaliadosDoAvaliador = AVALIADORES.find(
        (a: Avaliador) => a.email === emailAvaliador,
    );
    const trabalhosAvaliados = trabalhosAvaliadosDoAvaliador
        ? trabalhosAvaliadosDoAvaliador.projetosAvaliados
        : [];

    return (
        <div className="space-y-4">
            <AutoCompleteInput
                label="Nome do Avaliador"
                value={nomeAvaliador}
                onChange={onNomeChange}
                options={nomesAvaliadores}
                observacao="Seu nome/e-mail não vão aparecer nos resultados público"
                required
            />

            <AutoCompleteInput
                label="E-mail do Avaliador"
                value={emailAvaliador}
                onChange={onEmailChange}
                options={emailsAvaliadores}
                placeholder="seu.nome@email.com"
                required
            />

            <div className="flex flex-wrap gap-2 items-center ">
                <span className="text-xs text-gray-500">Grupos indicados:</span>
                {trabalhosAvaliados.map((t: number) => (
                    <span
                        key={t}
                        className="inline-flex items-center justify-center rounded-full bg-green-100 px-3 py-2 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-200 leading-none"
                    >
                        G{t}
                    </span>
                ))}
            </div>
        </div>
    );
}
