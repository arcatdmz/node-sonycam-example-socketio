import { NextApiRequest } from "next";
import { checkSonyCam } from "../../../lib/checkSonyCam";
import { NextApiResponseWithSonyCam } from "../../../lib/NextApiResponseWithSonyCam";

const sonycamStartFetchingStatusHandler = async (
  _req: NextApiRequest,
  res: NextApiResponseWithSonyCam
) => {
  if (!checkSonyCam(res)) {
    return;
  }
  const { sonycam, io } = res.socket.server;
  try {
    const { fetchingStatus } = sonycam;
    if (!fetchingStatus) {
      const methodTypes: [string, string[], string[], string][] =
        (await sonycam.call("getMethodTypes", [""])) as any;
      const eventVersion = methodTypes.reduce(
        (p, [methodName, , , version]) =>
          methodName === "getEvent" ? version : p,
        "1.0"
      );
      const message = `Starting fetching status (version: ${eventVersion})`;
      io.emit("sonycam", message);
      console.log(message);
      await sonycam.startFetchingStatus(eventVersion);
    }

    // remove all previously-registered listeners (refresh listeners to accommodate hot reload)
    sonycam.removeAllListeners("status");
    sonycam.removeAllListeners("statusChange");

    const statusListener = (res: any) => {
      io.emit("status", res);
    };
    sonycam.addListener("status", statusListener);
    const statusChangeListener = (changed: number[]) => {
      io.emit(
        "statusChange",
        changed.map((i) => sonycam.status[i])
      );
    };
    sonycam.addListener("statusChange", statusChangeListener);

    res.json({
      success: true,
      message: fetchingStatus
        ? "Fetching status already started"
        : "Started fetching status",
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

export default sonycamStartFetchingStatusHandler;
