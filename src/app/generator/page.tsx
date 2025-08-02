"use client";
import React, { useState } from "react";
// import useForm from "@/hooks/useForm";
import { IRecipesForm } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Menu from "@/components/Menu";
import { alerts } from "@/utils/alert";
import { IconHomeAlt, IconSoup, IconStar, IconSearch, IconCheck } from "@/components/icons";
import { createRecipe, getDiets } from "@/backend/recipes";
import Login from "../login/page";
import { ProtectedRoute } from "@/components";
import Loader from "@/components/Loader";

export default function Generator() {
  const router = useRouter();

  //Estado de las dietas
  const DietsArray = useQuery(["diet"], getDiets);

  //Estados que manejan los ingredientes anadidos
  const [ingredient, setIngredient] = useState("");
  const [allergic, setAllergic] = useState("");

  //Estado principal que se envia la receta
  const [generator, setGenerator] = useState<IRecipesForm>({
    ingredients: [],
    AllergicIngredients: [],
    diet: [],
    categories: [],
    flavor: "",
    difficulty: ""
  });

  //Manejadores de los inputs y el menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const [showInput, setShowInput] = useState<any>({
    ingredient: false,
    allergic: false
  });

  const show = (type: string) => {
    if (type === "ingredient") {
      setShowInput({ ...showInput, ingredient: true });
    }
    if (type === "allergic") {
      setShowInput({ ...showInput, allergic: true });
    }
  };

  //Manejador de los input
  const handleChangeInput = (set: any, value: any) => {
    set(value);
  };

  //Eliminadores de los ingredientes
  const handleDeleteIngredients = (e: any) => {
    setGenerator({
      ...generator,
      ingredients: generator.ingredients?.filter(ingredient => ingredient !== e.target.title)
    });
  };

  const handleDeleteAllergic = (e: any) => {
    setGenerator({
      ...generator,
      AllergicIngredients: generator.AllergicIngredients?.filter(
        ingredient => ingredient !== e.target.title
      )
    });
  };

  //Confirmadores de los ingredientes
  const handleSubmitIngredient = (type: string, array: any, e: any) => {
    e.preventDefault();
    if (array && type && ingredient !== "") {
      setGenerator({ ...generator, ingredients: [...generator.ingredients, ingredient] });
      setShowInput({ type: false });
    }
    setIngredient("");
  };

  const handleSubmitAllergic = (type: string, array: any, e: any) => {
    e.preventDefault();
    if (array && type) {
      setGenerator({
        ...generator,
        AllergicIngredients: [...generator.AllergicIngredients, allergic]
      });
      setShowInput({ type: false });
    }
  };

  //Manejadores de las elecciones multiples
  const handleChangeDiets = (e: any) => {
    const newDiets = [...generator.diet];
    setGenerator({
      ...generator,
      [e.target.name]: [...newDiets, e.target.value]
    });
    if (newDiets.includes(e.target.value)) {
      setGenerator({
        ...generator,
        [e.target.name]: newDiets.filter(element => element !== e.target.value)
      });
    }
  };

  const handleChangeCategories = (e: any) => {
    const newCategories = [...generator.categories];
    setGenerator({
      ...generator,
      categories: [...newCategories, e.target.value]
    });
    if (newCategories.includes(e.target.value)) {
      setGenerator({
        ...generator,
        categories: newCategories.filter(element => element !== e.target.value)
      });
    }
  };

  const handleCheck = (e: any) => {
    setGenerator({
      ...generator,
      [e.target.name]: e.target.value
    });
  };

  const { mutate, isLoading, isError, isSuccess } = useMutation(createRecipe, {
    onError(error) {
      if (error) {
        alerts({
          width: 500,
          title: "Something was wrong, please create again your recipe",
          icon: "error"
        });
      }
    },
    onSuccess(data) {
      if (data.status === 201 || data.status === 200) {
        alerts({ title: "Your Recipe was create succesfully", icon: "success" }).then(() => {
          router.push("/dashboard");
        });
      }
    }
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (generator.ingredients.length === 0)
      return alerts({ title: "Ingredients is required", icon: "warning" });
    if (!generator.categories) return alerts({ title: "categories is required", icon: "warning" });
    if (!generator.diet) return alerts({ title: "Diet is required", icon: "warning" });
    if (!generator.flavor) return alerts({ title: "Flavor is required", icon: "warning" });
    if (!generator.difficulty) return alerts({ title: "Difficulty is required", icon: "warning" });
    else {
      mutate(generator);
    }
  };

  let tipo = ["Breakfast", "Lunch", "Night tea", "Dinner"];

  let saborTipos = ["Sweet", "Salted", "Acid", "Spicy", "Sour"];

  let dificultad = ["easy", "medium", "hard"];

  //!Rutas Dinamicas
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
    // <ProtectedRoute fallback={<Login />}>
    <div className="w-full min-h-screen gap-7 px-4 py-[38px] flex justify-between">
      {isLoading === true && <Loader type="gif" text="Generating recipe..." />}
      <div className=" w-[20%] max-[1000px]:w-[10%]">
        <div className="w-full px-4 lg:w-auto max-[1000px]:hidden">
          <Menu options={options} />
        </div>
        <div
          className={`bg-white absolute top-25 left-4 z-50 ${
            isMenuOpen
              ? "transition-trasnform duration-1000 transform translate-x-[15%]"
              : "transition-transform duration-1000 transform translate-x-[-120%]"
          } `}
        >
          <Menu options={options} />
        </div>

        <button onClick={toggleMenu} type="button" className="hidden max-[1000px]:block">
          <svg
            className="fill-primary-500 h-7 w-7"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>
      <section className="w-[80%] h-full flex flex-col justify-between max-[1200px]:w-[70%] max-[1000px]:w-[90%]">
        <h1 className="text-3xl mb-3 max-md:text-2xl">Generate recipe</h1>
        <form
          className="w-[90%] h-[54px] flex items-center bg-white py-4 px-5 rounded-md shadow-md"
          onSubmit={e => handleSubmitIngredient("ingredient", generator, e)}
        >
          <input
            type="text"
            placeholder="Add ingredients for your recipe!"
            className="w-[100%] bg-white border-b py-2 outline-none border-light"
            onChange={e => handleChangeInput(setIngredient, e.target.value)}
            value={ingredient}
          />
          <IconCheck
            onClick={e => handleSubmitIngredient("ingredient", generator, e)}
            className=""
            color="#FF8811"
          />
        </form>

        {/* INGREDIENTS */}
        <h1 className="text-3xl mt-10 mb-3 max-md:text-2xl">Ingredients</h1>
        <div
          className={`w-[80%] ${
            (generator.ingredients.length <= 0 && "h-[50px]") ||
            (generator.ingredients.length >= 6 && "h-auto")
          } ${
            generator.ingredients.length > 0 ? "" : "ml-5"
          }gap-y-5  grid grid-cols-6 justify-items-center items-center max-[1330px]:grid-cols-4 max-[1330px]:gap-y-5 max-lg:items-start max-lg:w-[90%] max-lg:grid-cols-3 max-[500px]:grid-cols-2 `}
        >
          {generator.ingredients.length > 0 ? (
            generator.ingredients?.map((e, i) => (
              <div
                key={i}
                className="relative w-[119px] h-[auto] flex items-center justify-center border shadow-[0px_0px_6px_rgba(0,0,0,0.25) rounded-[8px] max-[500px]:w-[70%]"
              >
                <h3 className=" text-primary-500 underline p-3 break-all">{e}</h3>
                <button className="absolute top-1 right-1">
                  <Image
                    onClick={handleDeleteIngredients}
                    title={e}
                    src="/generator/Equis x.png"
                    width="10"
                    height="10"
                    alt="X"
                  />
                </button>
              </div>
            ))
          ) : (
            <div className="w-[180px] h-[auto] flex items-center justify-center border shadow-[0px_0px_6px_rgba(0,0,0,0.25) rounded-[8px] max-[500px]:w-[70%]">
              <h3 className=" text-primary-500 underline p-3 break-all">Add ingredients</h3>
            </div>
          )}
        </div>

        {/* ALLERGIC INGREDIENTS */}
        <h1 className="text-3xl mt-10 mb-3 max-md:text-2xl">Allergic ingredients</h1>
        <div
          className={`w-[80%] ${
            (generator.AllergicIngredients.length <= 0 && "h-[50px]") ||
            (generator.AllergicIngredients.length >= 6 && "h-auto")
          } gap-y-5  grid grid-cols-6 justify-items-center items-center max-[1330px]:grid-cols-4 max-[1330px]:gap-y-5 max-lg:items-start max-lg:w-[90%] max-lg:grid-cols-3 max-[500px]:grid-cols-2 `}
        >
          {generator.AllergicIngredients?.map((e, i) => (
            <div
              key={i}
              className="relative w-[119px] h-[auto] flex items-center justify-center border shadow-[0px_0px_6px_rgba(0,0,0,0.25) rounded-[8px] max-[500px]:w-[70%]"
            >
              <h3 className=" text-primary-500 underline p-3 break-all">{e}</h3>

              <button>
                <Image
                  onClick={handleDeleteAllergic}
                  title={e}
                  className="absolute top-1 right-1"
                  src="/generator/Equis x.png"
                  width="10"
                  height="10"
                  alt=""
                />
              </button>
            </div>
          ))}
          {showInput.allergic && (
            <form
              className="relative w-[140px] h-[47px]"
              onSubmit={e => handleSubmitAllergic("allergic", allergic, e)}
            >
              <input
                type="text"
                className="relative w-[140px] h-[47px] flex items-center justify-center border shadow-[0px_0px_6px_rgba(0,0,0,0.25) rounded-[8px] border border-primary-500 px-3 text-primary-500 underline"
                onChange={e => handleChangeInput(setAllergic, e.target.value)}
              />
              <IconCheck
                onClick={e => handleSubmitAllergic("allergic", allergic, e)}
                className="absolute top-[25%] right-2"
                color="#FF8811"
              />
            </form>
          )}
          <button className="w-[20px] h-[20px]" onClick={() => show("allergic")}>
            <Image src="/generator/Addition.png" width="20" height="20" alt="Addition" />
          </button>
        </div>

        {/* DIETS */}
        <h1 className="text-3xl mt-10 mb-3 max-md:text-2xl">Diet</h1>
        <div className="w-[80%] grid grid-cols-4 gap-5 items-center  max-[1215px]:grid-cols-3 max-[680px]:w-full max-[680px]:gap-y-5 max-[680px]:gap-x-2 max-[680px]:grid-cols-2 max-[345px]:grid-cols-1 max-[345px]:gap-y-3 max-[345px]:mt-3 max-[345px]:mb-3">
          {DietsArray.data?.map((e: any) => (
            <div
              key={e.id}
              className="w-[80%] h-[47px] flex items-center justify-center border shadow-[0px_0px_6px_rgba(0,0,0,0.25) rounded-[8px] max-[345px]:w-[50%]"
            >
              <input
                type="checkbox"
                id={e.name}
                name="diet"
                className="hidden"
                value={e.name}
                onChange={handleChangeDiets}
              />
              <label htmlFor={e.name} className="w-[90%] flex items-center cursor-pointer">
                <div className="w-[18px] h-[18px] rounded-full border-2 border-primary-500 flex items-center justify-center">
                  {generator.diet.includes(e.name) && (
                    <span className="w-[10px] h-[10px] rounded-full bg-orange-500"></span>
                  )}
                </div>
                <span className="text-primary-500 ml-1">{e.name}</span>
              </label>
            </div>
          ))}
        </div>

        {/* CATEGORIES */}
        <h1 className="text-3xl mt-10 mb-3 max-md:text-2xl">Type of food</h1>
        <div className="w-[80%] grid grid-cols-4 items-center gap-5 max-[1215px]:grid-cols-3 max-[680px]:w-full max-[680px]:gap-y-5 max-[680px]:gap-x-2 max-[680px]:grid-cols-2 max-[345px]:grid-cols-1 max-[345px]:gap-y-3 max-[345px]:mt-3 max-[345px]:mb-3">
          {tipo.map((e, i) => (
            <div
              key={i}
              className="w-[80%] h-[47px] flex items-center justify-start border shadow-[0px_0px_6px_rgba(0,0,0,0.25) rounded-[8px] max-[345px]:w-[50%]"
            >
              <input
                type="checkbox"
                id={e}
                name="categories"
                className="hidden"
                value={e}
                onChange={handleChangeCategories}
              />
              <label htmlFor={e} className="w-[70%] flex items-center ml-2 cursor-pointer">
                <div className="w-[18px] h-[18px] rounded-full border-2 border-primary-500 flex items-center justify-center">
                  {generator.categories.includes(e) && (
                    <span className="w-[10px] h-[10px] rounded-full bg-orange-500"></span>
                  )}
                </div>
                <span className="text-primary-500 ml-1">{e}</span>
              </label>
            </div>
          ))}
        </div>

        {/* FLAVOR */}
        <h1 className="text-3xl mt-10 mb-3 max-md:text-2xl">Flavor</h1>
        <div className="w-[80%] grid grid-cols-4 gap-5 items-center max-[1215px]:grid-cols-3 max-[680px]:w-full max-[680px]:gap-y-5 max-[680px]:gap-x-2 max-[680px]:grid-cols-2 max-[345px]:grid-cols-1 max-[345px]:gap-y-3 max-[345px]:mt-3 max-[345px]:mb-3">
          {saborTipos.map((e, i) => (
            <div
              key={i}
              className="w-[80%] h-[47px] flex items-center justify-start border shadow-[0px_0px_6px_rgba(0,0,0,0.25) rounded-[8px] max-[345px]:w-[50%]"
            >
              <input
                type="checkbox"
                id={e}
                name="flavor"
                className="hidden"
                value={e}
                onChange={handleCheck}
              />
              <label htmlFor={e} className="w-[70%] flex items-center ml-2 cursor-pointer">
                <div className="w-[18px] h-[18px] rounded-full border-2 border-primary-500 flex items-center justify-center">
                  {generator.flavor === e && (
                    <span className="w-[10px] h-[10px] rounded-full bg-orange-500"></span>
                  )}
                </div>
                <span className="text-primary-500 ml-2">{e}</span>
              </label>
            </div>
          ))}
        </div>

        {/* DIFFICULTY */}
        <h1 className="text-3xl mt-10 mb-3 max-md:text-2xl">Difficulty</h1>
        <div className="w-[80%] grid grid-cols-4 gap-5 items-center  max-[1215px]:grid-cols-3 max-[680px]:w-full max-[680px]:gap-y-5 max-[680px]:gap-x-2 max-[680px]:grid-cols-2 max-[345px]:grid-cols-1 max-[345px]:gap-y-3 max-[345px]:mt-3 max-[345px]:mb-3">
          {dificultad.map((e, i) => (
            <div key={i}>
              <label
                htmlFor={e}
                className={`w-[80%] h-[47px] flex items-center justify-center border ${
                  generator.difficulty === e
                    ? "shadow-[0px_0px_6px_#FFB631]"
                    : "shadow-[0px_0px_6px_rgba(0,0,0,0.25)]"
                } cursor-pointer rounded-[8px] max-[345px]:w-[50%]`}
              >
                <span
                  className={`${
                    (e === "easy" && "text-[#44B852] capitalize") ||
                    (e === "medium" && "text-[#FFB631] capitalize") ||
                    (e === "hard" && "text-[#E63946] capitalize")
                  } font-bold text-[18px]`}
                >
                  {e}
                </span>
              </label>

              <input
                type="checkbox"
                id={e}
                name="difficulty"
                className="hidden"
                value={e}
                onChange={handleCheck}
              />
            </div>
          ))}
        </div>
        <div className="w-[78%] flex justify-end mt-10">
          <button
            onClick={handleSubmit}
            className="w-[210px] h-[52px] flex items-center justify-center px-[8px] py-[28px] bg-[#FF0087] text-[#FFFFFF] font-[600] text-[24px] leading-[36px] rounded-[8px]"
          >
            Create recipe
          </button>
        </div>
      </section>
    </div>
    // </ProtectedRoute>
  );
}
