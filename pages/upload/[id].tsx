import { SanityAssetDocument } from "@sanity/client";
import Image from "next/image";
import axios from "axios";
import React, { ChangeEvent, useEffect, useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import useAuthStore from "../../store/authStore";
import { topics } from "../../utils/constants";
import { Video } from "../../types";
import { BASE_URL } from "../../utils";
import { v4 as uuidv4 } from "uuid";
import { client } from "../../utils/client";
import InputComponent from "../../components/InputComponent";
import InputRecipes from "../../components/InputRecipes";
import { useRouter } from "next/router";

interface IProps {
  data: Video;
}

const UploadPatch = ({ data }: IProps) => {
  const { caption, video, ingredients, recipes, topic, _id } = data;
  const [isLoading, setIsLoading] = useState(false);
  const [wrongFileType, setWrongFileType] = useState(false);
  const router = useRouter();
  const { userProfile }: { userProfile: any } = useAuthStore();

  const [savingPost, setSavingPost] = useState(false);
  const [imageAsset, setImageAsset] = useState<
    SanityAssetDocument | undefined
  >();
  const [changeCaption, setChangeCaption] = useState(caption);
  const [changeCategory, setChangeCategory] = useState(topic);
  const [inputFields, setInputFields] = useState(ingredients);
  const [inputRecipes, setInputRecipes] = useState(recipes);

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
    if (
      changeCaption &&
      (imageAsset?._id || video.asset?._id) &&
      changeCategory &&
      inputFields &&
      inputRecipes
    ) {
      const document = {
        _type: "post",
        _id: _id,
        caption: changeCaption,
        video: {
          _type: "file",
          asset: {
            _type: "reference",
            _ref: imageAsset?._id || video.asset?._id,
          },
        },
        userId: userProfile?._id,
        postedBy: {
          _type: "postedBy",
          _ref: userProfile?._id,
        },
        topic: changeCategory,
        ingredients: inputFields,
        recipes: inputRecipes,
      };

      await axios.patch(`${BASE_URL}/api/post/${_id}`, document);

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
          <div className="border-dashed rounded-xl md:border-4 border-2 border-gray-200 flex flex-col justify-center items-center outline-none mt-10 md:w-[400px] w-[320px] md:h-[600px] h-[520px] p-10 hover:border-red-300 hover:bg-gray-100">
            {isLoading ? (
              <p>アップロード中...</p>
            ) : (
              <div>
                <label>
                  <div className="flex flex-col items-center justify-center h-full">
                    {imageAsset ? (
                      <div>
                        <Image
                          width={300}
                          height={400}
                          className="h-full w-full object-cover p-4"
                          src={imageAsset.url}
                          alt="profile photo"
                          priority={true}
                        />
                      </div>
                    ) : (
                      <div>
                        <Image
                          width={300}
                          height={400}
                          className="h-full w-full object-cover p-4"
                          src={video.asset.url}
                          alt="profile photo"
                          priority={true}
                        />
                      </div>
                    )}

                    <p className="bg-[#74CC2D] text-center mt-10 rounded text-white text-base font-medium p-2 md:w-1/2 w-full outline-none cursor-pointer">
                      ファイルを選択
                    </p>

                    <input
                      type="file"
                      name="upload-recipe"
                      onChange={uploadRecipe}
                      className="w-0 h-0"
                    />
                  </div>
                </label>
              </div>
            )}
            {wrongFileType && (
              <p className="text-center text-xl text-red-400 font-semibold mt-4 w-[250px]">
                上記以外のファイルを選択できません
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-3 md:mt-20 mt-0 md:w-[360px] w-[320px]">
          <label className="text-base font-medium">レシピ名</label>
          <input
            type="text"
            value={changeCaption}
            onChange={(e) => setChangeCaption(e.target.value)}
            className="rounded outline-none text-base border-2 border-gray-200 p-2"
          />

          <label className="text-base font-medium">カテゴリー選択</label>
          <select
            onChange={(e) => setChangeCategory(e.target.value)}
            className="outline-none text-base border-2 border-gray-200 p-2 capitalize lg:p-4 rounded cursor-pointer"
          >
            {topics.map((item) => (
              <option
                key={item.name}
                className="outline-none capitalize bg-white text-gray-700 text-base p-2 hover:bg-slate-300"
                value={item.name}
              >
                {item.ja}
              </option>
            ))}
          </select>

          <label className="text-base font-medium">レシピ</label>
          {inputFields.map((ingredient, idx) => (
            <div key={ingredient.id}>
              <InputComponent
                id={ingredient.id}
                servings={ingredient.servings}
                ingredient={ingredient.ingredient}
                handleChangeInput={handleChangeInput}
                inputFields={inputFields}
                setInputFields={setInputFields}
                idx={idx}
              />
            </div>
          ))}

          <label className="text-base font-medium">作り方</label>
          {inputRecipes.map((recipe, idx) => (
            <div key={recipe.id}>
              <InputRecipes
                id={recipe.id}
                recipe={recipe.recipe}
                recipes={inputRecipes}
                setRecipes={setInputRecipes}
                handleChangeInput={handleChangeInput}
                idx={idx}
              />
            </div>
          ))}

          <div className="flex gap-6 mt-10">
            <button
              onClick={() => {}}
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

export const getServerSideProps = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const res = await axios.get(`${BASE_URL}/api/post/${id}`);

  return {
    props: {
      data: res.data,
    },
  };
};

export default UploadPatch;
