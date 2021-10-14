const keys = ['user', 'database', 'expenditures'];

export const mixinSelectors = {
  isLoading:
    (includeInitial = true) =>
    (s) =>
      keys.some((k) =>
        includeInitial
          ? ['loading', 'initial'].includes(s[k].status)
          : s[k].status === 'loading'
      ),
};
