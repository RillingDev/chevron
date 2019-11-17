const singletonScoper = (name) => `SINGLETON_${name}`;
const prototypeScoper = () => null;
const Scopes = {
    SINGLETON: singletonScoper,
    PROTOTYPE: prototypeScoper
};
export { Scopes };
//# sourceMappingURL=Scopes.js.map