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
    const liveviewUrl = await sonycam.startLiveview();
    io.emit("sonycam", `Starting liveview: ${liveviewUrl}`);

    const imageListener = (res: SonyCamImageResponse) => {
      io.emit("image", res);
    };
    sonycam.addListener("image", imageListener);

    await sonycam.fetchLiveview();
    res.json({
      success: true,
      message: `Started liveview: ${liveviewUrl}`,
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

export default sonycamStartLiveviewHandler;
