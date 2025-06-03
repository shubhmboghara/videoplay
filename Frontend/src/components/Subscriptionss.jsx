import React, { useState, useEffect } from 'react';
import SubscribeButton from './SubscribeButton';
import { getsubscriptions } from '../hooks/getsubscriptions';
import Loader from './Loader';

export default function Subscriptionss() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

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
    <div className="min-h-screen  relative lg:left-60  bg-[#18181b]  px-20 py-5">
      <h1 className="text-3xl font-bold text-white mb-6">My Subscriptions</h1>
      {subscriptions.length === 0 ? (
        <p className="text-gray-400">No subscriptions found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative  ">
          {subscriptions.map((data) => (
            <div
              key={data._id}
              className="bg-[#2a2a31] hover:bg-[#33333b] transition-colors rounded-lg overflow-hidden shadow-md"
            >
              <div className="flex items-center p-4 space-x-4">
                <img
                  src={data.avatar}
                  alt={data.username}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#444]"
                />
                           

                <div className="flex-1 flex flex-col justify-center">
                  <h2 className="text-lg font-semibold text-white truncate">
                    {data.fullname}
                  </h2>
                  <p className="text-gray-400 text-sm">@{data.username}</p>
                  {/* <p className="text-gray-300 text-sm mt-1">
                    {data.subscriberCount.toLocaleString()} subscriber
                    {data.subscriberCount === 1 ? '' : 's'}
                  </p> */}
                </div>
              </div>

              <div className="px-4 pb-4">
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
