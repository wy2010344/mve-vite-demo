import { fdom, renderText } from 'mve-dom';
import './style.css';
import { addEffect } from 'wy-helper';
export default function () {
  addEffect(() => {
    import('./justification-comparison');
  });

  fdom.div({
    className: 'body',
    children() {
      fdom.div({
        className: 'topbar',
        children() {
          fdom.div({
            children() {
              renderText`Built with`;
              fdom.em({
                childrenType: 'text',
                children: `Pretext`,
              });
              renderText`by`;
              fdom.a({
                href: 'https://dearlarry.co',
                target: '_blank',
                childrenType: 'text',
                children: `Maxwell Ingham`,
              });
              renderText`&nbsp;&nbsp;&nbsp;&nbsp;`;
              fdom.a({
                href: 'https://github.com/somnai-dreams',
                target: '_blank',
                childrenType: 'text',
                children: `GitHub`,
              });
              renderText`&nbsp;&nbsp;&nbsp;&nbsp;`;
              fdom.a({
                href: 'https://twitter.com/somnai_dreams',
                target: '_blank',
                childrenType: 'text',
                children: `Twitter`,
              });
            },
          });
        },
      });
      fdom.div({
        className: 'page',
        children() {
          fdom.h1({
            s_textAlign: 'center',
            childrenType: 'text',
            children: `Justification Algorithms Compared`,
          });
          fdom.p({
            className: 'subtitle',
            s_textAlign: 'center',
            childrenType: 'text',
            children: `Visualizes typography rivers, spacing variance, and how hyphenation and global line-breaking change justified text.`,
          });

          fdom.div({
            className: 'controls',
            children() {
              fdom.label({
                htmlFor: 'widthSlider',
                childrenType: 'text',
                children: `Column width`,
              });
              fdom.input({
                type: 'range',
                id: 'widthSlider',
                min: 200,
                max: 600,
                value: 364,
              });
              fdom.span({
                className: 'width-val',
                id: 'widthVal',
                childrenType: 'text',
                children: `364px`,
              });
              fdom.label({
                className: 'toggle',
                htmlFor: 'showIndicators',
                children() {
                  fdom.input({
                    type: 'checkbox',
                    id: 'showIndicators',
                    checked: true,
                  });
                  fdom.span({
                    childrenType: 'text',
                    children: `Toggle red visualizers`,
                  });
                },
              });
            },
          });
          fdom.div({
            className: 'columns',
            id: 'columns',
            children() {
              fdom.div({
                className: 'column',
                id: 'col0',
                children() {
                  fdom.div({
                    className: 'col-header',
                    childrenType: 'text',
                    children: `CSS / Greedy`,
                  });
                  fdom.div({
                    className: 'col-desc',
                    childrenType: 'text',
                    children: `Native browser justification`,
                  });
                  fdom.div({
                    className: 'css-col',
                    id: 'cssCol',
                    children() {
                      fdom.div({
                        className: 'css-text',
                        id: 'cssText',
                      });
                      fdom.div({
                        className: 'css-river-overlay',
                        id: 'cssRiverOverlay',
                      });
                    },
                  });
                  fdom.div({
                    className: 'metrics',
                    id: 'metrics0',
                  });
                },
              });
              fdom.div({
                className: 'column',
                id: 'col2',
                children() {
                  fdom.div({
                    className: 'col-header',
                    childrenType: 'text',
                    children: `Pretext (Hyphenation)`,
                  });
                  fdom.div({
                    className: 'col-desc',
                    childrenType: 'text',
                    children: `Greedy with syllable-level hyphenation`,
                  });
                  fdom.div({
                    className: 'col-canvas-wrap',
                    children() {
                      fdom.canvas({
                        id: 'c2',
                      });
                    },
                  });
                  fdom.div({
                    className: 'metrics',
                    id: 'metrics2',
                  });
                },
              });
              fdom.div({
                className: 'column',
                id: 'col3',
                children() {
                  fdom.div({
                    className: 'col-header',
                    childrenType: 'text',
                    children: `Pretext (Knuth-Plass)`,
                  });
                  fdom.div({
                    className: 'col-desc',
                    childrenType: 'text',
                    children: `Optimal global line-breaking with syllable hyphenation`,
                  });
                  fdom.div({
                    className: 'col-canvas-wrap',
                    children() {
                      fdom.canvas({
                        id: 'c3',
                      });
                    },
                  });
                  fdom.div({
                    className: 'metrics',
                    id: 'metrics3',
                  });
                },
              });
            },
          });
        },
      });
      fdom.footer({
        className: 'footer',
        children() {
          renderText`Built with Pretext`;
          fdom.span({
            className: 'sep',
            childrenType: 'text',
            children: `&middot;`,
          });
          fdom.a({
            href: 'https://github.com/somnai-dreams',
            target: '_blank',
            childrenType: 'text',
            children: `GitHub`,
          });
          fdom.span({
            className: 'sep',
            childrenType: 'text',
            children: `&middot;`,
          });
          fdom.a({
            href: 'https://twitter.com/somnai_dreams',
            target: '_blank',
            childrenType: 'text',
            children: `@somnai_dreams`,
          });
        },
      });
    },
  });
}
