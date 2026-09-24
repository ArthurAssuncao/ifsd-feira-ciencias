import { useResultados } from "../hooks/useResultados";
import { toTitleCase } from "../util/string";

export function Resultados() {
    const { resultados, isLoading, error } = useResultados();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-8 text-gray-500">
                Carregando resultados...
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                ❌ {error}
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 bg-green-600 text-white flex justify-between items-center">
                <h2 className="text-xl font-bold">
                    Classificação dos Trabalhos
                </h2>
                <span className="text-xs bg-green-700 px-2.5 py-1 rounded-full font-medium">
                    {resultados.length} Trabalhos
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm text-gray-700">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase text-xs">
                        <tr>
                            <th className="py-3 px-4 w-16 text-center">Pos.</th>
                            <th className="py-3 px-4">Título do Trabalho</th>
                            <th className="py-3 px-4 text-center w-36">
                                Avaliações
                            </th>
                            <th className="py-3 px-4 text-right w-32">
                                Média Final
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {resultados.map((trabalho, index) => (
                            <tr
                                key={index}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                <td className="py-3 px-4 text-center font-bold text-gray-500">
                                    {index + 1}º
                                </td>
                                <td className="py-3 px-4 font-medium text-gray-900">
                                    {toTitleCase(trabalho.titulo)}
                                </td>
                                <td className="py-3 px-4 text-center font-medium text-gray-600">
                                    <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                                        {trabalho.quantidadeAvaliacoes}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-right font-bold text-green-600 text-base">
                                    {trabalho.notaTotal}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
