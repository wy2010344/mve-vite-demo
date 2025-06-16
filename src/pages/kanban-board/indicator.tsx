import { cns } from "wy-dom-helper";
import { ColumnContext, TaskContext } from "./type";
import { GetValue } from "wy-helper";
import { mve } from "mve-dom-helper";
import { fdom } from "mve-dom";

export default function ({
  getBeforeId = () => "",
}: {
  getBeforeId?: GetValue<string | undefined>;
}) {
  const { type, getActive } = ColumnContext.consume();

  return (
    <div
      className={function () {
        return cns(
          "my-0.5 h-0.5 w-full bg-violet-400",
          getActive() == getBeforeId() ? "opacity-100" : "opacity-0"
        );
      }}
      data_before={getBeforeId}
      data_column={type}
    ></div>
  );
}
