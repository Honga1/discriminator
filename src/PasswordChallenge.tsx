import { SHA256 } from "crypto-js";
import { Grommet, TextInput } from "grommet";
import { store, useStore } from "./store/store";
import { customTheme } from "./theme";

const PasswordChallenge = () => {
  const backgroundColor = useStore((state) =>
    state.chapter !== undefined ? "black" : "yellow"
  );

  return (
    <Grommet
      theme={customTheme}
      style={{ width: "100%", height: "100%", overflowY: "auto" }}
      background={backgroundColor}
    >
      <TextInput
        placeholder="Password"
        onChange={(event) =>
          store.setState({
            allowed:
              SHA256(event.target.value).toString() ===
              "35ac26ab9bd62aab4fc4588cc6d327a4869eaf95c822fb371321ae41a46eb2e9",
          })
        }
      />
    </Grommet>
  );
};

export default PasswordChallenge;
