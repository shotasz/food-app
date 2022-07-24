import React, { useState, useEffect, useRef } from "react";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { HiVolumeUp, HiVolumeOff } from "react-icons/hi";
import { BsPlay, BsFillPlayFill, BsFillPauseFill } from "react-icons/bs";
import { GoVerified } from "react-icons/go";

import { Video } from "../types";

interface IProps {
  post: Video;
}

const VideoCard: NextPage<IProps> = ({ post }) => {
  const [isHover, setIsHover] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const onVideoPress = () => {
    if (playing) {
      videoRef?.current?.pause();
      setPlaying(false);
    } else {
      videoRef?.current?.play();
      setPlaying(true);
    }
  };

  useEffect(() => {
    if (videoRef?.current) {
      videoRef.current.muted = isVideoMuted;
    }
  }, [isVideoMuted]);

  return (
    <div className="flex flex-col">
      <div className="flex gap-4 relative">
        <div
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          className="rounded-3xl cursor-pointer"
        >
          <Link href={`/detail/${post._id}`}>
            <div>
              <video
                ref={videoRef}
                loop
                className="xl:w-[250px] lg:w-[280px] md:w-[300px] w-full h-[300px] object-cover rounded-2xl"
                src={post.video.asset.url}
              ></video>
              <div>
                <p className="py-2 text-xl">{post.caption}</p>
              </div>
            </div>
          </Link>

          {/* {isHover && (
            <div className="absolute bottom-6 cursor-pointer left-8 md:left-14 lg:left-0 flex gap-10 lg:justify-between w-[100px] md:w-[50px] p-3">
              {playing ? (
                <button onClick={onVideoPress}>
                  <BsFillPauseFill className="text-black text-2xl lg:text-4xl" />
                </button>
              ) : (
                <button onClick={onVideoPress}>
                  <BsFillPlayFill className="text-black text-2xl lg:text-4xl" />
                </button>
              )}
              {isVideoMuted ? (
                <button onClick={() => setIsVideoMuted(false)}>
                  <HiVolumeOff className="text-black text-2xl lg:text-4xl" />
                </button>
              ) : (
                <button onClick={() => setIsVideoMuted(true)}>
                  <HiVolumeUp className="text-black text-2xl lg:text-4xl" />
                </button>
              )}
            </div>
          )} */}
        </div>
      </div>

      <div className="flex cursor-pointer font-semibold xl:w-[250px] lg:w-[280px] md:w-[300px] w-full">
        <div className="w-10 h-10">
          <Link href={`/profile/${post.postedBy._id}`}>
            <>
              <Image
                width={40}
                height={40}
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
            <div className="flex flex-col mx-4">
              <p className="flex items-center md:text-sm font-bold text-primary">
                {post.postedBy.userName}
                <GoVerified className="text-blue-400 text-base ml-1" />
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

export default VideoCard;
