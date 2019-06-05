
import axios from 'axios';

export function getPerformanceScoreByWebsite (options) {
  const params = Object.keys(options)
  .filter(key => options[key])
  .map(key => `${key}=${options[key]}`)
  .join('&');
  const url = `https://webapi-dot-mobile-performance-seo.appspot.com/api/pagespeed/getPageSpeedPerformanceScoreForWebsite?${params}`;
  return axios.get(url)
  .then(results => {
    return results.data;
  })
  .catch(err => {
    console.error(err);
  });
}