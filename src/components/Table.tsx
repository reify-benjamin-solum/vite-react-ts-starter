import type { FC } from 'react';
import { useState } from 'react';
import { cx } from '@linaria/core';
import { css } from '@linaria/atomic';

const styles = {
  table: css`
    --border-width: 1px;
    --border-color: rgba(0, 0, 0, 0.06);
    --padding: 1em;

    border-collapse: border;
    table-layout: fixed;
    width: 100%;
  `,
  th: css`
    background: #fafafa;
    border-bottom: var(--border-width) solid var(--border-color);
    font-weight: 500;
    padding: var(--padding);
    position: relative;
    text-transform: none;
    transition: background 0.3s ease;

    &::after {
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
    position: fixed;
  `,
  'th-btn': css`
    padding: 0;
  `,
  td: css`
    border-bottom: var(--border-width) solid var(--border-color);
    padding: var(--padding);
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

    &:hover,
    &:focus {
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
  [x: string]: string | number;
}

interface TableProps {
  columns: TableColumn[];
  dataSource: TableDataSource[];
}

export function Table({ columns, dataSource }: TableProps) {
  const [sortOn, setSortOn] = useState<[Key, boolean | undefined]>(['', undefined]);
  const setSortKey = (key: Key) => {
    const [k, v] = sortOn;

    if (k === key) {
      let newValue: boolean | undefined;

      if (v !== false) {
        newValue = !v;
      }

      setSortOn([key, newValue]);
    } else {
      setSortOn([key, true]);
    }
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {columns.map(({ key, label, fixed, sort }) => (
            <th
              className={cx(styles.th, fixed && styles['th-sticky'], sort && styles['th-btn'])}
              key={key}
            >
              {sort ? (
                <HeaderButton dir={sortOn[0] === key && sortOn[1]} onClick={() => setSortKey(key)}>
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
        {dataSource.map(({ key, ...rest }) => (
          <tr key={key}>
            {Object.entries(rest).map(([k, val]) => (
              <td key={k} className={styles.td}>
                {val}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
