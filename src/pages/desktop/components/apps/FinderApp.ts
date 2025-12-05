import { fdom } from 'mve-dom';
import { createSignal } from 'wy-helper';
import { panel } from '../WindowManager';

const FILES = [
  {
    name: 'Documents',
    type: 'folder',
    icon: '📁',
    size: '-',
    date: '2024-01-15',
  },
  {
    name: 'Downloads',
    type: 'folder',
    icon: '📥',
    size: '-',
    date: '2024-01-14',
  },
  {
    name: 'Pictures',
    type: 'folder',
    icon: '🖼️',
    size: '-',
    date: '2024-01-13',
  },
  { name: 'Music', type: 'folder', icon: '🎵', size: '-', date: '2024-01-12' },
  {
    name: 'project.zip',
    type: 'file',
    icon: '📦',
    size: '2.4 MB',
    date: '2024-01-11',
  },
  {
    name: 'notes.txt',
    type: 'file',
    icon: '📄',
    size: '12 KB',
    date: '2024-01-10',
  },
  {
    name: 'photo.jpg',
    type: 'file',
    icon: '🖼️',
    size: '1.8 MB',
    date: '2024-01-09',
  },
];

export const FinderApp = panel(function (info) {
  return {
    title: 'Finder',
    children() {
      const selectedFile = createSignal<string | null>(null);

      fdom.div({
        className: 'w-full h-full flex',
        children() {
          // 侧边栏
          fdom.div({
            className: 'w-48 bg-gray-50 border-r border-gray-200 p-3',
            children() {
              fdom.div({
                className: 'text-xs font-semibold text-gray-500 mb-2',
                childrenType: 'text',
                children: 'FAVORITES',
              });
              ['Desktop', 'Documents', 'Downloads', 'Pictures'].forEach(
                item => {
                  fdom.div({
                    className:
                      'px-3 py-1.5 rounded hover:bg-gray-200 cursor-pointer text-sm text-gray-900',
                    childrenType: 'text',
                    children: item,
                  });
                }
              );
            },
          });

          // 文件列表
          fdom.div({
            className: 'flex-1 p-4',
            children() {
              fdom.div({
                className: 'grid grid-cols-1 gap-1',
                children() {
                  FILES.forEach(file => {
                    fdom.div({
                      className:
                        'px-3 py-2 rounded hover:bg-blue-50 cursor-pointer flex items-center gap-3 transition-colors',
                      s_backgroundColor() {
                        return selectedFile.get() === file.name
                          ? '#dbeafe'
                          : '';
                      },
                      onClick() {
                        selectedFile.set(file.name);
                      },
                      children() {
                        fdom.span({
                          className: 'text-2xl',
                          childrenType: 'text',
                          children: file.icon,
                        });
                        fdom.div({
                          className: 'flex-1',
                          children() {
                            fdom.div({
                              className: 'text-sm font-medium text-gray-900',
                              childrenType: 'text',
                              children: file.name,
                            });
                            fdom.div({
                              className: 'text-xs text-gray-600',
                              childrenType: 'text',
                              children: `${file.size} • ${file.date}`,
                            });
                          },
                        });
                      },
                    });
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
