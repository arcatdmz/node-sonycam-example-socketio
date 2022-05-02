import { FC, useContext, useMemo } from "react";
import { List } from "semantic-ui-react";
import Slider from "react-input-slider";
import { SonyCamStatusContext } from "../lib/SonyCamStatusContext";

export const SonyCamZoomControl: FC = () => {
  const status = useContext(SonyCamStatusContext);
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
  return (
    <div>
      <style jsx>{`
        .slider-wrapper {
          padding: 0.5rem 0.7rem;
        }
        p {
          padding: 0 0.5rem;
        }
      `}</style>
      <div className="slider-wrapper">
        <Slider axis="x" xmin={0} xmax={100} xstep={1} x={value} />
      </div>
      <p>
        {value}%, {zoomSetting?.zoom || "Unknown Zoom Mode"}
      </p>
    </div>
  );
};
