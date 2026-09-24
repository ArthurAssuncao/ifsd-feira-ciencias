import { useEffect, useState } from "react";
import Papa from "papaparse";

export interface ResultadoTrabalho {
    titulo: string;
    quantidadeAvaliacoes: number;
    notaTotal: string;
    notaNumerica: number;
}

interface RowCSV {
    [key: string]: string | undefined; // Permite buscar chaves dinâmicas com segurança
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
                    throw new Error(
                        `Erro ao buscar CSV: ${response.status} ${response.statusText}`,
                    );
                }

                const csvText = await response.text();

                Papa.parse<RowCSV>(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    // CORREÇÃO CRÍTICA: Remove o caractere invisible \uFEFF (BOM) e espaços dos nomes das colunas
                    transformHeader: (header) =>
                        header.trim().replace(/^\uFEFF/, ""),
                    complete: (results) => {
                        console.log(
                            "Linhas processadas pelo PapaParse:",
                            results.data.length,
                        );

                        const parseNota = (valor?: string) => {
                            if (!valor) return 0;
                            return parseFloat(valor.replace(",", ".")) || 0;
                        };

                        const mapaTrabalhos = new Map<
                            string,
                            { somaNotas: number; count: number }
                        >();

                        results.data.forEach((row, index) => {
                            // Busca flexível do título para evitar problemas de acentuação/caixa alta na coluna
                            const chaveTitulo = Object.keys(row).find(
                                (k) =>
                                    k
                                        .toLowerCase()
                                        .includes("título do trabalho") ||
                                    k
                                        .toLowerCase()
                                        .includes("titulo do trabalho"),
                            );

                            const titulo = chaveTitulo
                                ? row[chaveTitulo]?.trim().toLocaleLowerCase()
                                : undefined;

                            if (!titulo) {
                                console.warn(
                                    `Linha ${index + 1} ignorada (sem título):`,
                                    row,
                                );
                                return;
                            }

                            // Busca flexível das notas (case-insensitive)
                            const getValorColuna = (termo: string) => {
                                const chave = Object.keys(row).find((k) =>
                                    k
                                        .toLowerCase()
                                        .includes(termo.toLowerCase()),
                                );
                                return chave ? row[chave] : undefined;
                            };

                            const n1 = parseNota(
                                getValorColuna("Domínio do tema"),
                            );
                            const n2 = parseNota(
                                getValorColuna("Exposição oral"),
                            );
                            const n3 = parseNota(
                                getValorColuna("Uso dos recursos"),
                            );
                            const n4 = parseNota(
                                getValorColuna("Cumprimento da proposta"),
                            );
                            const n5 = parseNota(
                                getValorColuna("Inovação e criatividade"),
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

                        parsedData.sort(
                            (a, b) => b.notaNumerica - a.notaNumerica,
                        );

                        setResultados(parsedData);
                        setIsLoading(false);
                    },
                    error: (err: Error) => {
                        console.error(
                            "Erro ao processar CSV no PapaParse:",
                            err,
                        );
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
