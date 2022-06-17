import { Header } from 'components/Header';
import { Button } from 'components/Button';
import { ReactComponent as Logo } from 'assets/favicon.svg';
import { cx } from '@linaria/core';
import { css } from '@linaria/atomic';

const TEST = css`
  text-transform: uppercase;
`;

function App() {
  return (
    <div className={cx('App', TEST)}>
      <Header title="hola" />
      <Logo height={100} width={100} />
      <Button onClick={() => alert('hola')}>Heyo</Button>
    </div>
  );
}

export default App;
