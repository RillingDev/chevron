import { Chevron } from "../Chevron";
import { InjectableType } from "../injectableTypes/InjectableType";
declare const Injectable: (instance: Chevron, name: string, type: InjectableType, dependencies: string[]) => (target: any) => any;
export { Injectable };
