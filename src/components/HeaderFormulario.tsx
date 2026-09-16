import logoFeira from "@/assets/logo-feira.png";

export function HeaderFormulario() {
    return (
        <div className="px-4 text-center mb-8">
            <div className="flex items-center justify-center w-full">
                <img
                    src={logoFeira}
                    alt="Logo da Feira de Ciências"
                    width={420}
                    height={50}
                />
            </div>
            <h1 className="text-2xl md:text-lg font-bold text-gray-900 mt-2">
                Formulário de Avaliação
            </h1>
            <p className="text-sm md:text-xs text-gray-600 mt-1">
                Se houver algum problema coom o formulário, use o{" "}
                <a
                    href="https://forms.gle/o5DUELtXM6gRzaJEA"
                    className="text-green-600 hover:text-green-700 underline"
                >
                    Formulário do Google Forms
                </a>
                .
            </p>
        </div>
    );
}
