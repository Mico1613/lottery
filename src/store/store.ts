import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import lodash from 'lodash';
import { sendTicket } from '../api';

type Cell = { value: number; index: number; selected: boolean };

export type Field = {
  availableToSelect: boolean;
  cells: Cell[];
  selectedNumbers: number[];
  numbersToSelect: number;
};

interface Store {
  isLoading: boolean;
  fieldOne: Field;
  fieldTwo: Field;
  winningNumbers: {
    fieldOne: number[];
    fieldTwo: number[];
  };
  hasError: boolean;
  isTicketWon: boolean;
  isOnResultScreen: boolean;
  generateWinningNumbers: () => void;
  selectCell: (index: number) => void;
  randomlySelectNumbers: () => void;
  toggleAbilityToSelect: (fieldNum: number, available: boolean) => void;
  showResults: () => void;
  sendTicket: () => void;
  toggleLoading: (flag: boolean) => void;
}

export const useStore = create<Store, [['zustand/immer', never]]>(
  immer((set, get) => ({
    winningNumbers: {
      fieldOne: [],
      fieldTwo: [],
    },
    isTicketWon: false,
    isOnResultScreen: false,
    hasError: false,
    isLoading: false,
    fieldOne: {
      availableToSelect: true,
      numbersToSelect: 8,
      cells: [
        { value: 1, index: 1, selected: false },
        { value: 2, index: 2, selected: false },
        { value: 3, index: 3, selected: false },
        { value: 4, index: 4, selected: false },
        { value: 5, index: 5, selected: false },
        { value: 6, index: 6, selected: false },
        { value: 7, index: 7, selected: false },
        { value: 8, index: 8, selected: false },
        { value: 9, index: 9, selected: false },
        { value: 10, index: 10, selected: false },
        { value: 11, index: 11, selected: false },
        { value: 12, index: 12, selected: false },
        { value: 13, index: 13, selected: false },
        { value: 14, index: 14, selected: false },
        { value: 15, index: 15, selected: false },
        { value: 16, index: 16, selected: false },
        { value: 17, index: 17, selected: false },
        { value: 18, index: 18, selected: false },
        { value: 19, index: 19, selected: false },
      ],
      selectedNumbers: [],
    },

    fieldTwo: {
      availableToSelect: true,
      numbersToSelect: 1,
      cells: [
        { value: 1, index: 20, selected: false },
        { value: 2, index: 21, selected: false },
      ],
      selectedNumbers: [],
    },

    generateWinningNumbers: () => {
      return set((state) => {
        const fieldOneWinningNumbers = state.winningNumbers.fieldOne;
        const fieldTwoWinningNumbers = state.winningNumbers.fieldTwo;

        for (; fieldOneWinningNumbers.length < 8; ) {
          const num = lodash.random(1, 19);
          if (fieldOneWinningNumbers.includes(num)) {
            continue;
          }
          fieldOneWinningNumbers.push(num);
        }

        for (; fieldTwoWinningNumbers.length < 1; ) {
          const num = lodash.random(1, 2);
          if (fieldTwoWinningNumbers.includes(num)) {
            continue;
          }
          fieldTwoWinningNumbers.push(num);
        }
      });
    },

    selectCell: (index) => {
      return set((state) => {
        const cellFromFieldOne = state.fieldOne.cells.find((cell) => cell.index === index);
        const cellFromFieldTwo = state.fieldTwo.cells.find((cell) => cell.index === index);

        if (cellFromFieldOne || cellFromFieldTwo) {
          (cellFromFieldOne ?? cellFromFieldTwo)!.selected = !(cellFromFieldOne ?? cellFromFieldTwo)!.selected;
        }

        if (cellFromFieldOne) {
          state.fieldOne.selectedNumbers.includes(cellFromFieldOne.value)
            ? lodash.remove(state.fieldOne.selectedNumbers, (num) => num === cellFromFieldOne.value)
            : state.fieldOne.selectedNumbers.push(cellFromFieldOne.value);
        }

        if (cellFromFieldTwo) {
          state.fieldTwo.selectedNumbers.includes(cellFromFieldTwo.value)
            ? lodash.remove(state.fieldTwo.selectedNumbers, (num) => num === cellFromFieldTwo.value)
            : state.fieldTwo.selectedNumbers.push(cellFromFieldTwo.value);
        }
      });
    },

    randomlySelectNumbers: () => {
      return set((state) => {
        state.fieldOne.cells.concat(state.fieldTwo.cells).forEach((cell) => (cell.selected = false));
        state.fieldOne.selectedNumbers = [];
        state.fieldTwo.selectedNumbers = [];

        const indexesFromFieldOne: number[] = [];
        const indexesFromFieldTwo: number[] = [];

        for (; indexesFromFieldOne.length < 8; ) {
          const idx = lodash.random(1, 19);
          if (indexesFromFieldOne.includes(idx)) {
            continue;
          }
          indexesFromFieldOne.push(idx);
        }

        for (; indexesFromFieldTwo.length < 1; ) {
          const idx = lodash.random(20, 21);
          if (indexesFromFieldTwo.includes(idx)) {
            continue;
          }
          indexesFromFieldTwo.push(idx);
        }

        state.fieldOne.cells.forEach((cell) => {
          if (indexesFromFieldOne.includes(cell.index)) {
            cell.selected = true;
            state.fieldOne.selectedNumbers.push(cell.value);
          }
        });

        state.fieldTwo.cells.forEach((cell) => {
          if (indexesFromFieldTwo.includes(cell.index)) {
            cell.selected = true;
            state.fieldTwo.selectedNumbers.push(cell.value);
          }
        });
      });
    },

    toggleAbilityToSelect: (fieldNum: number, available: boolean) => {
      return set((state) => {
        if (fieldNum === 1) {
          available ? (state.fieldOne.availableToSelect = true) : (state.fieldOne.availableToSelect = false);
        }
        if (fieldNum === 2) {
          available ? (state.fieldTwo.availableToSelect = true) : (state.fieldTwo.availableToSelect = false);
        }
      });
    },

    showResults: () => {
      return set((state) => {
        const fieldOneInterceptionArray = state.fieldOne.selectedNumbers.filter((item) =>
          state.winningNumbers.fieldOne.includes(item),
        );
        const fieldTwoInterceptionArray = state.fieldTwo.selectedNumbers.filter((item) =>
          state.winningNumbers.fieldTwo.includes(item),
        );

        state.isTicketWon =
          fieldOneInterceptionArray.length >= 4 ||
          (fieldOneInterceptionArray.length >= 3 && fieldTwoInterceptionArray.length > 0);
      });
    },

    toggleLoading: (flag: boolean) => {
      return set((state) => {
        state.isLoading = flag;
      });
    },

    sendTicket: async () => {
      const success = await sendTicket({
        selectedNumbers: {
          firstField: get().fieldOne.selectedNumbers,
          secondField: get().fieldTwo.selectedNumbers,
        },
        isTicketWon: get().isTicketWon,
      });

      return set((state) => {
        state.hasError = !success;
        state.isOnResultScreen = true;
      });
    },
  })),
);
