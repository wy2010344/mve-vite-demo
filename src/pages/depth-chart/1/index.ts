import { fdom, fsvg } from 'mve-dom';
import { renderInput } from 'mve-dom-helper';
import { hookOrderBooks } from './getOrderBooks';
import { createSignal, memo } from 'wy-helper';
import { area, scaleLinear, select, zoom } from 'd3';

/**
 * 参考
 * https://www.youtube.com/@karthik947/videos
 * https://github.com/karthik947/BinanceSpotOrderBook/blob/master/Pages/index.js
 * 另https://www.machow.ski/posts/the_death_star_depth_chart/
 * 它的depth chart
 * https://github.com/Is0tope/3D_order_book/blob/master/src/L2Book.ts
 * https://www.3dorderbook.com/
 */
export default function () {
  const coinSymbolPairs = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'];
  const { coinSymbolPair, currentOrderBook } = hookOrderBooks();
  renderInput(
    coinSymbolPair.get,
    coinSymbolPair.set,
    fdom.select({
      className: 'daisy-select',
      children() {
        coinSymbolPairs.forEach(cp => {
          fdom.option({
            value: cp,
            children: cp,
          });
        });
      },
    })
  );

  function accVolumes(list: [number, number][]) {
    return list.reduce<
      {
        price: number;
        amount: number;
        accAmount: number;
      }[]
    >(function (init, row) {
      init.push({
        price: row[0],
        amount: row[1],
        accAmount: (init.at(-1)?.accAmount ?? 0) + row[1],
      });
      return init;
    }, []);
  }
  const get = memo(() => {
    const c = currentOrderBook();
    return {
      asks: accVolumes(c.asks),
      bids: accVolumes(c.bids),
    };
  });

  type Model = {
    price: number;
    amount: number;
    accAmount: number;
  };
  fdom.div({
    children() {
      const width = 800;
      const height = 800;

      const transform = createSignal<any>(undefined);
      const measure = memo(() => {
        const c = get();
        const minPrice = Math.min(
          c.asks[0]?.price ?? Infinity,
          c.bids.at(-1)?.price ?? Infinity
        );
        const maxPrice = Math.max(
          c.asks.at(-1)?.price ?? -Infinity,
          c.bids[0]?.price ?? -Infinity
        );
        const xAxis = scaleLinear()
          .domain([minPrice, maxPrice])
          .range([0, width]);

        console.log('c', c);

        const t = transform.get();
        return {
          xAxis: t ? t.rescaleX(xAxis) : xAxis,
          yAxisA: scaleLinear()
            .domain([
              0,
              //最后一个累积量最大
              Math.max(
                c.bids.at(-1)?.accAmount ?? -Infinity,
                c.asks.at(-1)?.accAmount ?? -Infinity
              ),
            ])
            .range([height, 0]),
          // yAxisO: scaleLinear()
          //   .domain([
          //     0,
          //     //  量上并不知道哪个最大
          //     Math.max(
          //       ...c.bids.map(v => v.amount),
          //       ...c.asks.map(v => v.amount)
          //     ),
          //   ])
          //   .range([height, 0]),
        };
      });
      fsvg.svg({
        viewBox: `0 0 ${width} ${height}`,
        width,
        height,
        children(svg: Element) {
          select(svg).call(
            zoom().on('zoom', e => {
              transform.set(e.transform);
            })
          );
          fsvg.path({
            fill: 'green',
            d() {
              const { yAxisA, xAxis } = measure();
              const dArea = area<Model>()
                .y0(yAxisA(0))
                .x(d => xAxis(d.price))
                .y1(d => yAxisA(d.accAmount));

              return dArea(get().asks) ?? '';
            },
          });
          fsvg.path({
            fill: 'red',
            d() {
              const { yAxisA, xAxis } = measure();
              const dArea = area<Model>()
                .y0(yAxisA(0))
                .x(d => xAxis(d.price))
                .y1(d => yAxisA(d.accAmount));

              return dArea(get().bids) ?? '';
            },
          });
        },
      });
    },
  });
}
