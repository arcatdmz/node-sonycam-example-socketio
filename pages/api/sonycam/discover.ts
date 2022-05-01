import { NextApiRequest } from "next";
import { discoverSonyDevice } from "node-sonycam";
import { NextApiResponseWithSocketIO } from "../../../lib/NextApiResponseWithSocketIO";

const sonycamInitHandler = async (
  _req: NextApiRequest,
  res: NextApiResponseWithSocketIO
) => {
  if (!res.socket) {
    res.json({
      success: false,
      message: "Socket disconnected",
    });
    return;
  }
  const io = res.socket.server.io;
  try {
    const location = await discoverSonyDevice(5000);
    io && io.emit("sonycam", `Discovered service spec location: ${location}`);
    res.json({
      success: true,
      location,
    });
  } catch (e) {
    const message =
      (e instanceof Error && `Error: ${e.message}`) || "Unknown error";
    io && io.emit("sonycam", message);
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

export default sonycamInitHandler;
