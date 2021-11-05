import { combineReducers, configureStore, AnyAction } from '@reduxjs/toolkit';

export const rootReducer = combineReducers({});

const isDev = process.env.NODE_ENV === 'development';

const store = configureStore({
  reducer: rootReducer,
  devTools: isDev,
});

export default store;
