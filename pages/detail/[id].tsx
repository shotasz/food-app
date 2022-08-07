import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { GoVerified } from "react-icons/go";
import { MdOutlineCancel } from "react-icons/md";
import { BsFillPlayFill } from "react-icons/bs";
import { HiVolumeUp, HiVolumeOff } from "react-icons/hi";
import axios from "axios";

import { BASE_URL } from "../../utils";
import { Video } from "../../types";
import useAuthStore from "../../store/authStore";
import LikeButton from "../../components/LikeButton";
import Comments from "../../components/Comments";

interface IProps {
  postDetails: Video;
}

const Detail = ({ postDetails }: IProps) => {
  const [post, setPost] = useState(postDetails);
  const router = useRouter();
  const { userProfile }: any = useAuthStore();
  const [comment, setComment] = useState("");
  const [isPostingComment, setIsPostingComment] = useState(false);

  const handleLike = async (like: boolean) => {
    if (userProfile) {
      const { data } = await axios.put(`${BASE_URL}/api/like`, {
        userId: userProfile._id,
        postId: post._id,
        like,
      });

      setPost({ ...post, likes: data.likes });
    }
  };

  const addComment = async (e: any) => {
    e.preventDefault();

    if (userProfile && comment) {
      setIsPostingComment(true);

      const { data } = await axios.put(`${BASE_URL}/api/post/${post._id}`, {
        userId: userProfile._id,
        comment,
      });

      setPost({ ...post, comments: data.comments });
      setComment("");
      setIsPostingComment(false);
    }
  };

  if (!post) return null;

  return (
    post && (
      <div className="flex w-full absolute left-0 top-0 bg-white flex-wrap lg:flex-nowrap">
        <div className="relative flex-2 w-full lg:w-9/12 flex justify-center items-start lg:pt-28">
          <div className="absolute top-6 left-2 lg:left-6 flex gap-6 z-50">
            <p className="cursor-pointer" onClick={() => router.back()}>
              <MdOutlineCancel className="text-black text-[35px]" />
            </p>
          </div>
          <div>
            <div className="w-full lg:pt-0 pt-20">
              <Image
                width={764}
                height={548}
                className="object-cover transition-all duration-500 md:rounded-2xl rounded-none"
                src={post.video.asset.url}
                alt="profile photo"
                priority={true}
              />
            </div>

            <div className="w-full pt-8 lg:hidden border-b-2 border-gray-200">
              <div className="flex gap-3 p-2 cursor-pointer font-semibold rounded">
                <div className="w-10 h-10">
                  <Link href="/">
                    <>
                      <Image
                        width={62}
                        height={62}
                        className="rounded-full"
                        src={post.postedBy.image}
                        alt="profile photo"
                        layout="responsive"
                        priority={true}
                      />
                    </>
                  </Link>
                </div>
                <div>
                  <Link href="/">
                    <div className="flex flex-col gap-2 mt-2">
                      <p className="flex gap-2 items-center md:text-base font-bold text-primary">
                        {post.postedBy.userName}
                        <GoVerified className="text-blue-400 text-base" />
                      </p>
                      <p className="capitalize font-medium text-xs text-gray-500 hidden md:block">
                        {post.postedBy.userName}
                      </p>
                    </div>
                  </Link>
                </div>
              </div>

              <p className="p-2 pt-4 text-3xl font-light text-gray-600">
                {post.caption}
              </p>

              <div className="mt-10 px-10 pb-4">
                {userProfile && (
                  <LikeButton
                    likes={post.likes}
                    handleLike={() => handleLike(true)}
                    handleDislike={() => handleLike(false)}
                  />
                )}
              </div>
            </div>

            <div className="w-full py-4 md:py-14 px-4">
              <h3 className="text-4xl font-light text-gray-600">材料</h3>

              <div className="py-8">
                {post &&
                  post.ingredients.map((item, idx) => (
                    <div key={idx} className="flex py-2 ">
                      <span className="text-2xl w-full border-b-2 border-dashed pb-2">
                        {item.ingredient}
                      </span>
                      <span className="text-2xl w-1/3 text-center border-b-2 border-dashed">
                        {item.servings}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="w-full px-4">
              <h4 className="text-4xl font-light text-gray-600">作り方</h4>

              <div className="py-8">
                {post &&
                  post.recipes.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-start items-center pt-4"
                    >
                      <span className="text-xl md:text-2xl font-light text-white h-full w-[40px] md:w-[60px] p-2 md:p-4 bg-[#74CC2D] rounded text-center mr-2 md:mr-4">
                        {idx + 1}
                      </span>
                      <p className="text-xl w-full">{item.recipe}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <div className="relative w-full lg:w-[500px]">
          <div className="mt-10 hidden lg:block">
            <div className="flex gap-3 p-2 cursor-pointer font-semibold rounded">
              <div className="w-16 h-16 ml-4">
                <Link href="/">
                  <>
                    <Image
                      width={62}
                      height={62}
                      className="rounded-full"
                      src={post.postedBy.image}
                      alt="profile photo"
                      layout="responsive"
                      priority={true}
                    />
                  </>
                </Link>
              </div>
              <div>
                <Link href="/">
                  <div className="flex flex-col gap-2 mt-3">
                    <p className="flex gap-2 items-center md:text-base font-bold text-primary">
                      {post.postedBy.userName}
                      <GoVerified className="text-blue-400 text-base" />
                    </p>
                    <p className="capitalize font-medium text-xs text-gray-500 hidden md:block">
                      {post.postedBy.userName}
                    </p>
                  </div>
                </Link>
              </div>
            </div>

            <p className="px-10 pt-4 text-3xl font-light text-gray-600">
              {post.caption}
            </p>

            <div className="mt-10 px-10 pb-4">
              {userProfile && (
                <LikeButton
                  likes={post.likes}
                  handleLike={() => handleLike(true)}
                  handleDislike={() => handleLike(false)}
                />
              )}
            </div>

            <Comments
              comment={comment}
              setComment={setComment}
              addComment={addComment}
              comments={post.comments}
              isPostingComment={isPostingComment}
            />
          </div>
        </div>
      </div>
    )
  );
};

export const getServerSideProps = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const { data } = await axios.get(`${BASE_URL}/api/post/${id}`);

  return {
    props: {
      postDetails: data,
    },
  };
};

export default Detail;
