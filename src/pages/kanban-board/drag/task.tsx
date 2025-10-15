import { GetValue } from 'wy-helper';
import { Task } from '../type';
import { HookRender, If } from '../xmlRender';
import { LuCalendar, LuUser, LuX } from 'mve-icons/lu';
import { renderSizeSvg } from '../../../mve-icon';
import { mve } from 'mve-dom-helper';
import Indicator from './indicator';
import { cns } from 'wy-dom-helper';
import { TaskContext } from './context';
import CardBase from '../cardBase';
export default function ({
  getTask,
  onDelete,
  onDragStart,
}: {
  getTask: GetValue<Task>;
  onDelete(id: string): void;
  onDragStart: (e: DragEvent) => void;
}) {
  const { dragId } = TaskContext.consume();
  mve.renderChild(
    <>
      <Indicator getBeforeId={() => getTask().id} />
      <CardBase
        selected={() => dragId.get() == getTask().id}
        draggable
        onDragStart={onDragStart}
        onDragEnd={e => {
          dragId.set(undefined);
        }}
        onDelete={onDelete}
        getTask={getTask}
      />
    </>
  );
}
