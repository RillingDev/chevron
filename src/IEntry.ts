interface IEntry {
    isBootstrapped: boolean;
    bootstrap: () => void;
    content: any;
}

export { IEntry };
