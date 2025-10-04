import apiClient from "./client";

// api handler for all restaurants
export const allRestaurants = async () => {
    const response = await apiClient.get("/restaurants");
    return response.data;
}

// api handler for getting menu of a restaurant
export const RestaurauntMenu = async (id:string) => {
    const response = await apiClient.get(`/restaurants/${id}`);
    return response.data;
}