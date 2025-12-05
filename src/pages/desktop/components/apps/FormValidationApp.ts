import { fdom } from 'mve-dom';
import { createSignal, addEffect } from 'wy-helper';
import { panel } from '../WindowManager';

/**
 * 复杂表单验证 - 业务中最常见也最容易出错的场景
 * 难点：
 * 1. 多字段联动验证
 * 2. 异步验证（如用户名重复检查）
 * 3. 验证时机控制（onChange vs onBlur）
 * 4. 错误信息展示
 * 5. 表单状态管理
 */

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  age: string;
  phone: string;
  agreement: boolean;
}

interface FormErrors {
  [key: string]: string;
}

export const FormValidationApp = panel(function (info) {
  return {
    title: '复杂表单验证',
    icon: '📝',
    width: 700,
    height: 800,
    children() {
      const formData = createSignal<FormData>({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        age: '',
        phone: '',
        agreement: false,
      });

      const errors = createSignal<FormErrors>({});
      const touched = createSignal<Set<string>>(new Set());
      const isSubmitting = createSignal(false);
      const submitSuccess = createSignal(false);
      const asyncValidating = createSignal<Set<string>>(new Set());

      // 验证规则
      const validators = {
        username: async (value: string) => {
          if (!value) return '用户名不能为空';
          if (value.length < 3) return '用户名至少3个字符';
          if (!/^[a-zA-Z0-9_]+$/.test(value))
            return '用户名只能包含字母、数字和下划线';

          // 模拟异步验证（检查用户名是否已存在）
          asyncValidating.set(new Set(asyncValidating.get()).add('username'));
          await new Promise(resolve => setTimeout(resolve, 500));
          asyncValidating.set(
            new Set([...asyncValidating.get()].filter(k => k !== 'username'))
          );

          if (value.toLowerCase() === 'admin') return '该用户名已被占用';
          return '';
        },
        email: (value: string) => {
          if (!value) return '邮箱不能为空';
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
            return '邮箱格式不正确';
          return '';
        },
        password: (value: string) => {
          if (!value) return '密码不能为空';
          if (value.length < 6) return '密码至少6个字符';
          if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
            return '密码必须包含大小写字母和数字';
          }
          return '';
        },
        confirmPassword: (value: string) => {
          if (!value) return '请确认密码';
          if (value !== formData.get().password) return '两次密码输入不一致';
          return '';
        },
        age: (value: string) => {
          if (!value) return '年龄不能为空';
          const age = parseInt(value);
          if (isNaN(age)) return '年龄必须是数字';
          if (age < 18 || age > 100) return '年龄必须在18-100之间';
          return '';
        },
        phone: (value: string) => {
          if (!value) return '手机号不能为空';
          if (!/^1[3-9]\d{9}$/.test(value)) return '手机号格式不正确';
          return '';
        },
        agreement: (value: boolean) => {
          if (!value) return '请阅读并同意用户协议';
          return '';
        },
      };

      // 验证单个字段
      async function validateField(field: keyof FormData) {
        const validator = (validators as any)[field];
        if (!validator) return;

        const value = (formData.get() as any)[field];
        const error = await validator(value);

        const newErrors = { ...errors.get() };
        if (error) {
          newErrors[field] = error;
        } else {
          delete newErrors[field];
        }
        errors.set(newErrors);
      }

      // 验证所有字段
      async function validateAll() {
        const data = formData.get();
        const newErrors: any = {};

        for (const field of Object.keys(validators)) {
          const validator = (validators as any)[field];
          const error = await validator((data as any)[field]);
          if (error) {
            newErrors[field] = error;
          }
        }

        errors.set(newErrors);
        return Object.keys(newErrors).length === 0;
      }

      // 标记字段为已触摸
      function markTouched(field: string) {
        const newTouched = new Set(touched.get());
        newTouched.add(field);
        touched.set(newTouched);
      }

      // 提交表单
      async function handleSubmit() {
        // 标记所有字段为已触摸
        touched.set(new Set(Object.keys(validators)));

        const isValid = await validateAll();
        if (!isValid) return;

        isSubmitting.set(true);

        // 模拟提交
        await new Promise(resolve => setTimeout(resolve, 1500));

        isSubmitting.set(false);
        submitSuccess.set(true);

        setTimeout(() => {
          submitSuccess.set(false);
          // 重置表单
          formData.set({
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            age: '',
            phone: '',
            agreement: false,
          });
          errors.set({});
          touched.set(new Set());
        }, 2000);
      }

      // 密码变化时重新验证确认密码
      addEffect(() => {
        const data = formData.get();
        if (touched.get().has('confirmPassword') && data.confirmPassword) {
          validateField('confirmPassword');
        }
      });

      fdom.div({
        className:
          'w-full h-full flex flex-col bg-gradient-to-br from-blue-50 to-purple-50',
        children() {
          // 标题
          fdom.div({
            className:
              'h-16 bg-white border-b border-gray-200 flex items-center px-6',
            children() {
              fdom.h2({
                className: 'text-xl font-bold text-gray-800',
                childrenType: 'text',
                children: '用户注册表单',
              });
            },
          });

          // 表单内容
          fdom.div({
            className: 'flex-1 overflow-auto p-6',
            children() {
              fdom.div({
                className:
                  'max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8',
                children() {
                  // 用户名
                  renderField({
                    label: '用户名',
                    field: 'username',
                    type: 'text',
                    placeholder: '请输入用户名（试试输入 admin）',
                    formData,
                    errors,
                    touched,
                    asyncValidating,
                    validateField,
                    markTouched,
                  });

                  // 邮箱
                  renderField({
                    label: '邮箱',
                    field: 'email',
                    type: 'email',
                    placeholder: '请输入邮箱',
                    formData,
                    errors,
                    touched,
                    asyncValidating,
                    validateField,
                    markTouched,
                  });

                  // 密码
                  renderField({
                    label: '密码',
                    field: 'password',
                    type: 'password',
                    placeholder: '至少6位，包含大小写字母和数字',
                    formData,
                    errors,
                    touched,
                    asyncValidating,
                    validateField,
                    markTouched,
                  });

                  // 确认密码
                  renderField({
                    label: '确认密码',
                    field: 'confirmPassword',
                    type: 'password',
                    placeholder: '请再次输入密码',
                    formData,
                    errors,
                    touched,
                    asyncValidating,
                    validateField,
                    markTouched,
                  });

                  // 年龄和手机号（一行两列）
                  fdom.div({
                    className: 'grid grid-cols-2 gap-4',
                    children() {
                      renderField({
                        label: '年龄',
                        field: 'age',
                        type: 'number',
                        placeholder: '18-100',
                        formData,
                        errors,
                        touched,
                        asyncValidating,
                        validateField,
                        markTouched,
                      });

                      renderField({
                        label: '手机号',
                        field: 'phone',
                        type: 'tel',
                        placeholder: '请输入手机号',
                        formData,
                        errors,
                        touched,
                        asyncValidating,
                        validateField,
                        markTouched,
                      });
                    },
                  });

                  // 用户协议
                  fdom.div({
                    className: 'mb-6',
                    children() {
                      fdom.label({
                        className: 'flex items-start gap-2 cursor-pointer',
                        children() {
                          fdom.input({
                            type: 'checkbox',
                            className: 'mt-1',
                            checked() {
                              return formData.get().agreement;
                            },
                            onInput(e: any) {
                              const data = formData.get();
                              formData.set({
                                ...data,
                                agreement: e.target.checked,
                              });
                              markTouched('agreement');
                              validateField('agreement');
                            },
                          });
                          fdom.span({
                            className: 'text-sm text-gray-600',
                            childrenType: 'text',
                            children:
                              '我已阅读并同意《用户协议》和《隐私政策》',
                          });
                        },
                      });
                      fdom.div({
                        s_display() {
                          return touched.get().has('agreement') &&
                            errors.get().agreement
                            ? 'block'
                            : 'none';
                        },
                        className: 'text-red-500 text-xs mt-1',
                        childrenType: 'text',
                        children() {
                          return errors.get().agreement || '';
                        },
                      });
                    },
                  });

                  // 提交按钮
                  fdom.button({
                    className:
                      'w-full py-3 rounded-lg font-medium text-white transition-colors',
                    s_backgroundColor() {
                      return isSubmitting.get() ? '#9ca3af' : '#3b82f6';
                    },
                    s_cursor() {
                      return isSubmitting.get() ? 'not-allowed' : 'pointer';
                    },
                    disabled() {
                      return isSubmitting.get();
                    },
                    onClick: handleSubmit,
                    childrenType: 'text',
                    children() {
                      if (isSubmitting.get()) return '提交中...';
                      if (submitSuccess.get()) return '✓ 注册成功！';
                      return '注册';
                    },
                  });

                  // 表单状态提示
                  fdom.div({
                    className: 'mt-4 text-center text-sm text-gray-500',
                    children() {
                      fdom.div({
                        childrenType: 'text',
                        children() {
                          const errorCount = Object.keys(errors.get()).length;
                          if (errorCount > 0) {
                            return `还有 ${errorCount} 个字段需要修正`;
                          }
                          return '所有字段验证通过 ✓';
                        },
                      });
                    },
                  });
                },
              });
            },
          });
        },
      });
    },
  };
});

