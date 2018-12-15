interface IEntry {
    isBootstrapped: boolean;
    bootstrap: (accessStack: Set<string>) => void;
    content: any;
}

export { IEntry };
