declare namespace Casl {
  export declare type AnyClass<ReturnType = any> = new (
    ...args: any[]
  ) => ReturnType;

  export declare type SubjectClass<N extends string = string> = AnyClass & {
    modelName?: N;
  };
  export declare type AnyObject = Record<PropertyKey, unknown>;
  export declare type SubjectType = string | SubjectClass;
  export declare type Subject = AnyRecord | SubjectType;
}
