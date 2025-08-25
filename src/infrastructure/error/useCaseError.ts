export function handleUseCaseError(error: unknown, fallbackMessage = "Unexpected error"): Error {
  if (error instanceof Error) {
    return new Error(error.message);
  } else if (typeof error === "string") {
    return new Error(error);
  } else {
    return new Error(fallbackMessage);
  }
}
