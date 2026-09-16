// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Avaliacao } from "./pages/Avaliacao";
import { Resultados } from "./pages/Resultados";
import "./App.css";

export default function App() {
    return (
        <BrowserRouter>
            {/* Menu simples para testar a navegação via URL sem recarregar a página */}
            {/* <nav className="bg-white border-b border-gray-200 px-4 py-3 mb-6 shadow-sm">
                <div className="max-w-4xl mx-auto flex gap-4 text-sm font-semibold">
                    <Link
                        to="/"
                        className="text-gray-600 hover:text-green-600 transition-colors"
                    >
                        Formulário de Avaliação
                    </Link>
                    <Link
                        to="/resultados"
                        className="text-gray-600 hover:text-green-600 transition-colors"
                    >
                        Ver Resultados
                    </Link>
                </div>
            </nav> */}

            {/* Troca os componentes baseando-se na URL */}
            <main className="container mx-auto px-4">
                <Routes>
                    {/* Rota principal / que abre Avaliacao.tsx */}
                    <Route path="/" element={<Avaliacao />} />

                    {/* Rota /resultados que abre Resultados.tsx */}
                    <Route path="/resultados" element={<Resultados />} />

                    {/* Fallback para URLs desconhecidas */}
                    <Route
                        path="*"
                        element={
                            <div className="text-center py-12 text-gray-500 font-medium">
                                Página não encontrada (404)
                            </div>
                        }
                    />
                </Routes>
            </main>
        </BrowserRouter>
    );
}
