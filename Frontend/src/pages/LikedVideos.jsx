import React from 'react'
import Likedvideo from '../components/likedvideo'

function LikedVideos({ showPopup }) {
  return (
    <div> 

        <Likedvideo showPopup={showPopup} />
    </div>
  )
}

export default LikedVideos