// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    // You can add slices here later
  },
});

// Types for dispatch and selector
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
