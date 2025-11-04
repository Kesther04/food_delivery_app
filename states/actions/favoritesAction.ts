import { userFavorites } from "@/api/user.api";
import { setFavorites } from "../slices/favoritesSlice";
import { AppDispatch, RootState } from "../store";

export const toggleFavorite = (dishId: string) => 
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const { favorites } = getState();
    
    // Determine if liked or unliked
    const isLiked = favorites.includes(dishId);
    const updated = isLiked ? favorites.filter(id => id !== dishId) : [...favorites, dishId];

    // Optimistic UI update
    dispatch(setFavorites(updated));

    try {
      const data = await userFavorites(dishId); // sync with backend
      dispatch(setFavorites(data.favorites));
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };