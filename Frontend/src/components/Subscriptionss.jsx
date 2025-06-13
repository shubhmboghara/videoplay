import React, { useState, useEffect } from 'react';
import { DefaultAvatar, SubscribeButton, Loader } from "./index"
import { getsubscriptions } from '../hooks/getsubscriptions';
import { Link } from 'react-router-dom';

export default function Subscriptionss() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await getsubscriptions();

        setSubscriptions(response.data);
      } catch (err) {
        setError('Failed to fetch subscriptions.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const handleSubscriberCountChange = (channelId, newCount) => {
    setSubscriptions(prev =>
      prev.map(sub =>
        sub._id === channelId ? { ...sub, subscriberCount: newCount } : sub
      )
    );
  };

  const handleSubscribedFlagChange = (channelId, newFlag) => {
    setSubscriptions(prev =>
      prev.map(sub =>
        sub._id === channelId ? { ...sub, isSubscribed: newFlag } : sub
      )
    );
  };

  if (loading) {
    return <Loader message="Loading subscriptions..." />;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen relative  bg-[#18181b]  max-w-screen-2xl mx-auto xl:pl-65  ">
      <h1 className="text-3xl font-bold text-white mb-6 p-4">My Subscriptions</h1>
      {subscriptions.length === 0 ? (
        <p className="text-gray-400">No subscriptions found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4   lg:p-0 p-8 overflow-y-hidden">
          {subscriptions.map((data) => (
            <div
              key={data._id}
              className="bg-[#2a2a31] hover:shadow-lg hover:scale-[1.01] transition-all duration-200 ease-in-out rounded-lg overflow-hidden shadow-md flex flex-col justify-between h-full"
            >
              <div className="flex items-center p-4 space-x-4">
                <Link to={`/profile/${data.username}`}>
                  <img
                    src={data.avatar && data.avatar.trim() !== '' ? data.avatar : DefaultAvatar}
                    alt={data.username}
                    className="w-14 h-14 rounded-full object-cover object-center border-2 border-[#444] flex-shrink-0"
                    onError={e => { e.target.onerror = null; e.target.src = DefaultAvatar; }}
                  />
                </Link>

                <div className="flex-1 flex flex-col justify-center min-w-0">
                  <h2 className="text-lg font-semibold text-white truncate">
                    {data.fullname}
                  </h2>
                  <p className="text-gray-400 text-sm truncate">@{data.username}</p>
                </div>
              </div>
              <div className="px-4 pb-4 mt-auto">
                <SubscribeButton
                  channelId={data._id}
                  initialSubscribed={data.isSubscribed}
                  currentCount={data.subscriberCount}
                  onCountChange={(newCount) => {
                    handleSubscriberCountChange(data._id, newCount);
                    handleSubscribedFlagChange(data._id, !data.isSubscribed);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
