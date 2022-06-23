import { cx } from '@linaria/core';
import { Header } from 'components/Header';
import { Table } from 'components/Table';
import { ReactComponent as Logo } from 'assets/favicon.svg';

const dataSource = [
  {
    key: '1',
    name: 'Mike',
    age: 32,
    address: '10 Downing Street',
  },
  {
    key: '2',
    name: 'John',
    age: 42,
    address: '10 Downing Street',
  },
];

const columns = [
  {
    label: 'Name',
    key: 'name',
  },
  {
    label: 'Age',
    key: 'age',
    sort: (a, b) => a.age - b.age,
  },
  {
    label: 'Address',
    key: 'address',
  },
];

function App() {
  return (
    <div className={cx('App')}>
      <Header title="hey" />
      <Logo height={100} width={100} />
      <hr />
      <Table columns={columns} dataSource={dataSource} />
    </div>
  );
}

export default App;
