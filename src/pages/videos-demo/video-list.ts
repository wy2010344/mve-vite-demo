import { AutoLoadMoreCore, GetValue } from "wy-helper";
import { Video } from "./mockData";
import { fdom } from "mve-dom";

export default function (
  get: GetValue<{
    readonly key: "success";
    readonly value: AutoLoadMoreCore<Video, number>;
  }>
) {
  fdom.div({
    className: "relative",
    children() {
      fdom.div({
        className:
          "overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100",
      });
    },
  });
}
