import { NextApiRequest } from "next";
import { checkSonyCam } from "../../../lib/checkSonyCam";
import { NextApiResponseWithSonyCam } from "../../../lib/NextApiResponseWithSonyCam";

const sonycamGetStatusHandler = async (
  _req: NextApiRequest,
  res: NextApiResponseWithSonyCam
) => {
  if (!checkSonyCam(res)) {
    return;
  }
  const { sonycam } = res.socket.server;
  // const result = await sonycam.call("getEvent", [false]);
  res.json({
    success: true,
    result: sonycam.status,
  });
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default sonycamGetStatusHandler;
