import React, { ChangeEvent } from "react";

interface IProps {
  ingredient: string;
  servings: string;
  handleChangeInput: (id: string, event: ChangeEvent<HTMLInputElement>) => void;
  id: string;
}

const InputComponent = ({
  servings,
  ingredient,
  handleChangeInput,
  id,
}: IProps) => {
  return (
    <div>
      <div className="flex">
        <div>
          <label className="text-sm font-medium">材料</label>
          <input
            type="text"
            name="ingredient"
            value={ingredient}
            onChange={(event) => handleChangeInput(id, event)}
            className="rounded outline-none text-base border-2 border-gray-200 p-2 w-full"
          />
        </div>
        <div>
          <label className="text-sm font-medium">単位</label>
          <input
            type="text"
            name="servings"
            value={servings}
            onChange={(event) => handleChangeInput(id, event)}
            className="rounded outline-none text-base border-2 border-gray-200 p-2 w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default InputComponent;
