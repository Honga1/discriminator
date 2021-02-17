import { useMemo } from "react";
import { useLocation } from "react-router-dom";

export function useQuery() {
  const location = useLocation().search;
  return useMemo(() => new URLSearchParams(location), [location]);
}
