import { createSignal } from "wy-helper";
import "reflect-metadata";
const signalMetaKey = Symbol('signal-meta-key')
export function SignalField(target: any, propertyKey: string) {
  // 在元数据中存储需要转换的字段
  const fields: string[] = Reflect.getMetadata(signalMetaKey, target) || [];
  fields.push(propertyKey);
  Reflect.defineMetadata(signalMetaKey, fields, target);
}
export function SignalClass<T extends { new(...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    constructor(...args: any[]) {
      super(...args);
      // 获取被 @AutoAccessor 标记的字段
      const fields: string[] = Reflect.getMetadata(signalMetaKey, constructor.prototype) || [];
      for (const field of fields) {
        const value = createSignal((this as any)[field]);
        Object.defineProperty(this, field, {
          get: value.get,
          set: value.set,
          configurable: true,
          enumerable: true,
        });
      }
    }
  };
}