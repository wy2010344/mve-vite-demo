import { fdom } from "mve-dom";
import { renderInput } from "mve-dom-helper";
import { createSignal } from "wy-helper";

export default function () {
  fdom.div({
    className: "w-full h-full flex items-center justify-center",
    children() {
      fdom.div({
        className: "bg-white text-black",
        children() {
          const value = createSignal("");

          let t: NodeJS.Timeout;
          renderInput(
            value.get,
            (v) => {
              value.set(v);
              if (t) {
                clearTimeout(t);
              }
              t = setTimeout(() => {
                console.log("fetch...", value.get());
              }, 500);
            },
            fdom.input({
              type: "text",
            })
          );
        },
      });
    },
  });
}
