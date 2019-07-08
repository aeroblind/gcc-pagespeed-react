
import axios from 'axios';
import config from '../../config';

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

export function getPageSpeedPerformanceScoreForWebsites (websiteIdsWithTime, fields) {
  const url = `${config.gccPageSpeedApiHost}/api/pagespeed/getPageSpeedPerformanceScoreForWebsites`;
  return axios.get(url, {
    params: {
      websiteIdsWithTime,
      fields
    }
  })
  .then(results => {
    return results.data;
  })
  .catch(err => {
    console.error(err);
  });
}

export function getStatisticsForWebsites (websiteData) {
  const url = `${config.gccPageSpeedApiHost}/api/pagespeed/getStatisticsForWebsites`;
  return axios.get(url, {
    params: {
      websiteData,
    }
  })
  .then(results => {
    return results.data;
  })
  .catch(err => {
    console.error(err);
  });
}