import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Appeal {
  id: string;
  taxYear: string;
  company: string;
  state: string;
  assessor: string;
  account: string;
  appealedDate: string;
  selected?: boolean;
}

interface AppealsState {
  appeals: Appeal[];
  searchTerm: string;
  selectedAppeals: string[];
}

const initialState: AppealsState = {
  appeals: [
    {
      id: '1',
      taxYear: '2017',
      company: 'Alabama and Gulf Coast Railway LLC',
      state: 'AL',
      assessor: 'Wilcox County Tax Collector',
      account: '1.87060',
      appealedDate: 'June 25, 2021',
    },
    {
      id: '2',
      taxYear: '2018',
      company: 'First Coast Railroad Inc.',
      state: 'GA',
      assessor: 'Camden County Tax',
      account: 'UTIL150_Camden County',
      appealedDate: 'June 25, 2021',
    },
    {
      id: '3',
      taxYear: '2019',
      company: 'Buffalo and Pittsburgh Railroad, Inc.',
      state: 'NY',
      assessor: 'City Of Buffalo Assessor',
      account: '10782900',
      appealedDate: 'June 25, 2021',
    },
    {
      id: '4',
      taxYear: '2020',
      company: 'Conecuh Valley Railway, LLC',
      state: 'OH',
      assessor: 'Ellicottville Tax Collector',
      account: '043689 38.004-1-31',
      appealedDate: 'June 25, 2021',
    },
    {
      id: '5',
      taxYear: '2021',
      company: 'Georgia Central Railway LP',
      state: 'KY',
      assessor: 'Pike County Revenue Commissioner',
      account: 'PUBUT - 000780 (TROY)-50054',
      appealedDate: 'June 25, 2021',
    },
    {
      id: '6',
      taxYear: '2022',
      company: 'KWT Railway Inc.',
      state: 'UT',
      assessor: 'City Of Dublin',
      account: '400 294.400 294',
      appealedDate: 'June 25, 2021',
    },
  ],
  searchTerm: '',
  selectedAppeals: [],
};

const appealsSlice = createSlice({
  name: 'appeals',
  initialState,
  reducers: {
    addAppeal: (state, action: PayloadAction<Omit<Appeal, 'id'>>) => {
      const newAppeal = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.appeals.push(newAppeal);
    },
    updateAppeal: (state, action: PayloadAction<Appeal>) => {
      const index = state.appeals.findIndex(appeal => appeal.id === action.payload.id);
      if (index !== -1) {
        state.appeals[index] = action.payload;
      }
    },
    deleteAppeal: (state, action: PayloadAction<string>) => {
      state.appeals = state.appeals.filter(appeal => appeal.id !== action.payload);
      state.selectedAppeals = state.selectedAppeals.filter(id => id !== action.payload);
    },
    toggleAppealSelection: (state, action: PayloadAction<string>) => {
      const appealId = action.payload;
      const index = state.selectedAppeals.indexOf(appealId);
      if (index === -1) {
        state.selectedAppeals.push(appealId);
      } else {
        state.selectedAppeals.splice(index, 1);
      }
    },
    selectAllAppeals: (state) => {
      state.selectedAppeals = state.appeals.map(appeal => appeal.id);
    },
    deselectAllAppeals: (state) => {
      state.selectedAppeals = [];
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
  },
});

export const {
  addAppeal,
  updateAppeal,
  deleteAppeal,
  toggleAppealSelection,
  selectAllAppeals,
  deselectAllAppeals,
  setSearchTerm,
} = appealsSlice.actions;

export default appealsSlice.reducer;