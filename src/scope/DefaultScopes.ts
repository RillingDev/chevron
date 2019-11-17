const singletonScope = (name: string): string => `SINGLETON_${name}`;

const prototypeScope = (): null => null;

const DefaultScopes = {
    SINGLETON: singletonScope,
    PROTOTYPE: prototypeScope
};

export { DefaultScopes };