// 渲染表单字段
function renderField({
  label,
  field,
  type,
  placeholder,
  formData,
  errors,
  touched,
  asyncValidating,
  validateField,
  markTouched,
}: any) {
  fdom.div({
    className: 'mb-4',
    children() {
      fdom.label({
        className: 'block text-sm font-medium text-gray-700 mb-1',
        childrenType: 'text',
        children: label,
      });

      fdom.div({
        className: 'relative',
        children() {
          fdom.input({
            type,
            placeholder,
            className:
              'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all',
            s_borderColor() {
              if (touched.get().has(field) && errors.get()[field]) {
                return '#ef4444';
              }
              return '#d1d5db';
            },
            value() {
              return formData.get()[field];
            },
            onInput(e: any) {
              const data = formData.get();
              formData.set({ ...data, [field]: e.target.value });
            },
            onBlur() {
              markTouched(field);
              validateField(field);
            },
          });

          // 异步验证加载指示器
          fdom.div({
            s_display() {
              return asyncValidating.get().has(field) ? 'block' : 'none';
            },
            className: 'absolute right-3 top-1/2 -translate-y-1/2',
            children() {
              fdom.div({
                className:
                  'w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin',
              });
            },
          });
        },
      });

      // 错误信息
      fdom.div({
        s_display() {
          return touched.get().has(field) && errors.get()[field]
            ? 'block'
            : 'none';
        },
        className: 'text-red-500 text-xs mt-1',
        childrenType: 'text',
        children() {
          return errors.get()[field] || '';
        },
      });
    },
  });
}
