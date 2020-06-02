import Head from "next/head";
import Status from "../components/status";
import { useEffect } from "react";
import { uptimeRobotToken } from "../config";

function Home({ monitors }) {
  useEffect(() => {
    setTimeout(() => {
      location.reload();
    }, 60000);
  }, []);
  const m = monitors.monitors;
  const status =
    m.filter((a) => a.status !== 2).length > 0
      ? { m: "Minor Outage", c: "#f5d5be" }
      : { m: "All Systems Fully Operational", c: "#47cbac" };
  return (
    <div>
      <Head>
        <title>Pixel Chat Status</title>
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content={"Pixel Chat Status"} />
        <meta property="og:description" content={status.m} />
        <meta property="og:url" content="https://status.pixelchat.tv" />
        <meta property="og:type" content="website" />
      </Head>
      <div className="w-screen min-h-screen bg-gray-900 text-white p-4">
        <div className="w-full flex justify-center">
          <div
            className="rounded-sm shadow-sm px-4 py-2 text-lg mb-6"
            style={{ background: status.c }}
          >
            {status.m}
          </div>
        </div>
        <div className="w-full flex flex-wrap justify-center">
          {m.map((v, k) => (
            <Status
              name={v.friendly_name}
              code={v.status}
              uptime={v.custom_uptime_ratio}
              responseTime={v.response_times}
              key={k}
            />
          ))}
        </div>
        <div className="text-center w-full">
          This page shows the status of all sites & services created by Pixel
          Dev LLC
        </div>
      </div>
    </div>
  );
}

Home.getInitialProps = async () => {
  let out = {};
  let urlencoded = new URLSearchParams();
  urlencoded.append("api_key", uptimeRobotToken);
  urlencoded.append("response_times", "1");
  urlencoded.append("custom_uptime_ratios", "7-30");
  let monitors = await fetch(`https://api.uptimerobot.com/v2/getMonitors`, {
    method: "POST",
    body: urlencoded,
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "cache-control": "no-cache",
    },
  });
  out.monitors = await monitors.json();
  return out;
};

export default Home;
