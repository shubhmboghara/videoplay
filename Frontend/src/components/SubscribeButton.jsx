import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HiUsers } from 'react-icons/hi';
import { toggleSubscription } from '../redux/slices/subscriptionSlice';
import { Button, VideoCard } from './index';

export default function SubscribeButton({
    channelId,
    initialSubscribed = false,
    currentCount = 0,
    onCountChange = () => { }
}) {

    const dispatch = useDispatch();
    const { subscribedChannels, loading: subscriptionLoading } = useSelector(
        (state) => state.subscription
    );

    const isSubscribed =
        channelId in subscribedChannels
            ? subscribedChannels[channelId]
            : initialSubscribed;

    const handleClick = useCallback(() => {
        if (!channelId) return;

        dispatch(toggleSubscription(channelId)).then((action) => {
            if (toggleSubscription.fulfilled.match(action)) {
                const { subscribed } = action.payload;

                let newCount = currentCount;
                if (subscribed) {
                    newCount = currentCount;
                } else if (currentCount > 0) {
                    newCount = currentCount - 1;
                }
                onCountChange(newCount);
            }
        });
    }, [channelId, dispatch, currentCount, onCountChange]);

    return (
            <Button
                onClick={handleClick}
                disabled={subscriptionLoading}
                className={`
        flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold
        transition-all duration-200
        ${isSubscribed
                        ? 'bg-gray-700 text-white hover:bg-gray-700 border border-gray-600'
                        : 'bg-purple-600 text-white hover:bg-purple-800 border border-gray-600'
                    }
        disabled:opacity-50
        ${subscriptionLoading ? 'cursor-not-allowed' : 'cursor-pointer'}
      `}
            >
                <HiUsers className="h-5 w-5" />
                {subscriptionLoading
                    ? '...'
                    : isSubscribed
                        ? 'Subscribed'
                        : 'Subscribe'}
            </Button>
        </div>
    );
}
