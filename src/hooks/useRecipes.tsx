import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { IRecipe, ISearch } from "@/types";
import { checkSession } from "@/utils/checkSession";

// URL base de la API desde la variable de entorno en el frontend .env.local
const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}`;

// Obtener el token de sesión del usuario
const token = checkSession();

//Función para traer todas las recetas que existen en la bd

export const getAllRecipes = async (): Promise<IRecipe[]> => {
  const response = await axios.get(`${baseUrl}/api/recipe`);

  const allRecipes: IRecipe[] = response.data?.recipes;

  return allRecipes;
};

// Función para traer todas las recetas favoritas del usuario en sesión

export const getAllRecipesFromUser = async (): Promise<IRecipe[]> => {
  const token = checkSession();
  const response = await axios.get(`${baseUrl}/api/recipe/favorite`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (response.status === 401) {
    throw new Error("Not authorized");
  }

  const allRecipesFromUser: IRecipe[] = response.data;

  return allRecipesFromUser;
};

// funcion para añadir una receta a los favoritos

export const addFavoriteRecipe = async (recipeId: string, token: string): Promise<void> => {
  try {
    const response = await axios.post(`${baseUrl}/api/recipe/add-favorite/${recipeId}`, null, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (response.status === 200) {
      console.log("Recipe added to favorites");
    } else {
      console.error("Failed to add recipe to favorites");
    }
  } catch (error) {
    console.error("Error occurred while adding recipe to favorites:", error);
  }
};

// funcion para eliminar una receta de los favoritos

export const deleteFavoriteRecipe = async (recipeId: string, token: string): Promise<void> => {
  try {
    const response = await axios.delete(`${baseUrl}/api/recipe/delete-favorite/${recipeId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (response.status === 200) {
      console.log("Recipe removed from favorites");
    } else {
      console.error("Failed to remove recipe from favorites");
    }
  } catch (error) {
    console.error("Error occurred while removing recipe from favorites:", error);
  }
};

// export function useRecipes() {
//   const queryClient = useQueryClient();

//   // Query para obtener todas las recetas
//   const getAllRecipesQuery = useQuery<IRecipe[], Error>(["allRecipes"], getAllRecipes);

//   // Query para obtener todas las recetas favoritas del usuario
//   const getAllFavoriteRecipesQuery = useQuery<IRecipe[], Error>(
//     ["favoriteRecipes"],
//     getAllRecipesFromUser
//   );

//   // Mutation para añadir una receta a favoritos
//   const addFavoriteMutation = useMutation(
//     (recipeId: string) => addFavoriteRecipe(recipeId, checkSession()),
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries(["favoriteRecipes"]);
//       }
//     }
//   );

//   // Mutation para eliminar una receta de favoritos
//   const deleteFavoriteMutation = useMutation(
//     (recipeId: string) => deleteFavoriteRecipe(recipeId, checkSession()),
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries(["favoriteRecipes"]);
//       }
//     }
//   );

//   return {
//     addFavoriteMutation,
//     deleteFavoriteMutation,
//     getAllRecipesQuery,
//     getAllFavoriteRecipesQuery
//   };
// }

// funcion para traer solo una recete por id
export const getRecipeById = async ({
  recipeId
}: {
  recipeId: string;
}): Promise<IRecipe | null> => {
  const response = await axios.get(`${baseUrl}/api/recipe/id/${recipeId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (response.status === 401) {
    throw new Error("Not authorized");
  }

  const foundRecipe = response.data;
  if (!Object.values(foundRecipe)) return null;
  return foundRecipe;
};

// const recipeId = "your_recipe_id"; // Reemplaza "your_recipe_id" con el id de la receta que desees obtener
export function useFindRecipeById(recipeId: string) {
  const getRecipeByIdQuery = useQuery<IRecipe | null, Error>(["foundRecipe", recipeId], () =>
    getRecipeById({ recipeId })
  );
  return {
    getRecipeByIdQuery
  };
}

export function useRecipes() {
  const queryClient = useQueryClient();

  // Obtener el token de sesión del usuario
  const token = checkSession();

  // Query para obtener todas las recetas
  const getAllRecipesQuery = useQuery<IRecipe[], Error>(["allRecipes"], getAllRecipes);

  // Query para obtener todas las recetas favoritas del usuario
  const getAllFavoriteRecipesQuery = useQuery<IRecipe[], Error>(
    ["favoriteRecipes"],
    getAllRecipesFromUser
  );

  // Mutation para añadir una receta a favoritos
  const addFavoriteMutation = useMutation(
    (recipeId: string) => addFavoriteRecipe(recipeId, token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["favoriteRecipes"]);
      }
    }
  );

  // Mutation para eliminar una receta de favoritos
  const deleteFavoriteMutation = useMutation(
    (recipeId: string) => deleteFavoriteRecipe(recipeId, token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["favoriteRecipes"]);
      }
    }
  );

  return {
    addFavoriteMutation,
    deleteFavoriteMutation,
    getAllRecipesQuery,
    getAllFavoriteRecipesQuery
  };
}
