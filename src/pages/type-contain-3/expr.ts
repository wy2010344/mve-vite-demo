export type Expr = {
  type: "id"
  value: string
} | {
  type: "λ"
  id: string
  body: Expr
} | {
  type: "Π"
  id: string
  idType: Expr
  body: Expr
} | {
  type: "apply"
  fn: Expr
  arg: Expr
} | {
  type: "Σ"
  id: string
  idType: Expr
  body: Expr
} | {
  type: "of"
  expr: Expr
  exprType: Expr
}