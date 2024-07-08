import styles from './App.module.scss';
import { Ticket } from './Pages/Ticket/Ticket';

function App() {
  return (
    <div className={styles.wrapper}>
      <Ticket />
    </div>
  );
}

export default App;
