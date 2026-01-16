const getRevalidateTarget = (): number => {
  if (process.env.NODE_ENV === 'development') {
    return 0;
  }

  return process.env.DEFAULT_REVALIDATE_TARGET
    ? Number(process.env.DEFAULT_REVALIDATE_TARGET)
    : 3600;
};

export const revalidate = getRevalidateTarget();
