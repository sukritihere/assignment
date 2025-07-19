import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CalendarEvent {
  id: string;
  date: string;
  title: string;
  type: 'event' | 'reminder';
}

interface CalendarState {
  events: CalendarEvent[];
  selectedDate: string | null;
  showModal: boolean;
}

const initialState: CalendarState = {
  events: [],
  selectedDate: null,
  showModal: false,
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    addEvent: (state, action: PayloadAction<Omit<CalendarEvent, 'id'>>) => {
      const newEvent = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.events.push(newEvent);
    },
    deleteEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter(event => event.id !== action.payload);
    },
    setSelectedDate: (state, action: PayloadAction<string | null>) => {
      state.selectedDate = action.payload;
    },
    setShowModal: (state, action: PayloadAction<boolean>) => {
      state.showModal = action.payload;
    },
  },
});

export const { addEvent, deleteEvent, setSelectedDate, setShowModal } = calendarSlice.actions;
export default calendarSlice.reducer;