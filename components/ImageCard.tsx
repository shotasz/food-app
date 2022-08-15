import React, { useState, useEffect } from "react";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";

import { BsThreeDotsVertical } from "react-icons/bs";
import { GoVerified } from "react-icons/go";

import { Video } from "../types";
import useAuthStore from "../store/authStore";
import { useRouter } from "next/router";

interface IProps {
  post: Video;
  removePostHandler: (postId: any) => void;
}

const ImageCard: NextPage<IProps> = ({ post, removePostHandler }) => {
  const [isClick, setIsClick] = useState(false);
  const [isProfilePage, setIsProfilePage] = useState(false);
  const { userProfile }: any = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (router.pathname.includes("/profile/[id]")) {
      setIsProfilePage(true);
    } else {
      setIsProfilePage(false);
    }
  }, [router]);

  return (
    <div className="flex flex-col">
      <div className="flex gap-4 relative">
        <div className="relative cursor-pointer">
          <Link href={`/detail/${post._id}`}>
            <div>
              <div>
                <Image
                  width={200}
                  height={280}
                  className="xl:w-[250px] lg:w-[280px] md:w-[300px] w-full h-[300px] object-cover transition-all duration-500 rounded-2xl brightness-110"
                  src={post.video.asset.url}
                  alt="profile photo"
                  priority={true}
                />
              </div>

              <p className="py-2 md:text-xl text-base">{post.caption}</p>
            </div>
          </Link>
          {userProfile && (
            <>
              {isProfilePage ? (
                <div
                  onClick={() => setIsClick(!isClick)}
                  className="absolute top-2 right-2 z-10 flex flex-col items-end"
                >
                  <div>
                    <BsThreeDotsVertical className="bg-white p-3 h-12 w-12 rounded hover:bg-gray-100" />
                  </div>
                  {isClick ? (
                    <>
                      <div className="bg-white h-10 w-16 text-base flex justify-center items-center rounded hover:bg-gray-100">
                        <button type="submit" className="p-2">
                          編集
                        </button>
                      </div>
                      <div className="bg-red-500 h-10 w-16 text-base text-white flex justify-center items-center rounded hover:bg-red-400">
                        <button
                          type="submit"
                          onClick={() => removePostHandler(post._id)}
                          className="p-2"
                        >
                          削除
                        </button>
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                ""
              )}
            </>
          )}
        </div>
      </div>

      <div className="flex cursor-pointer font-semibold w-full">
        <div className="md:w-10 w-8 md:h-10 h-8">
          <Link href={`/profile/${post.postedBy._id}`}>
            <>
              <Image
                width={42}
                height={42}
                className="rounded-xl"
                src={post.postedBy.image}
                alt="profile photo"
                priority={true}
              />
            </>
          </Link>
        </div>
        <div>
          <Link href={`/profile/${post.postedBy._id}`}>
            <div className="flex flex-col md:mx-3 mx-1">
              <p className="flex items-center md:text-base text-xs font-bold text-blue-600 hover:text-blue-400 transition-all">
                {post.postedBy.userName}
                <GoVerified className="text-blue-400 text-base ml-1 md:flex hidden" />
              </p>
              <p className="capitalize font-medium text-xs text-gray-500">
                {post.postedBy.userName}
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
