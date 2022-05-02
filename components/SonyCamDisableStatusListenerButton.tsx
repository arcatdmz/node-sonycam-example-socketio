import { FC, useCallback, useEffect, useState } from "react";
import { Button } from "semantic-ui-react";
import { useSocketIO } from "../lib/useSocketIO";

export const SonyCamDisableStatusListenerButton: FC = () => {
  const socket = useSocketIO();
  const [disabled, setDisabled] = useState<boolean>(false);

  useEffect(() => {
    if (!socket) {
      return;
    }
    const statusChangeListener = () => {
      setDisabled(false);
    };
    socket.on("statusChange", statusChangeListener);
    const statusListenerEnabledListener = (enabled: boolean) => {
      setDisabled(!enabled);
    };
    socket.on("statusListenerEnabled", statusListenerEnabledListener);

    return () => {
      socket.off("statusChange", statusChangeListener);
      socket.off("statusListenerEnabled", statusListenerEnabledListener);
    };
  }, [socket]);

  const handleStopFetchingStatusClick = useCallback(() => {
    setDisabled(true);
    fetch("/api/sonycam/stopFetchingStatus");
  }, []);
  return (
    <Button
      icon="close"
      basic
      inverted
      content="Stop fetching status"
      size="mini"
      disabled={disabled}
      onClick={handleStopFetchingStatusClick}
    />
  );
};
