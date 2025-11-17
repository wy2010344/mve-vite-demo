import { fdom, fsvg } from 'mve-dom';
import { zoom, zoomIdentity } from 'd3-zoom';
import { select } from 'd3-selection';
export default function () {
  fdom.div({
    className: 'w-full h-full relative overflow-hidden',
    children(div: HTMLElement) {
      const scene = select(div);
      let t = zoomIdentity; // 当前变换
      const zoomBehavior = zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.1, 3])
        .on('zoom', evt => {
          t = evt.transform;
          scene.attr('transform', t.toString()); // 只改这一行，硬件加速
        });

      fsvg.svg({
        width: '100%',
        height: '100%',
        children(svg: SVGSVGElement) {
          select(svg).call(zoomBehavior);
          fsvg.g({});
        },
      });
    },
  });
}
