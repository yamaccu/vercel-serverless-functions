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
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", `public, max-age=86400`);
    
    const ret = {post:postNum,view:viewNum,good:goodNum}

    res.send(ret);
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
