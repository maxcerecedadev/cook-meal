import { UserAuth, UserRegister } from "@/types";
import axios from "axios";

const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}`;

export const registerUser = async (newUser: UserRegister): Promise<any> => {
  const response = await axios.post(`${baseUrl}/api/auth/register`, {
    name: newUser.name,
    email: newUser.email,
    password: newUser.password
  });

  const { token } = response.data;

  return token;
};

export const loginUser = async (user: UserAuth): Promise<any> => {
  const response = await axios.post(`${baseUrl}/api/auth/login`, {
    email: user.email,
    password: user.password
  });

  const { token } = response.data;

  return token;
};

export const google = async (): Promise<any> => {
  const response = await axios.get(`${baseUrl}/api/auth/google`);
  return response;
};

export const getProfile = async (token: null | string): Promise<any> => {
  const response = await axios.get(`${baseUrl}/api/auth/profile`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (response.status === 401) {
    throw new Error("Not authorized");
  }

  const profile = response.data;

  return profile;
};

//Función para actualizar el usuario
export const updateProfile = async (token: string, profileData: any): Promise<any> => {
  const response = await axios.put(`${baseUrl}/api/update/user`, profileData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (response.status === 401) {
    throw new Error("Not authorized");
  }

  const updatedProfile = response.data;

  return updatedProfile;
};
