import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getMystery,
  requestMysteryHint,
  submitMysteryAnswer,
} from "../../api/mysteryApi";
import type { Mystery } from "./mysteryTypes";
import type { RootState } from "../../store";

type ThunkConfig = { rejectValue: string; state: RootState };

type Feedback = {
  kind: "success" | "error";
  message: string;
};

type MysteryState = {
  current: Mystery | null;
  requestedId: string | null;
  loadStatus: "idle" | "loading" | "succeeded" | "failed";
  isSubmitting: boolean;
  isRequestingHint: boolean;
  error: string | null;
  mutationError: string | null;
  feedback: Feedback | null;
  hint: string | null;
};

const initialState: MysteryState = {
  current: null,
  requestedId: null,
  loadStatus: "idle",
  isSubmitting: false,
  isRequestingHint: false,
  error: null,
  mutationError: null,
  feedback: null,
  hint: null,
};

function errorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Something went wrong. Please retry.";
}

export const loadMystery = createAsyncThunk<Mystery, string, ThunkConfig>(
  "mystery/load",
  async (mysteryId, { rejectWithValue }) => {
    try {
      return await getMystery(mysteryId);
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  },
  {
    condition: (mysteryId, { getState }) => {
      const state = getState().mystery;
      return !(
        state.loadStatus === "loading" && state.requestedId === mysteryId
      );
    },
  },
);

export const submitAnswer = createAsyncThunk<
  { correct: boolean; message: string; mystery: Mystery },
  { mysteryId: string; stageId: string; answer: string },
  ThunkConfig
>("mystery/submitAnswer", async (payload, { rejectWithValue }) => {
  try {
    return await submitMysteryAnswer(
      payload.mysteryId,
      payload.stageId,
      payload.answer,
    );
  } catch (error) {
    return rejectWithValue(errorMessage(error));
  }
});

export const requestHint = createAsyncThunk<
  { hint: string; mystery?: Mystery },
  { mysteryId: string; stageId: string },
  ThunkConfig
>("mystery/requestHint", async (payload, { rejectWithValue }) => {
  try {
    return await requestMysteryHint(payload.mysteryId, payload.stageId);
  } catch (error) {
    return rejectWithValue(errorMessage(error));
  }
});

const mysterySlice = createSlice({
  name: "mystery",
  initialState,
  reducers: {
    clearFeedback(state) {
      state.feedback = null;
      state.mutationError = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(loadMystery.pending, (state, action) => {
        state.loadStatus = "loading";
        state.requestedId = action.meta.arg;
        state.current = null;
        state.isSubmitting = false;
        state.isRequestingHint = false;
        state.error = null;
        state.mutationError = null;
        state.feedback = null;
        state.hint = null;
      })
      .addCase(loadMystery.fulfilled, (state, action) => {
        if (action.meta.arg !== state.requestedId) return;
        state.loadStatus = "succeeded";
        state.current = action.payload;
      })
      .addCase(loadMystery.rejected, (state, action) => {
        if (action.meta.arg !== state.requestedId) return;
        state.loadStatus = "failed";
        state.error =
          action.payload ?? action.error.message ?? "Unable to load this case.";
      })
      .addCase(submitAnswer.pending, (state) => {
        state.isSubmitting = true;
        state.mutationError = null;
        state.feedback = null;
      })
      .addCase(submitAnswer.fulfilled, (state, action) => {
        if (action.meta.arg.mysteryId !== state.requestedId) return;
        state.isSubmitting = false;
        state.current = action.payload.mystery;
        state.hint = null;
        state.feedback = {
          kind: action.payload.correct ? "success" : "error",
          message: action.payload.message,
        };
      })
      .addCase(submitAnswer.rejected, (state, action) => {
        if (action.meta.arg.mysteryId !== state.requestedId) return;
        state.isSubmitting = false;
        state.mutationError =
          action.payload ??
          action.error.message ??
          "The answer could not be submitted.";
      })
      .addCase(requestHint.pending, (state) => {
        state.isRequestingHint = true;
        state.mutationError = null;
      })
      .addCase(requestHint.fulfilled, (state, action) => {
        if (action.meta.arg.mysteryId !== state.requestedId) return;
        state.isRequestingHint = false;
        state.hint = action.payload.hint;
        if (action.payload.mystery) state.current = action.payload.mystery;
      })
      .addCase(requestHint.rejected, (state, action) => {
        if (action.meta.arg.mysteryId !== state.requestedId) return;
        state.isRequestingHint = false;
        state.mutationError =
          action.payload ??
          action.error.message ??
          "The hint could not be loaded.";
      });
  },
});

export const { clearFeedback } = mysterySlice.actions;
export default mysterySlice.reducer;
