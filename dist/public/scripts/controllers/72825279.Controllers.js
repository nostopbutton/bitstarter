'use strict';

angular.module('panicApp.Controllers', [])
  .run(['$http', function($http) {

    console.log("run analytics");
    _gaq.push(['_setAccount', 'UA-38964974-1']);
    _gaq.push(['_setDomainName', 'none']);
    //	_gaq.push(['_trackPageview']);

    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
  }])

var trackPageInGoogleAnalytics = function($rootScope, $window, $location, $routeParams           , path, search){
  // Fire Google Analytics on Angular page load
  console.log("trackPageInGoogleAnalytics");
  $rootScope.$on('$viewContentLoaded', track($window, $location, $routeParams           , path, search));
}

var track = function($window, $location, $routeParams            , path, search) {
  console.log("$location=");
  console.log($location);
  var path = convertPathToQueryString($location.path(), $routeParams)
  console.log("track: about to push: " + path);
  $window._gaq.push(['_trackPageview', path]);
  console.log("track: pushed ");
};

var convertPathToQueryString = function(locpath, $routeParams           , path, search) {
  console.log("convertPathToQueryString");
  console.log("$routeParams=");
  console.log($routeParams);
  console.log("locpath=");
  console.log(locpath);
  console.log("path=");
  console.log(path);
  console.log("search=");
  console.log(search);

  for (var key in $routeParams) {
    var queryParam = '/' + $routeParams[key];
    console.log("queryParam="+queryParam);
    locpath = locpath.replace(queryParam, '');
    console.log("path ADDED="+locpath);
  }

  console.log("path NOW="+locpath);

  for (key in $routeParams)
  {
    console.log("key="+key);
  }
  // TODO - FIX ME
//  var querystring = decodeURIComponent($.param($routeParams));// querystring=pete=me&rangeId=sheath-new&itemId=fred
  var querystring = getAsUriParameters($routeParams);
  console.log("querystring="+querystring);

  if (querystring === '') return path;

  return path + "?" + querystring;

//  return locpath;

};

//http://stackoverflow.com/questions/14525178/is-there-any-native-function-to-convert-json-to-url-parameters

//url = Object.keys(data).map(function(k) {
//  return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
//}).join('&')


var getAsUriParameters = function(data) {
  var url = '';
  for (var prop in data) {
    url += encodeURIComponent(prop) + '=' +
      encodeURIComponent(data[prop]) + '&';
  }
  return url.substring(0, url.length - 1)
}
//getAsUriParameters(data); //"action=actualiza_resultado&postID=1&gl=2&gl2=3"