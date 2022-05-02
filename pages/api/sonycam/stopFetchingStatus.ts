import { NextApiRequest } from "next";
import { checkSonyCam } from "../../../lib/checkSonyCam";
import { NextApiResponseWithSonyCam } from "../../../lib/NextApiResponseWithSonyCam";

const sonycamStopFetchingStatusHandler = async (
  _req: NextApiRequest,
  res: NextApiResponseWithSonyCam
) => {
  if (!checkSonyCam(res)) {
    return;
  }
  const { sonycam, io } = res.socket.server;
  try {
    sonycam.stopFetchingStatus();
    sonycam.removeAllListeners("status");
    sonycam.removeAllListeners("statusChange");
    io.emit("statusListenerEnabled", false);
    res.json({
      success: true,
      message: "Stopped fetching status",
    });
  } catch (e) {
    const message =
      (e instanceof Error && `Error: ${e.message}`) || "Unknown error";
    io.emit("sonycam", message);
    res.json({
      success: false,
      message,
    });
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default sonycamStopFetchingStatusHandler;
