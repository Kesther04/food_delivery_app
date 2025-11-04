import apiClient from "./client";

// api handler for attaining all dishes
export const allDishes = async () => {
    const response = await apiClient.get("/dish");
    return response.data;
}

// api handler for attaining specific Dish
export const getDish = async (id:string) => {
    const response = await apiClient.get(`/dish/${id}`);
    return response.data;
}

