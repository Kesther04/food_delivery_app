import apiClient from "./client";

export const userProfile = async () => {
    const response = await apiClient.get("/users/profile");
    return response.data;
}

export const userFavorites = async (dishId: string) => {
    const response = await apiClient.put("/users/favorites", { dishId });
    return response.data;
}