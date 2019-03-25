import _ from "lodash";
import pois from "./pois";

export const contains = ({name, nickname}, query) => {
  
  if (name.includes(query) || nickname.includes(query)) {
    return true;
  }
  return false;
};

export const getPois = (limit = 20, query = "") => {
  //console.log("testAnything = API CALLED ");
  return new Promise((resolve, reject) => {
    if (query.length === 0) {
      resolve(_.take(pois, limit));
    } else {
      const formattedQuery = query.toLowerCase();
      const results = _.filter(pois, poi => {
        return contains(name, formattedQuery);
      });
      resolve(_.take(results, limit));
    }
  });
};

export default getPois;