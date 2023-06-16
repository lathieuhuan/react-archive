const isObject = (obj: any) => {
  return obj?.toString() === "[object Object]";
};

const setValueFromPath = (obj: any, path: string | string[], value: any = null) => {
  const keys = Array.isArray(path) ? path : [path];
  let nested = obj;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    if (isObject(nested)) {
      if (isObject(nested?.[key])) {
        nested = nested[key];
      } else {
        if (i === keys.length - 1) {
          nested[key] = value;
        } else {
          const nextKey = keys[i + 1];
          nested[key] =
            typeof nextKey === "string"
              ? {
                  [nextKey]: undefined,
                }
              : [];

          nested = nested[key];
        }
      }
    }
  }
};
