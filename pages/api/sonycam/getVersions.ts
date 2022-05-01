import { NextApiRequest } from "next";
import { checkSonyCam } from "../../../lib/checkSonyCam";
import { NextApiResponseWithSonyCam } from "../../../lib/NextApiResponseWithSonyCam";

const sonycamGetVersionsHandler = async (
  _req: NextApiRequest,
  res: NextApiResponseWithSonyCam
) => {
  if (!checkSonyCam(res)) {
    return;
  }
  const { sonycam } = res.socket.server;
  const result = await sonycam.call("getVersions");
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

export default sonycamGetVersionsHandler;
