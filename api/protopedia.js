import * as dotenv from "dotenv";
import axios from "axios";

dotenv.config();

export default async (req, res) => {
  const {
    username,
    limit = 1000,
  } = req.query;

  try {
    if (!username) throw new Error(`username not found`);

    const resAPI = await requestAPI(username, limit);
    const userInfo = fetchUserInfo(resAPI);

    const postNum = userInfo.length;
    const viewNum = userInfo.reduce((sum, element) => sum + element.viewCount, 0);
    const goodNum = userInfo.reduce((sum, element) => sum + element.goodCount, 0);

    //res.setHeader("Content-Type", "text/html");
    //res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", `public, max-age=86400`);
    res.setHeader("Access-Control-Allow-Origin", `*`);

    const ret = { post: postNum, view: viewNum, good: goodNum }

    res.send(`
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="160" height="20" role="img"
    aria-label="Protopedia/Works: 5 posts">
    <title>Protopedia/Works: 5 posts</title>
    <linearGradient id="s" x2="0" y2="100%">
        <stop offset="0" stop-color="#bbb" stop-opacity=".1" />
        <stop offset="1" stop-opacity=".1" />
    </linearGradient>
    <clipPath id="r">
        <rect width="160" height="20" rx="3" fill="#fff" />
    </clipPath>
    <g clip-path="url(#r)">
        <rect width="109" height="20" fill="#555" />
        <rect x="109" width="51" height="20" fill="#007ec6" />
        <rect width="160" height="20" fill="url(#s)" />
    </g>
    <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif"
        text-rendering="geometricPrecision" font-size="110">
        <text aria-hidden="true" x="555" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)"
            textLength="990">Protopedia/Works</text>
        <text x="555" y="140" transform="scale(.1)" fill="#fff" textLength="990">Protopedia/Works</text>
        <text aria-hidden="true" x="1335" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)"
            textLength="410">5 posts</text>
        <text x="1335" y="140" transform="scale(.1)" fill="#fff" textLength="410">5 posts</text>
    </g>
    </svg>`);
  }
  catch (err) {
    res.setHeader("Cache-Control", `no-cache, no-store, must-revalidate`); // Don't cache error responses.
    res.setHeader("Content-Type", "text/html");
    return res.send(
      `
      <p>${err}</p>
      `
    )
  }

  async function requestAPI(username, limit) {
    const token = process.env[`PAT_2`];
    let res = await axios({
      url: `https://protopedia.net/api/prototypes.json?token=${token}&userNm=${username}${limit > 0 ? `&limit=${limit}` : ""}`,
      method: "get",
    });

    return res.data;
  };

  function fetchUserInfo(resAPI) {
    let removeDuplicates = [];
    removeDuplicates[0] = {
      id: resAPI[0].id,
      viewCount: resAPI[0].viewCount,
      goodCount: resAPI[0].goodCount,
    };

    for (let i = 0; i < (resAPI.length - 1); i++) {
      if (resAPI[i].id != resAPI[i + 1].id) {
        let temp = {
          id: resAPI[i + 1].id,
          viewCount: resAPI[i + 1].viewCount,
          goodCount: resAPI[i + 1].goodCount,
        }
        removeDuplicates = removeDuplicates.concat(temp);
      }
    }

    return removeDuplicates;
  };
};
