import React from 'react'
import UserWatchHistory from '../components/UserWatchHistory'

function VideosHistory({ showPopup }) {
  return (
    <div>
      <UserWatchHistory showPopup={showPopup} />

    </div>
  )
}

export default VideosHistory