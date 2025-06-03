import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { togglesubscribe } from '../../hooks/toggleSubscribe';

export const toggleSubscription = createAsyncThunk(
  'subscription/toggleSubscription',
  async (channelId, { rejectWithValue }) => {
    try {
      const response = await togglesubscribe(channelId);
      return { channelId, subscribed: response.data.subscribed };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Toggle subscription failed');
    }
  }
);

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState: {
    subscribedChannels: {}, 
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
        const { channelId, subscribed } = action.payload;
        state.subscribedChannels[channelId] = subscribed;
        state.loading = false;
      })
      .addCase(toggleSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default subscriptionSlice.reducer;
