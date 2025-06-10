import React from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Profile from '../components/profile';

function Profilepage() {
  const { id } = useParams();
  const loggedInUser = useSelector((state) => state.auth.user);
  return (
    <div>
        <Profile username={id} loggedInUser={loggedInUser} />
    </div>
  )
}

export default Profilepage