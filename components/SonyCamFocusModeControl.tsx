import {
  FC,
  MouseEvent,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Button } from "semantic-ui-react";
import { SonyCamStatusContext } from "../lib/SonyCamStatusContext";

export const SonyCamFocusModeControl: FC = () => {
  const [disabled, setDisabled] = useState<boolean>(false);
  const status = useContext(SonyCamStatusContext);
  useEffect(() => {
    if (
      Array.isArray(status) &&
      status.find((s) => s && s.type === "focusMode")
    ) {
      setDisabled(false);
    }
  }, [status]);

  const focusMode: {
    focusModeCandidates: string[];
    type: "focusMode";
    currentFocusMode: string;
  } = useMemo(
    () =>
      Array.isArray(status)
        ? status.find((s) => s && s.type === "focusMode")
        : null,
    [status]
  );

  const focusModeCandidateCallbacks = useMemo(
    () =>
      Array.isArray(focusMode?.focusModeCandidates)
        ? focusMode.focusModeCandidates.map((focusMode) => {
            return (ev: MouseEvent) => {
              ev.preventDefault();
              setDisabled(true);
              fetch(
                `/api/sonycam/setFocusMode?value=${encodeURIComponent(
                  focusMode
                )}`
              );
            };
          })
        : [],
    [focusMode]
  );

  if (!Array.isArray(focusMode?.focusModeCandidates)) {
    return <Button basic inverted content="Unknown Focus Mode" fluid />;
  }

  return (
    <Button.Group fluid inverted>
      {focusMode.focusModeCandidates.map((mode, i) => (
        <Button
          key={i}
          icon={mode === focusMode.currentFocusMode ? "check circle" : "circle"}
          basic
          inverted
          content={mode}
          active={mode === focusMode.currentFocusMode}
          disabled={disabled}
          onClick={focusModeCandidateCallbacks[i]}
        />
      ))}
    </Button.Group>
  );
};
