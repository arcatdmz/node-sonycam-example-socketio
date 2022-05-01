import { NextApiRequest } from "next";
import { checkSonyCam } from "../../../lib/checkSonyCam";
import { NextApiResponseWithSonyCam } from "../../../lib/NextApiResponseWithSonyCam";

const sonycamStopLiveviewHandler = async (
  _req: NextApiRequest,
  res: NextApiResponseWithSonyCam
) => {
  if (!checkSonyCam(res)) {
    return;
  }
  const { sonycam, io } = res.socket.server;
  try {
    await sonycam.stopLiveview();
    sonycam.removeAllListeners("image");
    res.json({
      success: true,
      message: "Stopped liveview",
    });
  } catch (e) {
    const message =
      (e instanceof Error && `Error: ${e.message}`) || "Unknown error";
    io.emit("sonycam", message);
    res.json({
      success: false,
      message,
    });
  } finally {
    io.emit("play", false);
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default sonycamStopLiveviewHandler;
