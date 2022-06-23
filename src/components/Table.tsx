import type { FC } from 'react';
import { useState } from 'react';
import { cx } from '@linaria/core';
import { css } from '@linaria/atomic';

const styles = {
  container: css`
    --scroll-position: 0;
    --scroll-position-unit: calc(var(--scroll-position) * 1px);

    overflow-x: auto;
    width: 100%;
  `,
  table: css`
    --border-width: 1px;
    --border-color: rgba(0, 0, 0, 0.06);
    --padding: 1em;
    --heading-bg: #fafafa;
    --cell-bg: #fff;

    border-collapse: border;
    table-layout: fixed;
    width: 100%;
  `,
  th: css`
    background: var(--heading-bg);
    border-bottom: var(--border-width) solid var(--border-color);
    font-weight: 500;
    padding: var(--padding);
    position: relative;
    text-transform: none;
    transition: background 0.3s ease;

    &::before {
      background: var(--border-color);
      content: '';
      height: 1.6em;
      pointer-events: none;
      position: absolute;
      right: 0;
      top: 50%;
      transform: translate(-50%, -50%);
      transition: inherit;
      width: var(--border-width);
    }
  `,
  'th-sticky': css`
    left: 0;
    position: sticky;
    z-index: 1;
  `,
  'th-sticky-pseudos': css`
    &::before {
      width: calc(var(--border-width) - var(--scroll-position-unit));
    }

    &::after {
      --w: min(10px, var(--scroll-position-unit));

      box-shadow: inset var(--w) 0 8px -8px #00000026;
      content: '';
      height: 100%;
      position: absolute;
      right: 0;
      top: 0;
      transform: translateX(100%);
      width: 1em;
    }
  `,
  'th-btn': css`
    padding: 0;
  `,
  'th-sorted': css`
    background: rgba(0, 0, 0, 0.04);
  `,
  td: css`
    background: var(--cell-bg);
    border-bottom: var(--border-width) solid var(--border-color);
    padding: var(--padding);
  `,
  'td-sorted': css`
    background: var(--heading-bg);
  `,
  'td-sticky': css`
    left: 0;
    position: sticky;
    z-index: 1;

    &::after {
      --w: min(10px, var(--scroll-position-unit));

      box-shadow: inset var(--w) 0 8px -8px #00000026;
      content: '';
      height: 100%;
      position: absolute;
      right: 0;
      top: 0;
      transform: translateX(100%);
      width: 1em;
    }
  `,
  'td-sticky-pseudos': css`
    &::after {
      --w: min(10px, var(--scroll-position-unit));

      box-shadow: inset var(--w) 0 8px -8px #00000026;
      content: '';
      height: 100%;
      position: absolute;
      right: 0;
      top: 0;
      transform: translateX(100%);
      width: 1em;
    }
  `,
  button: css`
    background: none;
    cursor: pointer;
    display: grid;
    gap: calc(var(--padding) / 2);
    grid-template-columns: 1fr auto;
    font: inherit;
    height: calc(100%);
    padding: var(--padding);
    position: relative;
    transition: inherit;
    width: 100%;

    &:hover {
      background: rgba(0, 0, 0, 0.04);
    }
  `,
  'button-svg': css`
    grid-column: 2;
    grid-row: 1;
    fill: #bfbfbf;
    height: 1em;
    position: relative;
    top: 50%;
    width: 1em;

    &:first-of-type {
      transform: translateY(-53%);
    }

    &:last-of-type {
      transform: translateY(-47%);
    }
  `,
  'button-svg-active': css`
    fill: #1890ff;
  `,
};

const HeaderButton: FC<{ dir?: boolean; onClick: () => void }> = ({ children, dir, onClick }) => (
  <button className={styles.button} onClick={onClick} type="button">
    {children}
    <svg
      className={cx(styles['button-svg'], dir && styles['button-svg-active'])}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 28"
    >
      <path d="M16 11c0 .547-.453 1-1 1H1c-.547 0-1-.453-1-1a.99.99 0 0 1 .297-.703l7-7C7.484 3.11 7.735 3 8 3s.516.109.703.297l7 7A.996.996 0 0 1 16 11z" />
    </svg>
    <svg
      className={cx(styles['button-svg'], dir === false && styles['button-svg-active'])}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 28"
    >
      <path d="M16 17a.99.99 0 0 1-.297.703l-7 7C8.516 24.89 8.265 25 8 25s-.516-.109-.703-.297l-7-7A.996.996 0 0 1 0 17c0-.547.453-1 1-1h14c.547 0 1 .453 1 1z" />
    </svg>
  </button>
);

type Key = string | number;

interface TableColumn {
  key: Key;
  label: string;
  title?: string;
  fixed?: boolean;
  sort?: (a: any, b: any) => number;
}

interface TableDataSource {
  key: Key;
  [x: string]: any;
}

interface TableProps {
  columns: TableColumn[];
  dataSource: TableDataSource[];
}

export function Table({ columns, dataSource }: TableProps) {
  const [[sortKey, sortDir], setSortOn] = useState<[Key, boolean | undefined]>(['', undefined]);
  const [scrollLeft, setScrollLeft] = useState(0);
  const setSortKey = (key: Key) => {
    if (sortKey === key) {
      switch (sortDir) {
        case true:
          return setSortOn([key, false]);
        case false:
          return setSortOn(['', undefined]);
      }
    }

    return setSortOn([key, true]);
  };
  const sortFn = sortKey
    ? columns.find(({ sort, key }) => sortKey === key && sort)?.sort
    : undefined;
  const sortedDataSource = [...dataSource];

  // Do Sorting
  if (sortFn) {
    sortedDataSource.sort(sortFn);

    // Reverse sort
    if (sortDir === false) {
      sortedDataSource.reverse();
    }
  }

  console.log('NEED Resize Observer for second sticky column');

  return (
    <div
      className={styles.container}
      style={{ '--scroll-position': scrollLeft } as any}
      onScroll={(evt: React.UIEvent<HTMLElement>) =>
        setScrollLeft((evt.target as HTMLDivElement).scrollLeft)
      }
    >
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map(({ key, label, fixed, sort }, i, arr) => (
              <th
                key={key}
                className={cx(
                  styles.th,
                  fixed && styles['th-sticky'],
                  fixed && !arr[i + 1]?.fixed && styles['th-sticky-pseudos'],
                  sort && styles['th-btn'],
                  key === sortKey && styles['th-sorted']
                )}
              >
                {sort ? (
                  <HeaderButton
                    dir={sortKey === key ? sortDir : undefined}
                    onClick={() => setSortKey(key)}
                  >
                    {label}
                  </HeaderButton>
                ) : (
                  <>{label}</>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedDataSource.map(({ key, ...rest }) => (
            <tr key={key}>
              {Object.entries(rest).map(([k, val]) => {
                const colIndex = columns.findIndex(({ key }) => k === key);
                const col = columns[colIndex]!;

                return (
                  <td
                    key={k}
                    className={cx(
                      styles.td,
                      k === sortKey && styles['td-sorted'],
                      col.fixed && styles['td-sticky'],
                      col.fixed && !columns[colIndex + 1]?.fixed && styles['td-sticky-pseudos']
                    )}
                  >
                    {val}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
