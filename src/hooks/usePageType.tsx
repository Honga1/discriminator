import { parsePageTypeQuery } from "../Routes";
import { useQuery } from "./useQuery";


export function usePageType() {
  const query = useQuery();
  return parsePageTypeQuery(query);
}
