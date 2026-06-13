type RouteValue = string | { readonly [key: string]: RouteValue };

export type AppRoutesType = {
  readonly [key: string]: RouteValue;
};
