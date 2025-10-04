import apiClient from "./client";

export const userProfile = async () => {
    const response = await apiClient.get("/users/profile");
    return response.data;
}