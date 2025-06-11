import React, { useState } from 'react'
import axios from 'axios'
import { Button, Input } from './index'

function Update() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleAccountUpdate = async (e) => {
    e.preventDefault();
    setMsg(""); setError("");
    try {
      await axios.patch("/api/users/update-account-detai1s", { fullname, email });
      setMsg("Account details updated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update account details.");
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setMsg(""); setError("");
    try {
      await axios.patch("/api/users/change-password", { oldPassword, newPassword });
      setMsg("Password updated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-900 rounded-lg shadow-lg text-white">
      <h2 className="text-2xl font-bold mb-4">Update Account</h2>
      {msg && <div className="mb-2 text-green-400">{msg}</div>}
      {error && <div className="mb-2 text-red-400">{error}</div>}
      <form onSubmit={handleAccountUpdate} className="space-y-4 mb-8">

        <div>
          <Input type="text" value={fullname} label=" Full Name" onChange={e => setFullname(e.target.value)} className="w-full p-2 rounded bg-gray-800 border border-gray-700" />
        </div>

        <div>
          <Input type="email" value={email} label="Email" onChange={e => setEmail(e.target.value)} className="w-full p-2 rounded bg-gray-800 border border-gray-700" />
        </div>

        <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 p-2 rounded font-semibold">Update Details</Button>

      </form>
      <h2 className="text-xl font-bold mb-2">Change Password</h2>
      <form onSubmit={handlePasswordUpdate} className="space-y-4">

        <div>
          <Input type="password" value={oldPassword} label="Old Password" onChange={e => setOldPassword(e.target.value)} className="w-full p-2 rounded bg-gray-800 border border-gray-700" />
        </div>

        <div>
          <Input type="password" value={newPassword} label="New Password"onChange={e => setNewPassword(e.target.value)} className="w-full p-2 rounded bg-gray-800 border border-gray-700" />
        </div>
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded font-semibold">Change Password</Button>
      </form>
    </div>
  )
}

export default Update