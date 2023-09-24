import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ErrorState } from './type';

const initialState: ErrorState = {
  errors: [],
};

const errorSlice = createSlice({
  name: 'errors',
  initialState,
  reducers: {
    setError: (state, { payload }: PayloadAction<string>) => {
      state.errors = [...state.errors, { message: payload, type: 'error' }];
    },

    setSuccess: (state, { payload }: PayloadAction<string>) => {
      state.errors = [...state.errors, { message: payload, type: 'success' }];
    },

    clearErrors: (state) => {
      state.errors = [];
    },

    clearError: (state, { payload }: PayloadAction<string>) => {
      const filteredEntries = state.errors.filter((e) => e.message !== payload);
      state.errors = [...filteredEntries];
    },
  },
});

export const { setError, clearError, clearErrors, setSuccess } = errorSlice.actions;
export default errorSlice.reducer;
