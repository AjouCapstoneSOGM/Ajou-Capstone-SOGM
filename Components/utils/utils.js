import { Dimensions } from "react-native";
import {
  formatDistanceToNow,
  isWithinInterval,
  subDays,
  format,
} from "date-fns";
import { ko } from "date-fns/locale";

export const deepCopy = (obj) => {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (obj instanceof Array) {
    const copy = [];
    for (let i = 0; i < obj.length; i++) {
      copy[i] = deepCopy(obj[i]);
    }
    return copy;
  }

  if (obj instanceof Object) {
    const copy = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        copy[key] = deepCopy(obj[key]);
      }
    }
    return copy;
  }

  throw new Error("Unable to copy obj! Its type isn't supported.");
};

export const arraysEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false; // 배열의 길이 비교

  for (let i = 0; i < arr1.length; i++) {
    const obj1 = arr1[i];
    const obj2 = arr2[i];

    // 각 키의 값 비교
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false; // 객체의 키 길이 비교

    for (let key of keys1) {
      if (obj1[key] !== obj2[key]) return false; // 키의 값 비교
    }
  }

  return true; // 모든 요소가 같으면 true 반환
};

export const filteringNumber = (value) => {
  return value.replace(/[^0-9]/g, "");
};

export const removeSpecialChars = (text) => {
  return text.replace(/[^a-zA-Z0-9 가-힣]/g, "");
};

export const colorScale = [
  "hsl(348, 100%, 80%)", // 파스텔 핑크,
  "hsl(207, 94%, 80%)", // 파스텔 블루,
  "hsl(48, 100%, 78%)", // 파스텔 옐로우,
  "hsl(144, 76%, 76%)", // 파스텔 그린,
  "hsl(20, 100%, 72%)", // 파스텔 오렌지,
  "hsl(262, 100%, 80%)", // 파스텔 퍼플,
  "hsl(174, 100%, 70%)", // 파스텔 시안,
  "hsl(338, 90%, 72%)", // 파스텔 레드,
  "hsl(20, 20%, 60%)", // 연 회색,
  "hsl(300, 90%, 80%)", // 파스텔 시안-그린,
  "#00ac00",
  "#ffd700",
  "#ccc",
];

export const basicDimensions = {
  // 디자이너가 작업하고 있는 XD파일 스크린의 세로,가로
  height: 800,
  width: 360,
};

export const height = // 높이 변환 작업
  (Dimensions.get("screen").height * (1 / basicDimensions.height)).toFixed(2);

export const width = // 가로 변환 작업
  (Dimensions.get("screen").width * (1 / basicDimensions.width)).toFixed(2);

export const timeAgo = (date) => {
  const now = new Date();
  // 7일 이내인지 확인
  if (isWithinInterval(date, { start: subDays(now, 7), end: now })) {
    return formatDistanceToNow(date, { addSuffix: true, locale: ko });
  } else {
    return format(date, "yyyy-MM-dd");
  }
};
