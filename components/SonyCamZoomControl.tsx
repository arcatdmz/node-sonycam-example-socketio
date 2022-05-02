import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Slider from "react-input-slider";
import { Button } from "semantic-ui-react";
import { SonyCamStatusContext } from "../lib/SonyCamStatusContext";

export const SonyCamZoomControl: FC = () => {
  const [disabled, setDisabled] = useState<boolean>(false);
  const status = useContext(SonyCamStatusContext);
  useEffect(() => {
    setDisabled(false);
  }, [status]);

  const zoomInformation = useMemo(
    () =>
      Array.isArray(status)
        ? status.find((s) => s && s.type === "zoomInformation")
        : null,
    [status]
  );
  const zoomSetting = useMemo(
    () =>
      Array.isArray(status)
        ? status.find((s) => s && s.type === "zoomSetting")
        : null,
    [status]
  );
  const value = zoomInformation?.zoomPositionCurrentBox || 0;
  const handleZoomOutClick = useCallback(() => {
    setDisabled(true);
    fetch("/api/sonycam/zoomOut");
  }, []);
  const handleZoomInClick = useCallback(() => {
    setDisabled(true);
    fetch("/api/sonycam/zoomIn");
  }, []);
  return (
    <div>
      <style jsx>{`
        .slider-wrapper {
          padding: 0.5rem 0 0.5rem 0.7rem;
          display: flex;
          align-items: center;
        }
        .buttons {
          margin-left: 0.7rem;
        }
        p {
          padding: 0 0.5rem;
        }
      `}</style>
      <div className="slider-wrapper">
        <Slider axis="x" xmin={0} xmax={100} xstep={1} x={value} />
        <div className="buttons">
          <Button.Group size="tiny">
            <Button
              icon="zoom out"
              disabled={disabled}
              onClick={handleZoomOutClick}
            />
            <Button
              icon="zoom in"
              disabled={disabled}
              onClick={handleZoomInClick}
            />
          </Button.Group>
        </div>
      </div>
      <p>
        {value}%, {zoomSetting?.zoom || "Unknown Zoom Mode"}
      </p>
    </div>
  );
};
