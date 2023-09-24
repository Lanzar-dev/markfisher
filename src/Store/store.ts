import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
// import logger from "redux-logger";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "reduxjs-toolkit-persist";
import storage from "reduxjs-toolkit-persist/lib/storage";
import autoMergeLevel1 from "reduxjs-toolkit-persist/lib/stateReconciler/autoMergeLevel1";

import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import rootReducer from "./root-reducer";

// const middleware = [logger];

const persistConfig = {
  key: "biyawa",
  stateReconciler: autoMergeLevel1,
  storage,
};

const persistedReducer = persistReducer<ReturnType<typeof rootReducer>, Action>(
  persistConfig,
  rootReducer
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }), //.concat(middleware),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistedStore = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

//https://redux-toolkit.js.org/usage/usage-guide#working-with-non-serializable-data
/*
FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,

  {
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },

      I added above to solve an error I was seeing the console
*/
