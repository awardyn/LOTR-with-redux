export const handleException = (e) => {
  // Axios errors should already be handled by Axios interceptor, so only print non-Axios errors to the console
  if (!e.isAxiosError) {
    console.error(e);
  }
};
