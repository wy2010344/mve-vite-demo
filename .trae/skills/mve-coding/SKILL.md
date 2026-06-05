---
name: 'mve-coding'
description:
  '生成 MVE (Modern View Engine) 代码片段，用于当前项目的组件开发、信号管理和 DOM 操作。当用户需要
  MVE 组件代码、响应式状态管理或使用 MVE 的反应系统进行 DOM 操作时调用。'
---

# MVE 编码技能

此技能为当前项目生成 MVE (Modern View Engine) 代码片段，帮助用户高效利用 MVE 的响应式系统和 DOM
API。

## 技能功能

- 生成使用不同 DOM API 风格的 MVE 组件代码（fdom、zdom、dom）
- 创建使用 signals 和 memo 的响应式状态管理
- 实现带有 hookDestroy 的生命周期管理
- 提供常见 UI 模式的代码，如 todo 列表、计时器和表单

## 调用时机

当以下情况时调用此技能：

- 您需要为当前项目创建 MVE 组件
- 您想使用 MVE 的信号系统实现响应式状态管理
- 您需要 MVE 的 DOM API 使用示例
- 您想为 MVE 组件添加生命周期管理

## 使用示例

### 示例 1：创建 Todo 列表组件

**输入：**

```
生成一个使用 fdom 的 todo 列表组件，包含自动清理功能
```

**输出：**

```typescript
import { addEffect, memo, createSignal } from 'wy-helper';
import { fdom } from 'mve-dom';
import { renderArrayKey, renderIf, hookTrackSignal, hookDestroy } from 'mve-helper';
import { renderInput } from 'mve-dom-helper';
function TodoApp() {
  const todos = createSignal([{ id: 1, text: '学习 MVE', done: false }]);
  const text = createSignal('');

  const finishedCount = memo(() => todos.get().filter(t => t.done).length);

  // 追踪完成状态变化
  hookTrackSignal(
    () =>
      todos
        .get()
        .map(t => t.done)
        .join(','),
    newValue => {
      addEffect(() => {
        console.log('完成数变化:', finishedCount());
      });
    }
  );

  // 组件销毁时清理
  hookDestroy(() => {
    console.log('TodoApp 销毁');
  });

  return fdom.div({
    children() {
      renderInput(text.get, text.set, fdom.input());
      fdom.button({
        onClick() {
          todos.set([...todos.get(), { id: Date.now(), text: text.get(), done: false }]);
          text.set('');
        },
        children: '添加 Todo',
      });
      renderArrayKey(
        () => todos.get(),
        item => item.id,
        getItem => {
          fdom.div({
            children() {
              const item = getItem();
              fdom.label({
                children: [
                  fdom.input({
                    type: 'checkbox',
                    checked: item.done,
                    onChange() {
                      const list = todos
                        .get()
                        .map(x => (x.id === item.id ? { ...x, done: !x.done } : x));
                      todos.set(list);
                    },
                  }),
                  ` ${item.text}`,
                ],
              });
            },
          });
        }
      );
      fdom.p({
        childrenType: 'text',
        children: () => `完成: ${finishedCount()}/${todos.get().length}`,
      });
    },
  });
}
```

### 示例 2：创建计时器组件

**输入：**

```
生成一个使用 zdom 的计时器组件
```

**输出：**

```typescript
import { addEffect, memo, createSignal } from 'wy-helper';
import { fdom } from 'mve-dom';
import { renderArrayKey, renderIf, hookTrackSignal, hookDestroy } from 'mve-helper';
import { zdom } from 'mve-dom';

function TimerComponent() {
  const time = createSignal(new Date().toLocaleTimeString());

  addEffect(() => {
    console.log('Timer 组件初始化完成');
  });

  const timer = setInterval(() => {
    time.set(new Date().toLocaleTimeString());
  }, 1000);

  hookDestroy(() => {
    clearInterval(timer);
    console.log('Timer 清理完成');
  });

  return zdom.div({
    children() {
      zdom.p({
        childrenType: 'text',
        children: () => `当前时间: ${time.get()}`,
      });
    },
  });
}
```

### 示例 3：创建表单组件

**输入：**

```
生成一个使用 dom API 的表单组件
```

**输出：**

```typescript
import { addEffect, memo, createSignal } from 'wy-helper';
import { fdom } from 'mve-dom';
import { renderArrayKey, renderIf, hookTrackSignal, hookDestroy } from 'mve-helper';
import { dom } from 'mve-dom';

function FormComponent() {
  const name = createSignal('');
  const email = createSignal('');

  hookTrackSignal(
    () => name.get() + email.get(),
    newValue => {
      console.log('表单数据变化:', newValue);
    }
  );

  hookDestroy(() => {
    console.log('Form 组件销毁');
  });

  return dom.div().render(() => {
    dom
      .form({
        onSubmit(e) {
          e.preventDefault();
          console.log('提交:', { name: name.get(), email: email.get() });
        },
      })
      .render(() => {
        renderInput(
          name.get,
          name.set,
          dom.input({
            placeholder: '姓名',
          })
        );
        renderInput(
          email.get,
          email.set,
          dom.input({
            placeholder: '邮箱',
          })
        );
        dom.button({ type: 'submit', children: '提交' });
      });
  });
}
```

## 可用选项

请求代码生成时，您可以指定：

- **框架**：`fdom`（推荐）、`zdom` 或 `dom`
- **模式**：`quick`（最小代码）或 `detailed`（带有附加功能）
- **自动清理**：`true`（包含 hookDestroy）或 `false`

## 覆盖的核心 MVE 特性

- **响应式系统**：createSignal、memo、hookTrackSignal、addEffect
- **DOM API**：fdom、zdom、dom（不同使用风格）
- **生命周期管理**：hookDestroy
- **常见模式**：Todo 列表、计时器、表单、计数器

此技能旨在帮助您在当前项目中快速实现 MVE 组件，利用 MVE 的响应式系统和 DOM 操作能力。
