import { Buffer } from "buffer";
global.Buffer = Buffer;

const GetCurrentPrice = async (ticker) => {
  const iconv = require("iconv-lite");
  const url = `https://finance.naver.com/item/main.naver?code=${ticker}`;
  try {
    const response = await fetch(url);
    if (response.ok) {
      const responseBuffer = await response.arrayBuffer();
      const content = iconv.decode(Buffer.from(responseBuffer), "euc-kr");
      const startMarker = "<dd>현재가 ";
      const startIdx = content.indexOf(startMarker) + startMarker.length;
      const endIdx = content.indexOf(" ", startIdx);
      const currentPrice = content.substring(startIdx, endIdx).replace(",", "");
      return { ticker, currentPrice };
    } else {
      throw new Error("Unable to fetch the price");
    }
  } catch (error) {
    return { ticker, error: error.message };
  }
};
export default GetCurrentPrice;
