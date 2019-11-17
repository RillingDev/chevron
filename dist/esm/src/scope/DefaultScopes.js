const singletonScope = (context, injectableEntryName) => `SINGLETON_${injectableEntryName}`;
const prototypeScope = () => null;
const DefaultScopes = {
    SINGLETON: singletonScope,
    PROTOTYPE: prototypeScope
};
export { DefaultScopes };
//# sourceMappingURL=DefaultScopes.js.map