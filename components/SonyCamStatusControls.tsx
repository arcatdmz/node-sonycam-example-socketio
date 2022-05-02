import { FC, useContext, useMemo } from "react";
import { Divider, List } from "semantic-ui-react";
import { SonyCamStatusContext } from "../lib/SonyCamStatusContext";
import { SonyCamDisableStatusListenerButton } from "./SonyCamDisableStatusListenerButton";
import { SonyCamExposureControl } from "./SonyCamExposureControl";
import { SonyCamFocusModeControl } from "./SonyCamFocusModeControl";
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
    <>
      <style jsx>{`
        .focus-mode-control {
          padding-top: 0.3rem;
        }
        .buttons {
          display: flex;
          justify-content: flex-end;
        }
      `}</style>
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
        <List.Item>
          <List.Content>
            <List.Header>Exposure compensastion:</List.Header>
            <List.Description>
              <SonyCamExposureControl />
            </List.Description>
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Content>
            <List.Header>Focus mode:</List.Header>
            <List.Description>
              <div className="focus-mode-control">
                <SonyCamFocusModeControl />
              </div>
            </List.Description>
          </List.Content>
        </List.Item>
      </List>
      <Divider inverted />
      <div className="buttons">
        <SonyCamDisableStatusListenerButton />
      </div>
    </>
  );
};
