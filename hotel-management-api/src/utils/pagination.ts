export const getPagination = (query: Record<string, unknown>): { limit: number; page: number; skip: number } => {
  const page = Number(query.page ?? 1);
  const limit = Math.min(Number(query.limit ?? 10), 100);

  return {
    page,
    limit,
    skip: (page - 1) * limit
  };
};
