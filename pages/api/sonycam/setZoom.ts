import { NextApiRequest } from "next";
import { checkSonyCam } from "../../../lib/checkSonyCam";
import { NextApiResponseWithSonyCam } from "../../../lib/NextApiResponseWithSonyCam";

const sonycamSetZoomHandler = async (
  req: NextApiRequest,
  res: NextApiResponseWithSonyCam
) => {
  if (!checkSonyCam(res)) {
    return;
  }
  const value = parseInt(req.query.value as string);
  if (isNaN(value) || value < 0 || value > 100) {
    res.json({
      success: false,
      message: "Invalid zoom value specified",
    });
    return;
  }
  const { sonycam } = res.socket.server;
  new Promise((r) => {
    const zoomInformation = Array.isArray(sonycam.status)
      ? sonycam.status.find((s: any) => s && s.type === "zoomInformation")
      : null;
    if (!zoomInformation) {
      return;
    }
    const currentValue = zoomInformation?.zoomPositionCurrentBox || 0;
    if (currentValue === value) {
      return;
    }
    const action = currentValue < value ? "in" : "out";
    // const changeListener = (changedProps: number[]) => {
    //   const zoomInformationIndex =
    //     Array.isArray(changedProps) &&
    //     changedProps.find(
    //       (i) =>
    //         sonycam.status[i] && sonycam.status[i].type === "zoomInformation"
    //     );
    //   const updatedValue =
    //     typeof zoomInformationIndex === "number" && zoomInformationIndex >= 0
    //       ? sonycam.status[zoomInformationIndex].zoomPositionCurrentBox
    //       : -1;
    //   if (updatedValue < 0) {
    //     return;
    //   }
    //   if (
    //     (action === "in" && updatedValue >= value) ||
    //     (action === "out" && updatedValue <= value)
    //   ) {
    //     sonycam.call("actZoom", [action, "stop"]).then(r);
    //   }
    // };
    // sonycam.on("statusChange", changeListener);
    // sonycam.call("actZoom", [action, "start"]);
    // sonycam.call("actZoom", [action, "1shot"]).then(r);
    sonycam.call("actZoom", [action, "start"]);
    setTimeout(() => {
      sonycam.call("actZoom", [action, "stop"]).then(r);
    }, 0);
    console.log("actZoom target:", value);
  }).then(() => {
    const updatedZoomInformation = Array.isArray(sonycam.status)
      ? sonycam.status.find((s: any) => s && s.type === "zoomInformation")
      : null;
    const updatedValue = updatedZoomInformation?.zoomPositionCurrentBox || 0;
    console.log("actZoom complete:", updatedValue);
  });
  res.json({
    success: true,
    result: value,
  });
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default sonycamSetZoomHandler;
