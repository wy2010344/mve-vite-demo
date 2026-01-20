import { runGlobalHolder } from 'mve-core';
import { hookTrackSignal } from 'mve-helper';
import {
  createSignal,
  emptyArray,
  memo,
  ValueOrGet,
  valueOrGetToGet,
} from 'wy-helper';

type MessageModel = {
  e: string;
  E: number;
  s: string;
  U: number;
  u: number;
  b: [string, string][];
  a: [string, string][];
};
type OrderBookModel = {
  bids: [number, number][];
  asks: [number, number][];
  buffer: MessageModel[];
  lastUpdateId: number;
  symbolPair: string;
};
export function hookOrderBooks(
  coinSymbolPair = createSignal('BTCUSDT'),
  _group: ValueOrGet<number> = 0.1
) {
  const getGroup = valueOrGetToGet(_group);
  const currentOrderBook = createSignal<OrderBookModel>({
    bids: emptyArray,
    asks: emptyArray,
    buffer: emptyArray,
    lastUpdateId: 0,
    symbolPair: '',
  });
  const reConnectAt = createSignal(Date.now());
  hookTrackSignal(() => {
    const symbol = coinSymbolPair.get();
    currentOrderBook.set({
      bids: emptyArray,
      asks: emptyArray,
      buffer: emptyArray,
      symbolPair: symbol,
      lastUpdateId: 0,
    });
    reConnectAt.get(); //触发刷新
    const socket = new WebSocket(
      `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@depth`
    );

    function refresh() {
      // socket.close();
      reConnectAt.set(Date.now());
    }
    async function init() {
      try {
        const query = new URLSearchParams();
        query.set(
          'url',
          `https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=1000`
        );
        const resp = await fetch(
          `https://silent-union-5853.wangyang2010344-dae.workers.dev?${query.toString()}`
        );
        const json: {
          asks: [string, string][];
          bids: [string, string][];
          lastUpdateId: number;
        } = await resp.json();
        const c = currentOrderBook.get();
        if (c.symbolPair != symbol) {
          return;
        }
        currentOrderBook.set({
          ...c,
          lastUpdateId: json.lastUpdateId,
          asks: json.asks.map(pairToNumber),
          bids: json.bids.map(pairToNumber),
        });
      } catch (err) {
        console.log('err', err);
        refresh();
      }
    }
    socket.addEventListener('message', e => {
      const json: MessageModel = JSON.parse(e.data);
      const c = currentOrderBook.get();
      if (c.symbolPair != symbol) {
        return;
      }
      if (c.symbolPair != json.s) {
        return;
      }
      if (c.lastUpdateId) {
        let up: undefined | OrderBookModel;
        if (c.buffer.length) {
          //处理历史缓存
          const nextUpdateId = c.lastUpdateId + 1;
          let fpidx = c.buffer.findIndex(
            d => d.U <= nextUpdateId && d.u >= nextUpdateId
          );
          if (fpidx < 0) {
            currentOrderBook.set({
              ...c,
              buffer: [...c.buffer, json],
            });
            return;
          }
          up = {
            ...c,
            asks: [...c.asks],
            bids: [...c.bids],
          };
          up.buffer = emptyArray;
          //这里重置一下
          up.lastUpdateId = c.buffer[fpidx].U - 1;
          while (up && fpidx < c.buffer.length) {
            const buffer = c.buffer[fpidx];
            up = mergeTo(buffer, up);
            fpidx++;
          }
          if (!up) {
            console.warn('Orderbook 同步失败');
            refresh();
            return;
          }
        } else {
          up = {
            ...c,
            asks: [...c.asks],
            bids: [...c.bids],
          };
        }
        //实时
        up = mergeTo(json, up);
        if (!up) {
          console.warn('Orderbook 同步失败', json, up);
          refresh();
          return;
        }
        lastDeal(up);
        currentOrderBook.set(up);
      } else {
        if (!c.buffer.length) {
          //初始化
          init();
        }
        currentOrderBook.set({
          ...c,
          buffer: [...c.buffer, json],
        });
        socket.close();
      }
      // console.log('message', e);
    });
    return function () {
      socket.close();
    };
  });
  return {
    coinSymbolPair,
    // refresh,
    currentOrderBook: memo(function () {
      const data = currentOrderBook.get();
      const group = getGroup();
      return {
        ...data,
        asks: toGroup(data.asks, group)
          .sort((a, b) => a[0] - b[0])
          .slice(0, 1000),
        bids: toGroup(data.bids, group)
          .sort((a, b) => b[0] - a[0])
          .slice(0, 1000),
      };
    }),
  };
}

function toGroup(vs: [number, number][], group: number) {
  return vs.reduce<[number, number][]>((init, [_price, amount]) => {
    const price = Math.round(_price / group) * group;
    const old = init.find(x => x[0] == price);
    if (old) {
      old[1] = old[1] + amount;
    } else {
      init.push([price, amount]);
    }
    return init;
  }, []);
}

function mergeTo(json: MessageModel, c: OrderBookModel) {
  if (json.U != c.lastUpdateId + 1) {
    return;
  }
  json.b.forEach(b => {
    const bid = pairToNumber(b);
    const idx = c.bids.findIndex(x => x[0] == bid[0]);
    if (idx < 0) {
      c.bids.push(bid);
    } else {
      c.bids[idx] = bid;
    }
  });
  json.a.forEach(a => {
    const ask = pairToNumber(a);
    const idx = c.bids.findIndex(x => x[0] == ask[0]);
    if (idx < 0) {
      c.asks.push(ask);
    } else {
      c.asks[idx] = ask;
    }
  });
  c.lastUpdateId = json.u;
  return c;
}

function lastDeal(c: OrderBookModel) {
  c.bids = c.bids.filter(x => x[1]);
  c.asks = c.asks.filter(x => x[1]);
}

function pairToNumber(n: [string, string]) {
  return n.map(Number) as [number, number];
}
