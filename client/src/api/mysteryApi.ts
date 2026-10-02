import type {
  AnswerResponse,
  HintResponse,
  Mystery,
  MysteryListing,
} from "../features/mystery/mysteryTypes";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });
  } catch {
    throw new ApiError(
      "The case server could not be reached. Check your connection and retry.",
      0,
    );
  }

  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      typeof payload === "object" &&
      payload !== null &&
      "message" in payload &&
      typeof payload.message === "string"
        ? payload.message
        : `The request failed (${response.status}). Please retry.`;
    throw new ApiError(message, response.status);
  }

  return payload as T;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isMystery(value: unknown): value is Mystery {
  if (
    !isRecord(value) ||
    typeof value.id !== "string" ||
    typeof value.title !== "string" ||
    typeof value.summary !== "string" ||
    typeof value.stageIndex !== "number" ||
    !Number.isInteger(value.stageIndex) ||
    typeof value.solved !== "boolean" ||
    !Array.isArray(value.stages) ||
    value.stages.length === 0
  ) {
    return false;
  }

  const stagesAreValid = value.stages.every((stage) => {
    if (
      !isRecord(stage) ||
      typeof stage.id !== "string" ||
      typeof stage.title !== "string" ||
      typeof stage.prompt !== "string" ||
      !Array.isArray(stage.clues)
    ) {
      return false;
    }

    return stage.clues.every(
      (clue) =>
        isRecord(clue) &&
        typeof clue.id === "string" &&
        typeof clue.title === "string" &&
        typeof clue.detail === "string",
    );
  });
  const revealIsValid =
    value.reveal === undefined ||
    (isRecord(value.reveal) &&
      typeof value.reveal.title === "string" &&
      typeof value.reveal.verdict === "string" &&
      typeof value.reveal.details === "string");

  return (
    stagesAreValid &&
    revealIsValid &&
    value.stageIndex >= 0 &&
    (value.solved
      ? value.stageIndex <= value.stages.length
      : value.stageIndex < value.stages.length)
  );
}

function isMysteryListing(value: unknown): value is MysteryListing {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.summary === "string" &&
    (value.difficulty === undefined || typeof value.difficulty === "string") &&
    (value.durationMinutes === undefined ||
      (typeof value.durationMinutes === "number" &&
        value.durationMinutes >= 0)) &&
    (value.stageCount === undefined ||
      (typeof value.stageCount === "number" && value.stageCount >= 0)) &&
    (value.available === undefined || typeof value.available === "boolean")
  );
}

export async function getMysteries(): Promise<MysteryListing[]> {
  const payload = await request<unknown>("/mysteries");
  if (!Array.isArray(payload) || !payload.every(isMysteryListing)) {
    throw new ApiError(
      "The case server returned an invalid mystery list.",
      502,
    );
  }
  return payload;
}

function requireMystery(value: unknown): Mystery {
  if (!isMystery(value)) {
    throw new ApiError(
      "The case server returned incomplete or invalid case data.",
      502,
    );
  }
  return value;
}

export async function getMystery(mysteryId: string): Promise<Mystery> {
  return requireMystery(
    await request<unknown>(`/mysteries/${encodeURIComponent(mysteryId)}`),
  );
}

export async function submitMysteryAnswer(
  mysteryId: string,
  stageId: string,
  answer: string,
): Promise<AnswerResponse> {
  const payload = await request<unknown>(
    `/mysteries/${encodeURIComponent(mysteryId)}/answers`,
    {
      method: "POST",
      body: JSON.stringify({ stageId, answer }),
    },
  );
  if (
    !isRecord(payload) ||
    typeof payload.correct !== "boolean" ||
    typeof payload.message !== "string" ||
    !isMystery(payload.mystery)
  ) {
    throw new ApiError(
      "The case server returned an invalid answer result.",
      502,
    );
  }
  return payload as AnswerResponse;
}

export async function requestMysteryHint(
  mysteryId: string,
  stageId: string,
): Promise<HintResponse> {
  const payload = await request<unknown>(
    `/mysteries/${encodeURIComponent(mysteryId)}/hint`,
    {
      method: "PATCH",
      body: JSON.stringify({ stageId }),
    },
  );
  if (
    !isRecord(payload) ||
    typeof payload.hint !== "string" ||
    (payload.mystery !== undefined && !isMystery(payload.mystery))
  ) {
    throw new ApiError("The case server returned an invalid hint result.", 502);
  }
  return payload as HintResponse;
}
