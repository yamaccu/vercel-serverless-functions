import * as dotenv from "dotenv";
import axios from "axios";

dotenv.config();

export default async (req, res) => {
  const {
    username,
    limit = 100,
    post = false,
    view = false,
    good = false,
  } = req.query;

  const postBool = parseBool(post);
  const viewBool = parseBool(view);
  const goodBool = parseBool(good);

  try {
    if (!username) throw new Error(`username not found`);
    if (postBool == false & viewBool == false & goodBool == false) throw new Error(`post/view/good not found`);
    if (postBool + viewBool + goodBool > 1) throw new Error(`post/view/good duplicated`);

    const resAPI = await requestAPI(username, limit);
    const userInfo = fetchUserInfo(resAPI);

    const postNum = userInfo.length;
    const viewNum = userInfo.reduce((sum, element) => sum + element.viewCount, 0);
    const goodNum = userInfo.reduce((sum, element) => sum + element.goodCount, 0);

    res.setHeader("Content-Type", "text/html");
    res.setHeader("Cache-Control", `public, max-age=86400`);
    res.setHeader("Access-Control-Allow-Origin", `*`);

    if (postBool) { res.send(postNum) }
    else if (viewBool) { res.send(viewNum) }
    else if (goodBool) { res.send(goodNum) };

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
          id: resAPI[i+1].id,
          viewCount: resAPI[i+1].viewCount,
          goodCount: resAPI[i+1].goodCount,      
        }
        removeDuplicates = removeDuplicates.concat(temp);
      }
    }
  
    return removeDuplicates;
  };
};

function parseBool(value) {
  if (value === "true") {
    return true;
  } else if (value === "false") {
    return false;
  } else {
    return value;
  }
};

