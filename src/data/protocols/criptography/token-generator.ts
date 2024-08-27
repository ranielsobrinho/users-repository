export interface TokenGenerator {
  generate(param: TokenGenerator.Param): Promise<TokenGenerator.Result>
}

export namespace TokenGenerator {
  export type Param = string
  export type Result = string
}
