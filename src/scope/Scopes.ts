const singletonScoper = (name: string): string => `SINGLETON_${name}`;

const prototypeScoper = (): null => null;

const Scopes = {
    SINGLETON: singletonScoper,
    PROTOTYPE: prototypeScoper
};

export { Scopes };
