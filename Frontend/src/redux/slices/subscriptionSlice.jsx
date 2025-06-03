import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { togglesubscribe } from '../../hooks/toggleSubscribe';

export const toggleSubscription = createAsyncThunk(
  'subscription/toggleSubscription',
  async (channelId, { rejectWithValue }) => {
    try {
      const response = await togglesubscribe(channelId);
      return { channelId, subscribed: response.subscribed, subscribersCount: response.subscribersCount };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Toggle subscription failed');
    }
  }
);

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState: {
    subscribedChannels: {},
    subscribersCount: 0, // Add subscribersCount to the initial state
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(toggleSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleSubscription.fulfilled, (state, action) => {
        const { channelId, subscribed, subscribersCount } = action.payload; // Destructure subscribersCount from payload
        state.subscribedChannels[channelId] = subscribed;
        state.subscribersCount = subscribersCount; // Update subscribersCount in state
        state.loading = false;
      })
      .addCase(toggleSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default subscriptionSlice.reducer;
