import { fdom } from 'mve-dom';
import { StoreRef } from 'wy-helper';

const filters = [
  { id: '', label: '全部', icon: '🎬' },
  { id: 'entertainment', label: '娱乐', icon: '🎭' },
  { id: 'education', label: '教育', icon: '📚' },
  { id: 'technology', label: '科技', icon: '💻' },
  { id: 'music', label: '音乐', icon: '🎵' },
  { id: 'sports', label: '体育', icon: '⚽' },
  { id: 'gaming', label: '游戏', icon: '🎮' },
  { id: 'news', label: '新闻', icon: '📰' },
];

export default function (activeFilter: StoreRef<string>) {
  fdom.div({
    className:
      'flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300',
    children() {
      filters.forEach(filter => {
        fdom.button({
          onClick() {
            activeFilter.set(filter.id);
          },
          className() {
            return `flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 ${
              activeFilter.get() === filter.id
                ? 'bg-blue-600 text-white shadow-md transform scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
            }`;
          },
          children() {
            fdom.span({
              className: 'text-sm',
              children: filter.icon,
            });
            fdom.span({
              className: 'font-medium',
              children: filter.label,
            });
          },
        });
      });
    },
  });
}
