"use client";

import { useEffect, useRef, useState, useMemo } from "react";

interface AutoCompleteInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: string[];
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    observacao?: string;
}

export function AutoCompleteInput({
    label,
    value,
    onChange,
    options,
    placeholder,
    required,
    disabled = false,
    observacao,
}: AutoCompleteInputProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    const inputRef = useRef<HTMLInputElement>(null);
    const listboxRef = useRef<HTMLDivElement>(null);

    // 1. Calculamos a lista filtrada DIRETAMENTE na renderização
    // O uso do useMemo garante que só filtra quando 'value' ou 'options' mudarem.
    const filteredOptions = useMemo(() => {
        if (!value) return options;
        return options.filter((option) =>
            option.toLowerCase().includes(value.toLowerCase()),
        );
    }, [value, options]);

    // Fechar dropdown quando clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                inputRef.current &&
                !inputRef.current.contains(event.target as Node) &&
                listboxRef.current &&
                !listboxRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (option: string) => {
        onChange(option);
        setIsOpen(false);
        setHighlightedIndex(-1);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
        setIsOpen(true);
        setHighlightedIndex(-1); // Reseta o índice destacado ao digitar
    };

    const handleInputFocus = () => {
        if (!disabled) setIsOpen(true);
    };

    const handleClickApagar = () => {
        onChange("");
        setIsOpen(true);
        setHighlightedIndex(-1);
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isOpen) {
            if (e.key === "ArrowDown") setIsOpen(true);
            return;
        }

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setHighlightedIndex((prev) =>
                    prev < filteredOptions.length - 1 ? prev + 1 : prev,
                );
                break;

            case "ArrowUp":
                e.preventDefault();
                setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
                break;

            case "Enter":
                e.preventDefault();
                if (
                    highlightedIndex >= 0 &&
                    highlightedIndex < filteredOptions.length
                ) {
                    handleSelect(filteredOptions[highlightedIndex]);
                }
                break;

            case "Escape":
                setIsOpen(false);
                setHighlightedIndex(-1);
                break;
        }
    };

    return (
        <div className="relative w-full">
            <label className="block text-sm font-medium text-gray-800 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            <div className="relative flex items-center">
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    className="h-10 w-full pl-3 pr-9 py-2 border border-gray-300 rounded-md shadow-sm text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed placeholder:text-gray-400"
                    aria-autocomplete="list"
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                />

                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-gray-400">
                    {value.length > 0 && !disabled ? (
                        <button
                            type="button"
                            onClick={handleClickApagar}
                            className="p-1 rounded-full hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
                            title="Limpar campo"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    ) : (
                        <svg
                            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    )}
                </div>
            </div>

            {observacao && (
                <p className="text-xs text-gray-500 mt-1">{observacao}</p>
            )}

            {isOpen && (
                <div
                    ref={listboxRef}
                    className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto text-sm text-gray-800"
                    role="listbox"
                >
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option, index) => (
                            <div
                                key={option + index}
                                role="option"
                                aria-selected={index === highlightedIndex}
                                className={`px-3 py-2 cursor-pointer transition-colors ${
                                    index === highlightedIndex
                                        ? "bg-green-100 text-green-900 font-medium"
                                        : "hover:bg-gray-50 text-gray-700"
                                }`}
                                onMouseDown={() => handleSelect(option)}
                                onMouseEnter={() => setHighlightedIndex(index)}
                            >
                                {option}
                            </div>
                        ))
                    ) : (
                        <div className="px-3 py-2 text-gray-400 italic">
                            Nenhum resultado encontrado
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
