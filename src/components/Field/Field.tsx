import styles from './Field.module.scss';
import { Cell } from '../Cell/Cell';
import { Field as FieldType } from '../../store/store';

type Props = {
  title?: string;
  field: FieldType;
};

const createSubTitle = (numbersToSelect: number) => {
  const lastNum = parseInt(String(numbersToSelect)[String(numbersToSelect).length - 1]);
  if (lastNum === 1) return `Отметьте ${numbersToSelect} число`;
  if (lastNum > 1 && lastNum < 5) return `Отметить ${numbersToSelect} числа`;
  return `Отметьте ${numbersToSelect} чисел`;
};

export const Field = ({ title = 'Поле', field }: Props) => {
  return (
    <div className={styles.field}>
      <div className={styles.field__title}>
        <h2>{title}</h2>
        <span>{createSubTitle(field.numbersToSelect)}</span>
      </div>
      <div className={styles.cellsWrapper}>
        {field.cells.map((cell) => (
          <Cell
            number={cell.value}
            index={cell.index}
            selected={cell.selected}
            key={`${cell.index}_${cell.value}`}
            availableToSelect={field.availableToSelect}
          />
        ))}
      </div>
    </div>
  );
};
