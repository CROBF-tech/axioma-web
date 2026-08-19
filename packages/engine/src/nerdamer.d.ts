declare module "nerdamer" {
  interface NerdamerInstance {
    toString(): string;
    toTeX(): string;
    text(): string;
  }
  interface NerdamerStatic {
    (expr: string): NerdamerInstance;
    integrate(expr: string, variable: string): NerdamerInstance;
    diff(expr: string, variable: string): NerdamerInstance;
    limit(expr: string, variable: string, value: string | number): NerdamerInstance;
    simplify(expr: string): NerdamerInstance;
    convertToLaTeX(expr: string): string;
  }
  const nerdamer: NerdamerStatic;
  export default nerdamer;
}