import styles from './Ticket.module.scss';
import WandIcon from '../../assets/magic-wand.svg?react';
import { Field } from '../../components/Field/Field';
import { useStore } from '../../store/store';
import { useEffect } from 'react';

export const Ticket = () => {
  const {
    fieldOne,
    fieldTwo,
    randomlySelectNumbers,
    toggleAbilityToSelect,
    generateWinningNumbers,
    showResults,
    isTicketWon,
    isOnResultScreen,
    hasError,
    sendTicket,
  } = useStore();

  useEffect(() => {
    const fieldOneSelectedNumbersLength = fieldOne.selectedNumbers.length;
    const fieldTwoSelectedNumbersLength = fieldTwo.selectedNumbers.length;
    const fieldOneNumbersToSelect = fieldOne.numbersToSelect;
    const fieldTwoNumbersToSelect = fieldTwo.numbersToSelect;

    if (fieldOneSelectedNumbersLength === fieldOneNumbersToSelect) {
      toggleAbilityToSelect(1, false);
    }
    if (fieldOneSelectedNumbersLength < fieldOneNumbersToSelect) {
      toggleAbilityToSelect(1, true);
    }
    if (fieldTwoSelectedNumbersLength === fieldTwoNumbersToSelect) {
      toggleAbilityToSelect(2, false);
    }
    if (fieldTwoSelectedNumbersLength < fieldTwoNumbersToSelect) {
      toggleAbilityToSelect(2, true);
    }
  }, [fieldOne.selectedNumbers, fieldTwo.selectedNumbers]);

  useEffect(() => {
    generateWinningNumbers();
  }, []);

  const submitResults = () => {
    showResults();
    sendTicket();
  };

  if (hasError) {
    return (
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <h1 className={styles.header__title}>Билет 1</h1>
        </header>
        <span>Произошла ошибка. Попробуйте снова.</span>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1 className={styles.header__title}>Билет 1</h1>
        {!isOnResultScreen && (
          <button onClick={randomlySelectNumbers}>
            <WandIcon />
          </button>
        )}
      </header>
      {isOnResultScreen ? (
        <>
          {isTicketWon ? (
            <span>Ого, вы выиграли! Поздравляем!</span>
          ) : (
            <span>Ого, вы не выиграли! Не поздравляем!</span>
          )}
        </>
      ) : (
        <>
          <div className={styles.fieldOne}>
            <Field title="Поле 1" field={fieldOne} />
          </div>
          <div className={styles.fieldTwo}>
            <Field title="Поле 2" field={fieldTwo} />
          </div>
          <div className={styles.btnWrapper}>
            <button
              disabled={
                fieldOne.selectedNumbers.length !== fieldOne.numbersToSelect ||
                fieldTwo.selectedNumbers.length !== fieldTwo.numbersToSelect
              }
              onClick={submitResults}
            >
              Показать результаты
            </button>
          </div>
        </>
      )}
    </div>
  );
};
