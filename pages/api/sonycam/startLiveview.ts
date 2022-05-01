import { NextApiRequest } from "next";
import { SonyCamImageResponse } from "node-sonycam";
import { checkSonyCam } from "../../../lib/checkSonyCam";
import { NextApiResponseWithSonyCam } from "../../../lib/NextApiResponseWithSonyCam";

const sonycamStartLiveviewHandler = async (
  _req: NextApiRequest,
  res: NextApiResponseWithSonyCam
) => {
  if (!checkSonyCam(res)) {
    return;
  }
  const { sonycam, io } = res.socket.server;
  try {
    const { liveviewing } = sonycam;
    if (!liveviewing) {
      const liveviewUrl = await sonycam.startLiveview();
      const message = `Starting liveview: ${liveviewUrl}`;
      io.emit("sonycam", message);
      console.log(message);
      await sonycam.fetchLiveview();
    }

    const imageListener = (res: SonyCamImageResponse) => {
      io.emit("image", res);
    };
    // remove all previously-registered listeners (refresh listeners to accommodate hot reload)
    sonycam.removeAllListeners("image");
    sonycam.addListener("image", imageListener);

    res.json({
      success: true,
      message: liveviewing
        ? `Liveview already started: ${sonycam.liveviewUrl}`
        : `Started liveview: ${sonycam.liveviewUrl}`,
    });
  } catch (e) {
    const message =
      (e instanceof Error && `Error: ${e.message}`) || "Unknown error";
    io.emit("sonycam", message);
    console.error(message);

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

export default sonycamStartLiveviewHandler;
