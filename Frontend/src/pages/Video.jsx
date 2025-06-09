import React from 'react'
import { VideoDetails } from '../components/index'


function Video({ showPopup }) {
  return (

    <div  className=''>
      <VideoDetails showPopup={showPopup} />
    </div>
  )
}

export default Video