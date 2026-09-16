import { useEffect, useState } from "react";
import Papa from "papaparse";

export interface ResultadoTrabalho {
    titulo: string;
    quantidadeAvaliacoes: number; // Nova propriedade
    notaTotal: string;
    notaNumerica: number;
}

interface RowCSV {
    "Título do trabalho"?: string;
    "Domínio do tema"?: string;
    "Exposição oral e integração da equipe"?: string;
    "Uso dos recursos empregados e qualidade do material"?: string;
    "Cumprimento da proposta e organização da equipe"?: string;
    "Inovação e criatividade"?: string;
}

export function useResultados() {
    const [resultados, setResultados] = useState<ResultadoTrabalho[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCSV = async () => {
            try {
                setIsLoading(true);
                const url = import.meta.env
                    .VITE_LINK_PLANILHA_RESULTADO_COMPLETO;

                if (!url) {
                    throw new Error(
                        "Variável VITE_LINK_PLANILHA_RESULTADO_COMPLETO não configurada.",
                    );
                }

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error("Erro ao carregar os dados da planilha.");
                }

                const csvText = await response.text();

                Papa.parse<RowCSV>(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        const parseNota = (valor?: string) => {
                            if (!valor) return 0;
                            return parseFloat(valor.replace(",", ".")) || 0;
                        };

                        // Agrupador por Título do Trabalho
                        const mapaTrabalhos = new Map<
                            string,
                            { somaNotas: number; count: number }
                        >();

                        results.data.forEach((row) => {
                            const titulo = row["Título do trabalho"]?.trim();
                            if (!titulo) return;

                            const n1 = parseNota(row["Domínio do tema"]);
                            const n2 = parseNota(
                                row["Exposição oral e integração da equipe"],
                            );
                            const n3 = parseNota(
                                row[
                                    "Uso dos recursos empregados e qualidade do material"
                                ],
                            );
                            const n4 = parseNota(
                                row[
                                    "Cumprimento da proposta e organização da equipe"
                                ],
                            );
                            const n5 = parseNota(
                                row["Inovação e criatividade"],
                            );

                            const somaIndividual = n1 + n2 + n3 + n4 + n5;
                            const mediaIndividual = somaIndividual / 5;

                            if (mapaTrabalhos.has(titulo)) {
                                const atual = mapaTrabalhos.get(titulo)!;
                                mapaTrabalhos.set(titulo, {
                                    somaNotas:
                                        atual.somaNotas + mediaIndividual,
                                    count: atual.count + 1,
                                });
                            } else {
                                mapaTrabalhos.set(titulo, {
                                    somaNotas: mediaIndividual,
                                    count: 1,
                                });
                            }
                        });

                        // Monta o array final com a média geral do trabalho e a contagem de avaliações
                        const parsedData: ResultadoTrabalho[] = Array.from(
                            mapaTrabalhos.entries(),
                        ).map(([titulo, dados]) => {
                            const mediaGeral = dados.somaNotas / dados.count;

                            return {
                                titulo,
                                quantidadeAvaliacoes: dados.count,
                                notaNumerica: mediaGeral,
                                notaTotal: mediaGeral.toFixed(1),
                            };
                        });

                        // Ordena do 1º ao último lugar
                        parsedData.sort(
                            (a, b) => b.notaNumerica - a.notaNumerica,
                        );

                        setResultados(parsedData);
                        setIsLoading(false);
                    },
                    error: (err: Error) => {
                        setError(err.message);
                        setIsLoading(false);
                    },
                });
            } catch (err: unknown) {
                const msg =
                    err instanceof Error ? err.message : "Erro desconhecido";
                setError(msg);
                setIsLoading(false);
            }
        };

        fetchCSV();
    }, []);

    return { resultados, isLoading, error };
}
