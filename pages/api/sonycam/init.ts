import { NextApiRequest } from "next";
import {
  discoverSonyDevice,
  fetchSonyCamSpec,
  findSonyCamUrl,
  SonyCam,
} from "node-sonycam";
import { NextApiResponseWithSonyCam } from "../../../lib/NextApiResponseWithSonyCam";

const sonycamInitHandler = async (
  _req: NextApiRequest,
  res: NextApiResponseWithSonyCam
) => {
  if (!res.socket) {
    res.json({
      success: false,
      message: "Socket disconnected",
    });
    return;
  }
  if (res.socket.server.sonycam) {
    if (res.socket.server.sonycam.connected) {
      res.json({
        success: true,
        message: "SonyCam already running",
      });
      return;
    }
  }
  const io = res.socket.server.io;
  try {
    let sonycam: SonyCam;
    if (res.socket.server.sonycam) {
      sonycam = res.socket.server.sonycam;
    } else {
      let location: string;
      try {
        location = await discoverSonyDevice(5000);
        io &&
          io.emit("sonycam", `Discovered service spec location: ${location}`);
      } catch (e) {
        if (
          !(e instanceof Error) ||
          e.message !== "Service discovery timeout"
        ) {
          throw e;
        }
        // fallback to the default spec location
        location = "http://192.168.122.1:64321/dd.xml";
      }
      const spec = await fetchSonyCamSpec(location);
      const serviceUrl = findSonyCamUrl(spec);
      io && io.emit("sonycam", `Found Sony camera service url: ${serviceUrl}`);
      sonycam = new SonyCam(serviceUrl);
    }

    await sonycam.connect();

    // if (sonycam.availableApiList.includes("getSupportedLiveviewSize")) {
    //   console.log(
    //     "Supported live view size:",
    //     await sonyCam.call("getSupportedLiveviewSize")
    //   );
    // }
    const message = `Started SonyCam service at ${sonycam.sonyCamUrl}`;
    res.socket.server.sonycam = sonycam;
    io && io.emit("sonycam", message);
    res.json({
      success: true,
      message,
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
