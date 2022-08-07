import React, { ChangeEvent, Dispatch, SetStateAction } from "react";
import { v4 as uuidv4 } from "uuid";
import useAuthStore from "../store/authStore";

interface IProps {
  id: string;
  recipe: string;
  recipes: IRecipe[];
  setRecipes: Dispatch<SetStateAction<IRecipe[]>>;
  handleChangeInput: (
    id: string,
    event: ChangeEvent<HTMLInputElement>,
    state: IRecipe[],
    setState: Dispatch<SetStateAction<IRecipe[]>>
  ) => void;
}

interface IRecipe {
  _type: string;
  _key: string;
  id: string;
  recipe: string;
}

const InputRecipes = ({
  id,
  recipe,
  recipes,
  setRecipes,
  handleChangeInput,
}: IProps) => {
  const { userProfile }: { userProfile: any } = useAuthStore();
  const handleAddFields = () => {
    setRecipes([
      ...recipes,
      {
        _type: "recipes",
        _key: userProfile?._id,
        id: uuidv4(),
        recipe: "",
      },
    ]);
  };

  const handleRemoveFields = (id: string) => {
    const values = [...recipes];
    values.splice(
      values.findIndex((value) => value.id === id),
      1
    );
    setRecipes(values);
  };
  return (
    <div>
      <div className="flex">
        <div className="mr-2 flex w-full justify-center items-center">
          <label className="text-sm font-medium p-2 w-8">1</label>
          <input
            type="text"
            name="recipe"
            value={recipe}
            onChange={(event) =>
              handleChangeInput(id, event, recipes, setRecipes)
            }
            className="rounded outline-none text-base border-2 border-gray-200 p-2 w-full"
          />
        </div>

        {recipes.length > 1 ? (
          <div className="self-end mr-2">
            <button
              onClick={() => handleRemoveFields(id)}
              type="button"
              className="h-[44px] w-16 p-2 bg-red-500 text-white text-base rounded"
            >
              削除
            </button>
          </div>
        ) : (
          ""
        )}
        <div className="self-end">
          <button
            onClick={handleAddFields}
            type="button"
            className="h-[44px] w-16 p-2 bg-[#74CC2D] text-white text-base rounded"
          >
            追加
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputRecipes;
