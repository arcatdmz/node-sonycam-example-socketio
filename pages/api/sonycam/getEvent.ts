import { NextApiRequest } from "next";
import { checkSonyCam } from "../../../lib/checkSonyCam";
import { NextApiResponseWithSonyCam } from "../../../lib/NextApiResponseWithSonyCam";

const sonycamGetEventHandler = async (
  _req: NextApiRequest,
  res: NextApiResponseWithSonyCam
) => {
  if (!checkSonyCam(res)) {
    return;
  }
  const { sonycam } = res.socket.server;
  const result = await sonycam.call("getEvent", [false as any]);
  res.json({
    success: true,
    result,
  });
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default sonycamGetEventHandler;
