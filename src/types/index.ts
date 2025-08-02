export interface UserAuth {
  email: string;
  password: string;
}

export interface UserRegister extends UserAuth {
  name: string;
}

export interface UserProfile extends UserRegister {
  lastName: string;
  picture: string;
  nationality: string;
  _id?: string;
  id?: string;
  role: string;
  subscription: {
    active: string;
  };
  weekCalendar: [];
}

export interface IRecipes {
  recipes: IRecipe[];
}

export interface IRecipe {
  _id: string;
  name: string;
  description: string;
  ingredients: string[];
  steps: string[];
  time: Time;
  portions: number;
  diets: Category[];
  categories: Category[];
  images: string[];
  difficulty: string;
  nutritionalValue: NutritionalValue;
  createdBy: string;
  id: string;
  __v: number;
}

export interface Category {
  _id: string;
  name: string;
  description: string;
  id: string;
  __v: number;
}

export interface NutritionalValue {
  of100g: Of100G;
  ofPortion: Of100G;
}

export interface Of100G {
  calories: number;
  fat: number;
  carbohydrates: number;
  protein: number;
  cholesterol: number;
}

export interface Time {
  preparation: number;
  cooking: number;
  total: number;
}

export interface IRecipesForm {
  ingredients: string[];
  AllergicIngredients: string[];
  diet: string[];
  categories: string[];
  flavor: string;
  difficulty: string;
}

export interface ISearch {
  perPage?: number;
  page?: number;
  difficulty?: string;
  name?: string;
  ingredients?: string[];
  diets?: string[];
  categories?: string[];
}

export interface ISubscription {
  name: string;
  price: number;
  description: string;
  image: string;
}
