function unavailable(): never {
  throw new Error("Automacoes ainda nao estao disponiveis.")
}

export const automationService = {
  processInbox: unavailable,
  generateDailyPlan: unavailable,
  generateWeeklyReview: unavailable,
  breakdownProject: unavailable,
  repurposeContent: unavailable,
  summarizeStudy: unavailable,
}
