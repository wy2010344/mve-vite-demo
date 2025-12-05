import { fdom } from 'mve-dom';
import { createSignal, tween, easeFns } from 'wy-helper';
import { animateSignal } from 'wy-dom-helper';
import { panel } from '../WindowManager';

const SONGS = [
  { title: 'Neon Dreams', artist: 'Synthwave', duration: '3:45' },
  { title: 'Digital Love', artist: 'Electronic', duration: '4:12' },
  { title: 'Midnight City', artist: 'Indie', duration: '3:58' },
  { title: 'Starlight', artist: 'Ambient', duration: '5:23' },
];

export const MusicApp = panel(() => {
  return {
    title: 'Music',
    children() {
      const playing = createSignal(false);
      const currentSong = createSignal(0);
      const rotation = animateSignal(0);

      function togglePlay() {
        playing.set(!playing.get());
        if (playing.get()) {
          // 持续旋转
          const rotate = () => {
            rotation
              .animateTo(
                rotation.get() + 360,
                tween(3000, t => t)
              )
              .then(() => {
                if (playing.get()) rotate();
              });
          };
          rotate();
        } else {
          rotation.stop();
        }
      }

      fdom.div({
        className:
          'w-full h-full flex flex-col bg-gradient-to-br from-purple-500 to-pink-500',
        children() {
          // 专辑封面
          fdom.div({
            className: 'flex-1 flex items-center justify-center',
            children() {
              fdom.div({
                className:
                  'w-48 h-48 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-6xl shadow-2xl',
                s_transform() {
                  return `rotate(${rotation.get()}deg)`;
                },
                childrenType: 'text',
                children: '🎵',
              });
            },
          });

          // 歌曲信息
          fdom.div({
            className: 'text-center text-white mb-6',
            children() {
              fdom.div({
                className: 'text-2xl font-bold mb-1',
                childrenType: 'text',
                children() {
                  return SONGS[currentSong.get()].title;
                },
              });
              fdom.div({
                className: 'text-white/80',
                childrenType: 'text',
                children() {
                  return SONGS[currentSong.get()].artist;
                },
              });
            },
          });

          // 控制按钮
          fdom.div({
            className: 'flex justify-center items-center gap-6 mb-8',
            children() {
              fdom.button({
                className:
                  'text-white text-3xl hover:scale-110 transition-transform',
                childrenType: 'text',
                children: '⏮',
                onClick() {
                  currentSong.set(
                    (currentSong.get() - 1 + SONGS.length) % SONGS.length
                  );
                },
              });
              fdom.button({
                className:
                  'text-white text-5xl hover:scale-110 transition-transform',
                childrenType: 'text',
                children() {
                  return playing.get() ? '⏸' : '▶';
                },
                onClick: togglePlay,
              });
              fdom.button({
                className:
                  'text-white text-3xl hover:scale-110 transition-transform',
                childrenType: 'text',
                children: '⏭',
                onClick() {
                  currentSong.set((currentSong.get() + 1) % SONGS.length);
                },
              });
            },
          });

          // 播放列表
          fdom.div({
            className: 'bg-black/20 backdrop-blur p-4 max-h-40 overflow-auto',
            children() {
              SONGS.forEach((song, idx) => {
                fdom.div({
                  className:
                    'px-3 py-2 rounded hover:bg-white/10 cursor-pointer flex justify-between items-center',
                  s_backgroundColor() {
                    return currentSong.get() === idx
                      ? 'rgba(255,255,255,0.2)'
                      : '';
                  },
                  onClick() {
                    currentSong.set(idx);
                  },
                  children() {
                    fdom.div({
                      className: 'text-white',
                      children() {
                        fdom.div({
                          className: 'font-medium',
                          childrenType: 'text',
                          children: song.title,
                        });
                        fdom.div({
                          className: 'text-sm text-white/70',
                          childrenType: 'text',
                          children: song.artist,
                        });
                      },
                    });
                    fdom.div({
                      className: 'text-white/70 text-sm',
                      childrenType: 'text',
                      children: song.duration,
                    });
                  },
                });
              });
            },
          });
        },
      });
    },
  };
});
