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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<
        "idle" | "success" | "error"
    >("idle");
    const [trabalhoHasObservacoes, setTrabalhoHasObservacoes] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordIsValid, setPasswordIsValid] = useState(false);
    const [numeroEquipeTitulo, setNumeroEquipeTitulo] = useState("");

    const inputPassRef = useRef<HTMLInputElement>(null);
    const { showAlert, AlertComponent } = useAlert();

    // Handlers do Avaliador (Sincroniza E-mail <-> Nome)
    const handleNomeSelect = (nome: string) => {
        setFormData((prev) => ({ ...prev, nomeAvaliador: nome }));
        const avaliador = AVALIADORES.find((a) => a.nome === nome);
        if (avaliador) {
            setFormData((prev) => ({
                ...prev,
                email: `${avaliador.email}`,
            }));
        }
    };

    const handleEmailSelect = (email: string) => {
        setFormData((prev) => ({ ...prev, email }));
        const [emailUsuario] = email;
        const avaliador = AVALIADORES.find((a) => a.email === emailUsuario);
        if (avaliador) {
            setFormData((prev) => ({ ...prev, nomeAvaliador: avaliador.nome }));
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

    // Validação da Senha
    const verificarPalavraPasse = async () => {
        if (passwordIsValid) return true;

        const passwordToValidate = inputPassRef.current?.value || password;
        try {
            const response = await fetch("/api/validate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: passwordToValidate }),
            });

            const data = await response.json();
            if (data.success) {
                setPasswordIsValid(true);
                return true;
            }
        } catch {
            return false;
        }
        return false;
    };

    const handleChangePassword = (val: string) => {
        setPassword(val);
        verificarPalavraPasse();
    };

    // Submit do Formulário
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const isValidPass = await verificarPalavraPasse();
        if (!isValidPass) {
            showAlert("Erro", "Palavra passe incorreta.");
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus("idle");

        try {
            const SCRIPT_ID = import.meta.env.SCRIPT_ID;
            const SCRIPT_URL = `https://script.google.com/macros/s/${SCRIPT_ID}/exec`;

            const payload = {
                email: formData.email,
                nomeAvaliador: formData.nomeAvaliador,
                titulo:
                    formData.titulo.charAt(0).toUpperCase() +
                    formData.titulo.slice(1).toLowerCase(),
                numeroEquipe: formData.numeroEquipe.toLowerCase(),
                dominioTema: formData.dominioTema.replace(".", ","),
                exposicaoOral: formData.exposicaoOral.replace(".", ","),
                usoRecursos: formData.usoRecursos.replace(".", ","),
                cumprimentoProposta: formData.cumprimentoProposta.replace(
                    ".",
                    ",",
                ),
                inovacaoCriatividade: formData.inovacaoCriatividade.replace(
                    ".",
                    ",",
                ),
                observacoes: formData.observacoes,
            };

            await fetch(SCRIPT_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                mode: "no-cors",
            });

            setSubmitStatus("success");
            showAlert(
                "Sucesso",
                `Avaliação do trabalho "${formData.titulo}" enviada com sucesso!`,
            );

            // Limpeza dos campos mantendo o avaliador logado
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
            setNotaFinal(0);
        } catch (error) {
            console.error("Erro no envio:", error);
            setSubmitStatus("error");
            showAlert(
                "Erro",
                "Erro ao enviar formulário. Verifique sua conexão e tente novamente.",
            );
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setSubmitStatus("idle"), 5000);
        }
    };

    return (
        <>
            <div className="bg-white px-2 sm:px-4 lg:px-8 py-6">
                <div className="xl:max-w-2xl mx-auto">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
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
                                    password={password}
                                    passwordIsValid={passwordIsValid}
                                    isSubmitting={isSubmitting}
                                    submitStatus={submitStatus}
                                    inputPassRef={inputPassRef}
                                    onObservacoesChange={(val) =>
                                        handleChangeField("observacoes", val)
                                    }
                                    onPasswordChange={handleChangePassword}
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
