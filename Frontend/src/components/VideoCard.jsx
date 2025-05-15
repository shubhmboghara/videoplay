import React from "react";
import { Link } from "react-router-dom";

export default function VideoCard({
  id,
  thumbnail,
  title,
  channel,
  dp,
  views,
  time
}) {
  return (

    <Link to={`/video/${id}`} className="block my-5 lg:w-73">
      <div className="bg-black rounded-lg overflow-hidden cursor-pointer my-5   lg:w-73   relative top-10 ">


        <img
          src={thumbnail}
          alt={title}
          className="lg:h-[175px] object-cover lg:w-full w-[500px] mr-5"
        />

        <div className="p-3 flex gap-3">
          <img
            src={dp}
            alt={`${channel} dp`}
            className="h-10 rounded-full flex-shrink-0 "
          />

          <div className="flex-1">
            <h3 className="text-white font-semibold truncate">{title}</h3>
            <div className="flex items-center text-gray-400 text-sm mt-1">
              <span className="truncate w500">{channel}</span>
            </div>
            <p className="text-gray-500 text-xs mt-1 w-100">
              {views} • {time} ago
            </p>
          </div>
        </div>

      </div>
    </Link>
  );
}
