import React from "react";
import { Link } from "react-router-dom";
import { timeAgo } from "../utils";
import DefaultAvatar from "../assets/DefaultAvatar.png"

function formatDuration(durationInSeconds) {
  const totalSeconds = Math.floor(durationInSeconds);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

export default function VideoCard({
  id,
  thumbnail,
  title,
  channel,
  avatar,
  views,
  time,
  duration,
}) {
  return (
    <div className="block ">
      <div className="w-full rounded-lg overflow-hidden cursor-pointer bg-[#18181b]">
        <Link to={`/video/${id}`}>
          <div className="relative bg-[#18181b]">
            <img
              src={thumbnail} DefaultAvatar
              alt={title}
              className="w-full h-full object-cover"
            />
            <span className="bg-black px-2 py-0.5 rounded text-white text-xs absolute bottom-2 right-2">
              {formatDuration(duration)}
            </span>
          </div>
        </Link>

        <div className="p-3 flex gap-3">
          <Link to={`/profile/${channel}`}>
            <img  
              src={avatar && avatar.trim() !== "" ? avatar : DefaultAvatar}
              alt="channel avatar"
              className="w-10 h-10 rounded-full cursor-pointer"
              onError={e => { e.target.onerror = null; e.target.src = DefaultAvatar; }}
            />
          </Link>
          <div className="flex-1">
            <h3 className="text-white font-semibold truncate">{title}</h3>
            <div className="flex items-center text-gray-400 text-sm mt-1">
              <span className="truncate">{channel}</span>
            </div>
            <p className="text-gray-500 text-xs mt-1">
              {views} views · {timeAgo(time)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}