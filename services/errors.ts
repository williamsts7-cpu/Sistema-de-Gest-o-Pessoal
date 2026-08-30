export class ServiceError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message)
    this.name = "ServiceError"
  }
}

export function serviceError(message: string, cause: unknown): never {
  throw new ServiceError(message, cause)
}
