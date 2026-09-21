"use client";

import { useRef, useState } from "react";
import type { FormData } from "../types/form";
import { AVALIADORES } from "../data/data";
import { EQUIPES } from "../data/data-fixed";
import { HeaderFormulario } from "../components/HeaderFormulario";
import { DadosAvaliadorSection } from "../components/DadosAvaliadorSection";
import { SelecaoTrabalhoSection } from "../components/SelecaoTrabalhoSection";
import { AvaliacaoNotasSection } from "../components/AvaliacaoNotasSection";
import { SubmissaoSection } from "../components/SubmissaoSection";
import { useAlert } from "../hooks/useAlert";
import { useSubmitAvaliacao } from "../hooks/useSubmitAvaliacao";

const CAMPOS_NOTA: (keyof FormData)[] = [
    "dominioTema",
    "exposicaoOral",
    "usoRecursos",
    "cumprimentoProposta",
    "inovacaoCriatividade",
];

export function Avaliacao() {
    const [formData, setFormData] = useState<FormData>({
        email: "",
        nomeAvaliador: "",
        titulo: "",
        numeroEquipe: "",
        dominioTema: "",
        exposicaoOral: "",
        usoRecursos: "",
        cumprimentoProposta: "",
        inovacaoCriatividade: "",
        observacoes: "",
    });

    const [notaFinal, setNotaFinal] = useState<number>(0);
    const [trabalhoHasObservacoes, setTrabalhoHasObservacoes] = useState(false);
    const [numeroEquipeTitulo, setNumeroEquipeTitulo] = useState("");

    const inputPassRef = useRef<HTMLInputElement>(null);
    const { showAlert, AlertComponent } = useAlert();

    const { submitAvaliacao, isSubmitting, submitStatus } = useSubmitAvaliacao({
        onSuccess: (titulo) => {
            showAlert(
                "Sucesso",
                `Avaliação do trabalho ${titulo} enviada com sucesso!`,
            );

            // Limpa os dados específicos do formulário mantendo o avaliador logado
            setFormData((prev) => ({
                ...prev,
                titulo: "",
                numeroEquipe: "",
                dominioTema: "",
                exposicaoOral: "",
                usoRecursos: "",
                cumprimentoProposta: "",
                inovacaoCriatividade: "",
                observacoes: "",
            }));
            setNumeroEquipeTitulo("");
        },
        onError: () => {
            showAlert(
                "Erro",
                "Erro ao enviar formulário. Verifique sua conexão e tente novamente.",
            );
        },
    });

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        await submitAvaliacao(formData);
    };

    // Handlers do Avaliador (Sincroniza E-mail <-> Nome)
    const handleNomeSelect = (nome: string) => {
        const avaliador = AVALIADORES.find(
            (a) => a.nome.toLocaleLowerCase() === nome.toLocaleLowerCase(),
        );

        if (avaliador) {
            setFormData((prev) => ({
                ...prev,
                nomeAvaliador: nome,
                email: `${avaliador.email}`,
            }));
        } else {
            setFormData((prev) => ({ ...prev, nomeAvaliador: nome }));
        }
    };

    const handleEmailSelect = (email: string) => {
        const avaliador = AVALIADORES.find(
            (a) => a.email.toLocaleLowerCase() === email.toLocaleLowerCase(),
        );
        if (avaliador) {
            setFormData((prev) => ({
                ...prev,
                nomeAvaliador: avaliador.nome,
                email: `${avaliador.email}`,
            }));
        } else {
            setFormData((prev) => ({ ...prev, email }));
        }
    };

    // Handler da Equipe / Trabalho
    const handleChangeNumeroEquipeTitulo = (value: string) => {
        setNumeroEquipeTitulo(value);

        if (value.trim().length === 0) {
            setFormData((prev) => ({ ...prev, numeroEquipe: "", titulo: "" }));
            setTrabalhoHasObservacoes(false);
            return;
        }

        const [numeroEquipe, ...rest] = value.split(" - ");
        const titulo = rest.join(" - ");

        const trabalho = EQUIPES.find(
            (t) => t.equipe === numeroEquipe && t.titulo === titulo,
        );

        if (trabalho) {
            setFormData((prev) => ({ ...prev, numeroEquipe, titulo }));
            setTrabalhoHasObservacoes(!!trabalho.hasObservacoes);
        }
    };

    // Handler genérico e cálculo da nota
    const handleChangeField = (field: keyof FormData, value: string) => {
        const updatedForm = { ...formData, [field]: value };

        if (CAMPOS_NOTA.includes(field)) {
            const soma = CAMPOS_NOTA.reduce((acc, currKey) => {
                const val = updatedForm[currKey] as string;
                return acc + (Number(val?.replace(",", ".")) || 0);
            }, 0);
            setNotaFinal(soma);
        }

        setFormData(updatedForm);
    };

    return (
        <>
            <div className="bg-white px-2 sm:px-4 lg:px-8 py-6">
                <div className="xl:max-w-2xl mx-auto">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="px-4 py-6">
                            <HeaderFormulario />

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <DadosAvaliadorSection
                                    nomeAvaliador={formData.nomeAvaliador}
                                    emailAvaliador={formData.email}
                                    onNomeChange={handleNomeSelect}
                                    onEmailChange={handleEmailSelect}
                                />

                                <SelecaoTrabalhoSection
                                    numeroEquipeTitulo={numeroEquipeTitulo}
                                    numeroEquipe={formData.numeroEquipe}
                                    titulo={formData.titulo}
                                    hasObservacoes={trabalhoHasObservacoes}
                                    onChange={handleChangeNumeroEquipeTitulo}
                                />

                                <AvaliacaoNotasSection
                                    formData={formData}
                                    notaFinal={notaFinal}
                                    onNotaChange={handleChangeField}
                                />

                                <SubmissaoSection
                                    observacoes={formData.observacoes}
                                    isSubmitting={isSubmitting}
                                    submitStatus={submitStatus}
                                    inputPassRef={inputPassRef}
                                    onObservacoesChange={(val) =>
                                        handleChangeField("observacoes", val)
                                    }
                                />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <AlertComponent />
        </>
    );
}
