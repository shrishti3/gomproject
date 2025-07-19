import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GameState {
  story: string;
  loading: boolean;
}

const initialState: GameState = {
  story: "",
  loading: false,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setStory(state, action: PayloadAction<string>) {
      state.story = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { setStory, setLoading } = gameSlice.actions;
export default gameSlice.reducer;