import React from 'react'
import { Login } from '../components/index'

function Loginpage({ showPopup }) {
  return (
    <div className='' >
        <Login showPopup={showPopup} />
    </div>
  )
}

export default Loginpage