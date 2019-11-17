const singletonScope = (context: any, injectableEntryName: string): string =>
    `SINGLETON_${injectableEntryName}`;

const prototypeScope = (): null => null;

const DefaultScopes = {
    SINGLETON: singletonScope,
    PROTOTYPE: prototypeScope
};

export { DefaultScopes };
