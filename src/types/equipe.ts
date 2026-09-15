export interface Membro {
    nome: string;
    ano: string;
    curso: string;
}

export interface Equipe {
    id: string;
    titulo: string;
    equipe: string;
    avaliadores: string[];
    hasObservacoes: boolean;
    membrosEquipe: Membro[];
    orientador: string;
}
