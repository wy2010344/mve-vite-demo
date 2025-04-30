import { dom, fdom, renderText } from "mve-dom";
import { hookDestroy, hookPromiseSignalLoadMore, renderArrayKey, renderIf, renderOne, renderOneKey } from "mve-helper";
import { buildPoster, discoverMovie, Movie } from "../moviedb/api";
import { observerIntersection } from "wy-dom-helper";
import { FaSortDown, FaSortUp } from "mve-icons/fa";
import { renderSizeSvg } from "../mve-icon";
import { createSignal, GetValue } from "wy-helper";

type SortKey = 'popularity' | 'vote_count' | 'primary_release_date' | 'vote_average' | 'title' | 'revenue' | 'original_title'
export default function () {
  const sortBy = createSignal<{
    key: SortKey,
    dir: 'asc' | 'desc'
  } | undefined>(undefined)
  const { loading, loadMore, get } = hookPromiseSignalLoadMore(() => {
    const sb = sortBy.get()
    return {
      async getAfter(k) {
        const d = await discoverMovie({
          page: k,
          sort_by: sb ? sb.key + '.' + sb.dir : undefined
        })
        return {
          list: d.results,
          nextKey: k + 1,
          hasMore: d.total_pages != k,
          total: d.total_results
        }
      },
      first: 1
    }
  })

  function renderSortButton(key: SortKey, text: string) {
    fdom.button({
      className: 'daisy-btn daisy-btn-ghost daisy-btn-md',
      onClick() {
        const sb = sortBy.get()
        if (sb?.key == key) {
          sortBy.set({
            key,
            dir: sb.dir == 'asc' ? 'desc' : 'asc'
          })
        } else {
          sortBy.set({
            key,
            dir: 'desc'
          })
        }
      },
      children() {
        dom.span().renderTextContent(text)
        renderOne(sortBy.get, function (v) {
          if (v?.key == key) {
            if (v.dir == 'asc') {
              FaSortUp(renderSizeSvg, '20px')
            } else if (v.dir == 'desc') {
              FaSortDown(renderSizeSvg, '20px')
            }
          }
        })
      }
    })
  }

  const columndefs: {
    head(): void
    cell(getValue: GetValue<Movie>, getIndex: GetValue<number>): void
  }[] = [
      {
        head() {
          dom.th().renderText`序号`
        },
        cell(getValue, getIndex) {
          dom.th().renderTextContent(() => getIndex() + 1)
        },
      },
      {
        head() {
          dom.td({
            className: 'min-w-38'
          }).renderText`封面`
        },
        cell(getValue) {
          fdom.td({
            children() {
              fdom.img({
                className: 'inline',
                src() {
                  return buildPoster(getValue().poster_path)
                }
              })
            }
          })
        }
      },
      {
        head() {
          dom.td({
            className: 'max-w-50 min-w-50'
          }).renderText`标题`
        },
        cell(getValue) {
          dom.td().renderTextContent(() => {
            const title = getValue().title
            const ogTitle = getValue().originalTitle
            if (ogTitle && title != ogTitle) {
              return `${title}(${ogTitle})`
            }
            return title
          })

        },
      },
      {
        head() {
          fdom.td({
            className: 'min-w-38',
            children() {
              renderSortButton('popularity', '人气')
            }
          })
        },
        cell(getValue) {
          dom.td().renderTextContent(() => {
            return getValue().popularity
          })
        },
      },
      {
        head() {
          fdom.td({
            className: 'min-w-38 flex flex-col items-center',
            children() {
              renderSortButton('vote_average', '平均得分')
              renderText`/`
              renderSortButton('vote_count', '投票人数')
            }
          })
        },
        cell(getValue) {
          dom.td().renderTextContent(() => {
            const v = getValue()
            return `${v.vote_average} / ${v.vote_count}`
          })
        },
      },
      {
        head() {
          fdom.td({
            className: 'min-w-40',
            children() {

              renderSortButton('primary_release_date', '发布日期')
            }
          })
        },
        cell(getValue) {


          dom.td().renderTextContent(() => {
            return getValue().release_date
          })
        },

      },
      {
        head() {

          dom.td({

            className: 'min-w-40',
          }).renderText`原始语言`
        },
        cell(getValue) {

          dom.td().renderTextContent(() => {
            return getValue().original_language
          })
        },

      },
      {
        head() {
          dom.td({
            className: 'min-w-10',
          }).renderText`分级`
        },
        cell(getValue) {

          dom.td().renderTextContent(() => {
            return getValue().adult ? '成人' : ''
          })
        },

      },
      {
        head() {
          dom.th().renderText`操作`
        },
        cell(getValue, getIndex) {
          fdom.th({
            children() {

            }
          })
        },
      }
    ]

  function renderLoading() {
    return fdom.tr({
      children() {
        fdom.td({
          colSpan: columndefs.length,
          s_textAlign: 'center',
          children() {
            fdom.div({
              className: 'daisy-loading',
            })
          }
        })
      }
    })
  }
  fdom.div({
    className: 'overflow-x-auto w-full',
    children() {
      fdom.table({
        className: 'daisy-table daisy-table-xs daisy-table-pin-rows daisy-table-pin-cols text-center',
        children() {
          renderOneKey(get, v => v?.type, function (key) {
            if (key == 'success') {
              const getValue = () => {
                const v = get()
                if (v?.type == 'success') {
                  return v.value
                }
                throw 'not support'
              }

              fdom.thead({
                children() {
                  fdom.tr({
                    children() {
                      columndefs.forEach(columnDef => {
                        columnDef.head()
                      })
                    }
                  })
                }
              })
              fdom.tbody({
                children() {
                  renderIf(loading, renderLoading)
                  renderArrayKey(() => getValue().list, v => v.id, function (getValue, getIndex) {
                    fdom.tr({
                      children() {
                        columndefs.forEach(columnDef => {
                          columnDef.cell(getValue, getIndex)
                        })
                      }
                    })
                  })
                  renderIf(() => getValue().hasMore, function () {
                    const tr = renderLoading()
                    hookDestroy(observerIntersection((e) => {
                      if (e[0].intersectionRatio > 0) {
                        loadMore()
                      }
                    }, tr))
                  })
                }
              })
              fdom.tfoot({
                children() {
                  fdom.tr({
                    children() {
                      fdom.td({
                        colSpan: columndefs.length,
                        children() {
                          fdom.div({
                            children() {
                              renderText`第${() => getValue().nextKey - 1}条,每页20条,总记录${() => getValue().total}条,共${() => Math.ceil(getValue().total / 20)}页`
                            }
                          })
                        }
                      })
                    }
                  })
                }
              })
            } else if (key == 'error') {

            } else {

            }
          })
        }
      })
    }
  })

}

