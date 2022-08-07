import React, { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import useAuthStore from "../store/authStore";

interface IProps {
  ingredient: string;
  servings: string;
  handleChangeInput: (
    id: string,
    event: ChangeEvent<HTMLInputElement>,
    state: IIngredients[],
    setState: Dispatch<SetStateAction<IIngredients[]>>
  ) => void;
  id: string;
  inputFields: IIngredients[];
  setInputFields: Dispatch<SetStateAction<IIngredients[]>>;
  idx: number;
}

interface IIngredients {
  _type: string;
  _key: string;
  id: string;
  servings: string;
  ingredient: string;
}

const InputComponent = ({
  servings,
  ingredient,
  handleChangeInput,
  id,
  inputFields,
  setInputFields,
  idx,
}: IProps) => {
  const { userProfile }: { userProfile: any } = useAuthStore();
  const handleAddFields = () => {
    setInputFields([
      ...inputFields,
      {
        _type: "ingredients",
        _key: userProfile?._id,
        id: uuidv4(),
        servings: "",
        ingredient: "",
      },
    ]);
  };

  console.log(inputFields.slice(-1)[0] === inputFields[idx]);

  const handleRemoveFields = (id: string) => {
    const values = [...inputFields];
    values.splice(
      values.findIndex((value) => value.id === id),
      1
    );
    setInputFields(values);
  };
  return (
    <div>
      <div className="flex">
        <div className="mr-2">
          <label className="text-sm font-medium">
            {idx === 0 ? "材料" : ""}
          </label>
          <input
            type="text"
            name="ingredient"
            value={ingredient}
            onChange={(event) =>
              handleChangeInput(id, event, inputFields, setInputFields)
            }
            className="rounded outline-none text-base border-2 border-gray-200 p-2 w-full"
          />
        </div>
        <div className="mr-2">
          <label className="text-sm font-medium">
            {idx === 0 ? "単位" : ""}
          </label>
          <input
            type="text"
            name="servings"
            value={servings}
            onChange={(event) =>
              handleChangeInput(id, event, inputFields, setInputFields)
            }
            className="rounded outline-none text-base border-2 border-gray-200 p-2 w-full"
          />
        </div>

        {inputFields.slice(-1)[0] === inputFields[idx] ? (
          <div className="self-end">
            <button
              onClick={handleAddFields}
              type="button"
              className="h-[44px] w-16 p-2 bg-[#74CC2D] text-white text-base rounded"
            >
              追加
            </button>
          </div>
        ) : (
          <div className="self-end">
            <button
              onClick={() => handleRemoveFields(id)}
              type="button"
              className="h-[44px] w-16 p-2 bg-red-500 text-white text-base rounded"
            >
              削除
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InputComponent;
