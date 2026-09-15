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
        </div>
    );
}
