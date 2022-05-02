import { NextApiRequest } from "next";
import { checkSonyCam } from "../../../lib/checkSonyCam";
import { NextApiResponseWithSonyCam } from "../../../lib/NextApiResponseWithSonyCam";

const sonycamSetExposureHandler = async (
  req: NextApiRequest,
  res: NextApiResponseWithSonyCam
) => {
  if (!checkSonyCam(res)) {
    return;
  }
  const value = parseInt(req.query.value as string);
  if (isNaN(value)) {
    res.json({
      success: false,
      message: "Invalid exposure value specified",
    });
    return;
  }
  const { sonycam, io } = res.socket.server;
  try {
    await sonycam.call("setExposureCompensation", [value]);
    res.json({
      success: true,
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

export default sonycamSetExposureHandler;
