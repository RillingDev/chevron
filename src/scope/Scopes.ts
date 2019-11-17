const singletonScoper = (name: string) => `SINGLETON_${name}`;

const Scopes = {
    SINGLETON: singletonScoper
};

export { Scopes };
