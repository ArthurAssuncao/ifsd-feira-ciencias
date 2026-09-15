import { useState } from "react";
import type { FormData } from "../types/form";

type SubmitStatus = "idle" | "success" | "error";

interface UseSubmitAvaliacaoOptions {
    onSuccess?: (titulo: string) => void;
    onError?: (error: unknown) => void;
}

export function useSubmitAvaliacao(options?: UseSubmitAvaliacaoOptions) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");

    const submitAvaliacao = async (formData: FormData) => {
        setIsSubmitting(true);
        setSubmitStatus("idle");

        try {
            // No Vite as variáveis de ambiente usam VITE_ e import.meta.env
            const scriptId = import.meta.env.VITE_SCRIPT_ID;
            if (!scriptId) {
                throw new Error(
                    "VITE_SCRIPT_ID não está configurado nas variáveis de ambiente.",
                );
            }

            const scriptUrl = `https://script.google.com/macros/s/${scriptId}/exec`;

            const payload = {
                email: formData.email,
                nomeAvaliador: formData.nomeAvaliador,
                titulo:
                    formData.titulo[0].toUpperCase() +
                    formData.titulo.substring(1).toLowerCase(),
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

            console.log("📤 Enviando dados:", payload);

            await fetch(scriptUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
                mode: "no-cors",
            });

            console.log("✅ Requisição enviada com sucesso (no-cors)");
            setSubmitStatus("success");

            // Callback de sucesso
            options?.onSuccess?.(formData.titulo);

            setTimeout(() => {
                setSubmitStatus("idle");
            }, 5000);

            return true;
        } catch (error: unknown) {
            console.error("❌ Erro ao enviar:", error);
            setSubmitStatus("error");

            // Callback de erro
            options?.onError?.(error);

            setTimeout(() => {
                setSubmitStatus("idle");
            }, 5000);

            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        submitAvaliacao,
        isSubmitting,
        submitStatus,
    };
}
