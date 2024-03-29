import React, { useState, ChangeEvent } from "react";
import { useRouter } from "next/router";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Image from "next/image";
import axios from "axios";
import { SanityAssetDocument } from "@sanity/client";
import InputComponent from "../../components/InputComponent";
import { v4 as uuidv4 } from "uuid";

import useAuthStore from "../../store/authStore";
import { client } from "../../utils/client";
import { topics } from "../../utils/constants";
import { BASE_URL } from "../../utils";
import InputRecipes from "../../components/InputRecipes";

const Upload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageAsset, setImageAsset] = useState<
    SanityAssetDocument | undefined
  >();
  const [wrongFileType, setWrongFileType] = useState(false);
  const [savingPost, setSavingPost] = useState(false);
  const router = useRouter();
  const { userProfile }: { userProfile: any } = useAuthStore();

  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState(topics[0].name);
  const [inputFields, setInputFields] = useState([
    {
      _type: "ingredients",
      _key: userProfile?._id,
      id: uuidv4(),
      servings: "",
      ingredient: "",
    },
  ]);
  const [recipes, setRecipes] = useState([
    {
      _type: "recipes",
      _key: userProfile?._id,
      id: uuidv4(),
      recipe: "",
    },
  ]);

  const uploadRecipe = async (e: any) => {
    const selectedFile = e.target.files[0];
    const fileTypes = ["image/jpeg", "image/png"];

    if (fileTypes.includes(selectedFile.type)) {
      setIsLoading(true);
      client.assets
        .upload("file", selectedFile, {
          contentType: selectedFile.type,
          filename: selectedFile.name,
        })
        .then((data) => {
          setImageAsset(data);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
      setWrongFileType(true);
    }
  };

  const handlePost = async () => {
    if (caption && imageAsset?._id && category && inputFields && recipes) {
      setSavingPost(true);

      const document = {
        _type: "post",
        caption,
        video: {
          _type: "file",
          asset: {
            _type: "reference",
            _ref: imageAsset?._id,
          },
        },
        userId: userProfile?._id,
        postedBy: {
          _type: "postedBy",
          _ref: userProfile?._id,
        },
        topic: category,
        ingredients: inputFields,
        recipes: recipes,
      };

      await axios.post(`${BASE_URL}/api/post`, document);

      router.push("/");
    }
  };

  const handleChangeInput = (
    id: string,
    event: ChangeEvent<HTMLInputElement>,
    state: {}[],
    setState: any
  ) => {
    const newInputFields = state.map((inputField: any) => {
      if (id === inputField.id) {
        inputField[event.target.name] = event.target.value;
      }
      return inputField;
    });

    setState(newInputFields);
  };

  return (
    <div className="flex w-full absolute left-0 top-[80px] mb-10 pt-10 lg:pt-20 pb-20 bg-[#F8F8F8]">
      <div className="bg-white rounded-lg h-full md:w-[950px] w-full mx-auto flex gap-10 flex-wrap justify-around items-center p-4 py-16">
        <div className="self-start">
          <div>
            <p className="text-2xl font-bold">画像をアップロード</p>
            <p className="text-base text-gray-400 mt-1">
              レシピのイメージ画像をここで投稿して下さい
            </p>
          </div>
          <div className="border-dashed rounded-xl md:border-4 border-2 border-gray-200 flex flex-col justify-center items-center outline-none mt-10 md:w-[360px] w-[320px] md:h-[460px] h-[420px] p-10 cursor-pointer hover:border-red-300 hover:bg-gray-100">
            {isLoading ? (
              <p>アップロード中...</p>
            ) : (
              <div>
                {imageAsset ? (
                  <div>
                    <Image
                      width={300}
                      height={400}
                      className="h-full w-full object-cover"
                      src={imageAsset.url}
                      alt="profile photo"
                      priority={true}
                    />
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="flex flex-col items-center justify-center">
                        <p className="font-bold text-xl">
                          <FaCloudUploadAlt className="text-gray-300 text-6xl" />
                        </p>
                        <p className="text-xl font-semibold">
                          画像をアップロード
                        </p>
                      </div>
                      <p className="text-gray-400 text-center mt-10 text-sm leading-10">
                        pngまたはjpg <br />
                        640x960以上 <br />
                        5MB以内のファイルを選択して下さい <br />
                      </p>
                      <p className="bg-[#74CC2D] text-center mt-10 rounded text-white text-base font-medium p-2 w-52 outline-none">
                        ファイルを選択
                      </p>
                    </div>
                    <input
                      type="file"
                      name="upload-recipe"
                      onChange={uploadRecipe}
                      className="w-0 h-0"
                    />
                  </label>
                )}
              </div>
            )}
            {wrongFileType && (
              <p className="text-center text-xl text-red-400 font-semibold mt-4 w-[250px]">
                上記以外のファイルを選択できません
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-3 mt-20 md:w-[360px] w-[320px]">
          <label className="text-base font-medium">レシピ名</label>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="rounded outline-none text-base border-2 border-gray-200 p-2"
          />

          <label className="text-base font-medium">カテゴリー選択</label>
          <select
            onChange={(e) => setCategory(e.target.value)}
            className="outline-none text-base border-2 border-gray-200 p-2 capitalize lg:p-4 rounded cursor-pointer"
          >
            {topics.map((topic) => (
              <option
                key={topic.name}
                className="outline-none capitalize bg-white text-gray-700 text-base p-2 hover:bg-slate-300"
                value={topic.name}
              >
                {topic.ja}
              </option>
            ))}
          </select>

          <label className="text-base font-medium">レシピ</label>
          {inputFields.map((inputField, idx) => (
            <div key={inputField.id}>
              <InputComponent
                id={inputField.id}
                servings={inputField.servings}
                ingredient={inputField.ingredient}
                handleChangeInput={handleChangeInput}
                inputFields={inputFields}
                setInputFields={setInputFields}
                idx={idx}
              />
            </div>
          ))}

          <label className="text-base font-medium">作り方</label>
          {recipes.map((recipe, idx) => (
            <div key={recipe.id}>
              <InputRecipes
                id={recipe.id}
                recipe={recipe.recipe}
                recipes={recipes}
                setRecipes={setRecipes}
                handleChangeInput={handleChangeInput}
                idx={idx}
              />
            </div>
          ))}

          <div className="flex gap-6 mt-10">
            <button
              onClick={handlePost}
              type="button"
              className="border-gray-300 border-2 text-base font-medium p-2 rounded w-1/2 outline-none"
            >
              削除
            </button>
            <button
              onClick={handlePost}
              type="button"
              className="bg-[#74CC2D] text-white text-base font-medium p-2 rounded w-1/2 outline-none"
            >
              投稿
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
