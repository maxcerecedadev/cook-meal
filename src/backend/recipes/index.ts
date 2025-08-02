import { IRecipesForm, ISearch } from "@/types";
import axios from "axios";
import { checkSession } from "@/utils/checkSession";

const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}`;

export const getDiets = async (): Promise<any> => {
  const token = checkSession();

  const response = await axios.get(`${baseUrl}/api/diet`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};

export const createRecipe = async (data: IRecipesForm): Promise<any> => {
  const token = checkSession();

  const response = await axios.post(
    `${baseUrl}/api/recipe/generate`,
    {
      ingredients: data.ingredients,
      allergic: data.AllergicIngredients,
      flavor: data.flavor,
      diets: data.diet,
      categories: data.categories,
      difficulty: data.difficulty
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response;
};

export const getRecipesBySearch = async (data: ISearch) => {
  const token = checkSession();

  if (!token) throw new Error("Not authorized");

  const response = await axios.post(`${baseUrl}/api/recipe/search`, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.data) return [];

  return response.data;
};

export const addRecipeToCalendar = async (recipeId: string, data: any) => {
  const token = checkSession();

  console.log(data);

  const response = await axios.post(
    `${baseUrl}/api/calendary/add-recipe/${recipeId}`,
    {
      moment: data.Moment,
      dayOfWeek: data.DayOfWeek
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  console.log(response);

  return response;
};

// export const getRecipeById = async ({
//   token,
//   recipeId
// }: {
//   token: null | string;
//   recipeId: string;
// }): Promise<IRecipe> => {
//   // http://localhost:3001/api/recipe/id/57fc7126-3881-4ae8-a306-b47ce760ad7f
//   const response = await axios.get(`${baseUrl}/api/recipe/id/${recipeId}`, {
//     headers: {
//       Authorization: `Bearer ${token}`
//     }
//   });
//   if (response.status === 401) {
//     throw new Error("Not authorized");
//   }

//   const foundRecipe = response.data;

//   return foundRecipe;
// };
