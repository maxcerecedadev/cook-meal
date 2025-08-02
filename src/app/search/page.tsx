"use client";

import { Menu, ShowRecipe } from "@/components";
import { useRecipes } from "@/hooks/useRecipes";
import Image from "next/image";
import { IconHomeAlt, IconSoup, IconStar } from "@/components/icons";
import { useSearch } from "@/hooks/useSearch";
import { ISearch } from "@/types";
import { useState } from "react";
import FilterCard from "@/components/FilterCard";

const Search: React.FC<{}> = () => {
  const [formData, setFormData] = useState<ISearch>({
    name: "",
    difficulty: "",
    ingredients: [],
    diets: [],
    categories: []
  });
  const { getSearchedRecipes } = useSearch(formData);
  const allRecipes = getSearchedRecipes.data;
  // Data para el menú lateral
  const options = [
    {
      id: 1,
      url: "/dashboard",
      text: "Home",
      icon: <IconHomeAlt />,
      activeColor: "secondary-500",
      inactiveColor: "light"
    },
    {
      id: 2,
      url: "/recipesfav",
      text: "Favorites",
      icon: <IconStar />,
      activeColor: "secondary-500",
      inactiveColor: "light"
    },
    {
      id: 3,
      url: "/generator",
      text: "Create",
      icon: <IconSoup />,
      activeColor: "secondary-500",
      inactiveColor: "light"
    }
  ];

  return (
    <main className="w-full min-h-screen flex flex-wrap md:flex-nowrap justify-around gap-7 px-4 py-[38px]">
      <div className="flex flex-col">
        <div className="w-full px-4 lg:w-auto">
          <Menu options={options} />
        </div>
        <div className="w-full px-4 lg:w-auto">
          <FilterCard setFormData={setFormData} formData={formData} />
        </div>
      </div>

      <div className="w-screen grid grid-cols-1 md:grid-cols-3 gap-7 px-4">
        {getSearchedRecipes.isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Image src="/recipes/loading_gif.gif" alt="loading" width={256} height={256} />
          </div>
        ) : (
          allRecipes?.recipes.map(recipe => (
            <div key={recipe.id} className="relative">
              <ShowRecipe recipe={recipe} />
            </div>
          ))
        )}
      </div>
    </main>
  );
};

export default Search;
