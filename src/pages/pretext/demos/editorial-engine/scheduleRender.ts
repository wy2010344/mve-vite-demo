export function createScheduleRender(render: (now: number) => boolean) {
  let scheduledRaf: number | null = null;
  return function scheduleRender(): void {
    if (scheduledRaf !== null) return;
    scheduledRaf = requestAnimationFrame(
      function renderAndMaybeScheduleEditorialFrame(now) {
        scheduledRaf = null;
        if (render(now)) scheduleRender();
      }
    );
  };
}
