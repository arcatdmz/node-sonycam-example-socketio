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

export const SonyCamExposureControl: FC = () => {
  const [disabled, setDisabled] = useState<boolean>(false);
  const status = useContext(SonyCamStatusContext);
  useEffect(() => {
    if (
      Array.isArray(status) &&
      status.find((s) => s && s.type === "exposureCompensation")
    ) {
      setDisabled(false);
    }
  }, [status]);

  const exposureCompensation = useMemo(
    () =>
      Array.isArray(status)
        ? status.find((s) => s && s.type === "exposureCompensation")
        : null,
    [status]
  );
  const minValue = exposureCompensation?.minExposureCompensation || 0;
  const maxValue = exposureCompensation?.maxExposureCompensation || 0;
  const stepIndexOfExposureCompensation =
    exposureCompensation?.stepIndexOfExposureCompensation || 1;
  const value = exposureCompensation?.currentExposureCompensation || 0;
  const handleDecreaseExposureClick = useCallback(() => {
    setDisabled(true);
    fetch(
      `/api/sonycam/setExposure?value=${Math.max(
        minValue,
        value - stepIndexOfExposureCompensation
      )}`
    );
  }, [minValue, stepIndexOfExposureCompensation, value]);
  const handleIncreaseExposureClick = useCallback(() => {
    setDisabled(true);
    fetch(
      `/api/sonycam/setExposure?value=${Math.min(
        maxValue,
        value + stepIndexOfExposureCompensation
      )}`
    );
  }, [maxValue, stepIndexOfExposureCompensation, value]);
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
        <Slider
          axis="x"
          xmin={minValue}
          xmax={maxValue}
          xstep={stepIndexOfExposureCompensation}
          x={value}
        />
        <div className="buttons">
          <Button.Group size="tiny" inverted>
            <Button
              icon="minus circle"
              basic
              inverted
              disabled={disabled}
              onClick={handleDecreaseExposureClick}
            />
            <Button
              icon="plus circle"
              basic
              inverted
              disabled={disabled}
              onClick={handleIncreaseExposureClick}
            />
          </Button.Group>
        </div>
      </div>
      <p>Current value: {value > 0 ? `+${value}` : value}</p>
    </div>
  );
};
