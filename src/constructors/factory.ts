import { dependencyArr } from "../chevron";

const factoryConstructorFn = (content: any, dependencies: dependencyArr) => {
    // Dereference array, because we dont wanna mutate the arg
    const dependenciesArr = Array.from(dependencies);
    // First value gets ignored by calling 'new' like this, so we need to fill it with something
    dependenciesArr.unshift("");

    // Apply into new constructor by binding applying the bind method.
    // @see: {@link http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible }
    const contentNew = new (Function.prototype.bind.apply(
        content,
        dependenciesArr
    ))();

    return contentNew;
};

export { factoryConstructorFn };
