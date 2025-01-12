type Ctor = new (...args: never[]) => object & {
    start?(): void;
};
export declare const Provider: (ctor: Ctor) => void;
export declare const Service: (ctor: Ctor) => void;
export declare const Inject: (property: object, name: string) => void;
export declare function coreStart(): void;
export {};
