import { fdom } from 'mve-dom';
import { createSignal } from 'wy-helper';
import { panel } from '../WindowManager';

const PHOTOS = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400',
  'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400',
  'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400',
];

export const PhotosApp = panel(function (info) {
  return {
    title: 'Photo',
    children() {
      const selectedPhoto = createSignal<string | null>(null);

      fdom.div({
        className: 'w-full h-full flex flex-col bg-gray-50',
        children() {
          // 工具栏
          fdom.div({
            className:
              'h-12 bg-white border-b border-gray-200 flex items-center px-4 gap-4',
            children() {
              fdom.button({
                className:
                  'text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600',
                childrenType: 'text',
                children: 'All Photos',
              });
              fdom.button({
                className:
                  'text-sm text-gray-700 px-3 py-1 hover:bg-gray-100 rounded',
                childrenType: 'text',
                children: 'Albums',
              });
              fdom.button({
                className:
                  'text-sm text-gray-700 px-3 py-1 hover:bg-gray-100 rounded',
                childrenType: 'text',
                children: 'Favorites',
              });
            },
          });

          // 照片网格
          fdom.div({
            className: 'flex-1 overflow-auto p-4',
            children() {
              fdom.div({
                className: 'grid grid-cols-3 gap-2',
                children() {
                  PHOTOS.forEach(photo => {
                    fdom.div({
                      className:
                        'aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform',
                      onClick() {
                        selectedPhoto.set(photo);
                      },
                      children() {
                        fdom.img({
                          src: photo,
                          className: 'w-full h-full object-cover',
                          alt: 'Photo',
                        });
                      },
                    });
                  });
                },
              });
            },
          });

          // 预览模态框
          fdom.div({
            s_display() {
              return selectedPhoto.get() ? 'flex' : 'none';
            },
            className:
              'fixed inset-0 bg-black/90 z-50 items-center justify-center',
            onClick() {
              selectedPhoto.set(null);
            },
            children() {
              fdom.img({
                src() {
                  return selectedPhoto.get() || '';
                },
                className: 'max-w-[90%] max-h-[90%] object-contain',
                onClick(e) {
                  e.stopPropagation();
                },
              });
              fdom.button({
                className:
                  'absolute top-4 right-4 text-white text-3xl hover:scale-110',
                childrenType: 'text',
                children: '×',
                onClick() {
                  selectedPhoto.set(null);
                },
              });
            },
          });
        },
      });
    },
  };
});
