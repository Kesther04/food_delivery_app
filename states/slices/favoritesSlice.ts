import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export type FavoritesState = string[];

const initialState: FavoritesState = [];

const favoritesSlice = createSlice({
    name: "favorites",
    initialState,
    reducers: {
        setFavorites: (state, action:PayloadAction<FavoritesState>) => {
            return action.payload;
        },
    },
});

export const { setFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
