let appConfig = {};

appConfig.port = 3000;
appConfig.allowedCorsOrigin = "*";
appConfig.env = "dev";
appConfig.db = {
    uri: 'mongodb://127.0.0.1:27017/splitwiseDb'
  }
appConfig.apiVersion = '/api/v1';
appConfig.url='http://localhost:3000/';
//appConfig.url='http://52.66.252.216:3001/';


module.exports = {
    port: appConfig.port,
    allowedCorsOrigin: appConfig.allowedCorsOrigin,
    environment: appConfig.env,
    db :appConfig.db,
    apiVersion : appConfig.apiVersion,
    url: appConfig.url
};