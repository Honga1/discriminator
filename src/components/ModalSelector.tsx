import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { About } from "../pages/plain/home/About";
import { Modal } from "../pages/plain/home/Modal";
import { Privacy } from "../pages/plain/home/Privacy";
import { colorTheme } from "./colorTheme";
import { useQuery } from "./PageContainer";

export const ModalSelector = () => {
  const query = useQuery();
  const history = useHistory();

  const close = useCallback(() => {
    query.delete("modal");
    history.push({
      ...history.location,
      search: query.toString(),
    });
  }, [history, query]);

  console.log(query.get("modal"));
  switch (query.get("modal")) {
    case "about":
      return (
        <Modal
          onClose={close}
          frameColor={colorTheme.blue}
          textColor={colorTheme.white}
          heading="About"
        >
          <About />
        </Modal>
      );
    case "privacy":
      return (
        <Modal
          onClose={close}
          frameColor={colorTheme.red}
          textColor={colorTheme.white}
          heading="Privacy"
        >
          <Privacy />
        </Modal>
      );
    case "credits":
      return (
        <Modal
          onClose={close}
          frameColor={colorTheme.green}
          textColor={colorTheme.white}
          heading="Credits"
        >
          <Privacy />
        </Modal>
      );
    default:
      return <></>;
  }
};
