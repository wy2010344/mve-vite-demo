import { fdom } from "mve-dom";
import { miniCore } from "./mini-core";
import { m2 } from "./m2";

export default function () {

  // miniCore()
  m2()
  fdom.div({
    childrenType: "text",
    children: "abcs"
  })
}