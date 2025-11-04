import apiClient from "./client";

export type signupType = {
    name:string,
    email:string,
    password:string
}

export const signin= async (email:string, password:string) => {
    const response = await apiClient.post("/users/signin", {email, password});
    return response.data;
}


export const signup = async (userData: signupType | null) => {
    const response = await apiClient.post("/users/signup", userData);
    return response.data;
}