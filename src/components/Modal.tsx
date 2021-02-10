import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { About } from "../pages/plain/home/About";
import { useQuery } from "./PageContainer";

export const Modal = () => {
  const query = useQuery();
  const history = useHistory();

  const close = useCallback(() => {
    query.delete("modal");
    history.push({
      ...history.location,
      search: query.toString(),
    });
  }, [history, query]);

  switch (query.get("modal")) {
    case "about":
      return <About onClose={close} />;
    default:
      return <></>;
  }
};
