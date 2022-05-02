import { FC, useContext, useMemo } from "react";
import { List } from "semantic-ui-react";
import { SonyCamStatusContext } from "../lib/SonyCamStatusContext";
import { SonyCamZoomControl } from "./SonyCamZoomControl";

export const SonyCamStatusControls: FC = () => {
  const status = useContext(SonyCamStatusContext);
  const cameraStatus = useMemo(
    () =>
      Array.isArray(status)
        ? status.find((s) => s && s.type === "cameraStatus")
        : null,
    [status]
  );
  const liveviewStatus = useMemo(
    () =>
      Array.isArray(status)
        ? status.find((s) => s && s.type === "liveviewStatus")
        : null,
    [status]
  );
  return (
    <List inverted>
      <List.Item>
        <List.Content>
          <List.Header>Camera status:</List.Header>
          <List.Description>
            {cameraStatus?.cameraStatus || "UNKNOWN"}
          </List.Description>
        </List.Content>
      </List.Item>
      {liveviewStatus && (
        <List.Item>
          <List.Content>
            <List.Header>Liveview ready:</List.Header>
            <List.Description>
              {liveviewStatus.liveviewStatus ? "TRUE" : "FALSE"}
            </List.Description>
          </List.Content>
        </List.Item>
      )}
      <List.Item>
        <List.Content>
          <List.Header>Zoom information:</List.Header>
          <List.Description>
            <SonyCamZoomControl />
          </List.Description>
        </List.Content>
      </List.Item>
    </List>
  );
};
