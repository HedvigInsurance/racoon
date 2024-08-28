export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends (infer ElementType)[] ? ElementType : never
