import React, { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import Link from "next/link";
import { GoVerified } from "react-icons/go";
import { AiOutlineSend, AiOutlineLoading } from "react-icons/ai";

import useAuthStore from "../store/authStore";
import NoResults from "./NoResults";
import { IUser } from "../types";

interface IProps {
  isPostingComment: Boolean;
  comment: string;
  setComment: Dispatch<SetStateAction<string>>;
  addComment: (e: React.FormEvent) => void;
  comments: IComment[];
}

interface IComment {
  comment: string;
  length?: number;
  _key: string;
  postedBy: { _ref?: string; _id?: string };
}

const Comments = ({
  comment,
  setComment,
  addComment,
  comments,
  isPostingComment,
}: IProps) => {
  const { userProfile, allUsers } = useAuthStore();

  return (
    <div className="border-t-2 border-gray-200 md:pt-4 pt-2 md:px-8 px-2 bg-[#F8F8F8] border-b-2 md:pb-4 pb-2">
      <div className="overflow-scroll lg:h-[450px]">
        {comments?.length > 0 ? (
          comments?.map((item: IComment, idx: number) => (
            <div key={idx}>
              {allUsers?.map(
                (user: IUser) =>
                  user._id === (item.postedBy._ref || item.postedBy._id) && (
                    <div className=" p-2 items-center" key={idx}>
                      <Link href={`/profile/${user._id}`}>
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12">
                            <Image
                              width={48}
                              height={48}
                              className="rounded-full cursor-pointer"
                              src={user.image}
                              alt="user-profile"
                              layout="responsive"
                              priority={true}
                            />
                          </div>

                          <p className="flex cursor-pointer gap-1 items-center text-[18px] font-bold leading-6 text-primary">
                            {user.userName}{" "}
                            <GoVerified className="text-blue-400" />
                          </p>
                        </div>
                      </Link>
                      <div>
                        <p className="-mt-5 ml-16 text-[16px] mr-8">
                          {item.comment}
                        </p>
                      </div>
                    </div>
                  )
              )}
            </div>
          ))
        ) : (
          <NoResults text="コメントがありません" />
        )}
      </div>

      {userProfile && (
        <div className="pb-6">
          <form onSubmit={addComment} className="flex gap-4">
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="bg-primary px-6 py-4 text-md font-medium border-2 w-[250px] md:w-[700px] lg:w-[350px] border-gray-100 focus:outline-none focus:border-2 focus:border-gray-300 flex-1 rounded-lg"
              placeholder="コメントを追加.."
            />
            <button
              className="py-3 px-5 text-md bg-blue-400 rounded-2xl outline-none"
              onClick={addComment}
            >
              {isPostingComment ? (
                <AiOutlineLoading className="animate-spin text-white text-xl" />
              ) : (
                <AiOutlineSend className="text-white text-xl" />
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Comments;
