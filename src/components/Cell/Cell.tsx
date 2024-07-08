import styles from './Cell.module.scss';
import cn from 'classnames';
import { useStore } from '../../store/store';

type Props = {
  number: number;
  index: number;
  selected?: boolean;
  availableToSelect?: boolean;
};

export const Cell = ({ number, selected, index, availableToSelect = true }: Props) => {
  const selectCell = useStore((state) => state.selectCell);
  return (
    <div
      className={cn(styles.cell, {
        [styles.cell_selected]: selected,
        [styles.cell_notAvailableToSelect]: !availableToSelect && !selected,
      })}
      onClick={() => selectCell(index)}
    >
      <div className={cn(styles.cell__content, { [styles.cell__content_selected]: selected })}>{number}</div>
    </div>
  );
};
