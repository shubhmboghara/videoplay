import React from "react";
import { Link } from "react-router-dom";

export default function VideoCard({
  id,
  thumbnail,
  title,
  channel,
  avatar,
  views,
  time,
  className = "",
  classNameImg = ""
}) {
  return (
    <Link to={`/video/${id}`} className="block my-5 lg:w-73">
      <div className={` rounded-lg overflow-hidden cursor-pointer bg-[#1f2937] ${className}`}>
        <img
          src={thumbnail}
          alt={title}
          className={`w-full object-contain ${classNameImg}`}
        />

        <div className="p-3 flex gap-3">
          <img
            src={avatar}
            alt="channel avatar"
            className="w-10 h-10 rounded-full"
          />

          <div className="flex-1">
            <h3 className="text-white font-semibold truncate">{title}</h3>
            <div className="flex items-center text-gray-400 text-sm mt-1">
              <span className="truncate">{channel}</span>
            </div>
            <p className="text-gray-500 text-xs mt-1">
              {views} • {time}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
