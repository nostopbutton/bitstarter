'use strict';
var _gaq = _gaq || [];

angular.module('analytics',[])
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
    .service('analytics', function($rootScope, $window, $location, $routeParams) {

        $rootScope.$on('$viewContentLoaded', track);
        console.log("analytics service");

        var track = function() {
            console.log("in track");
            var path = convertPathToQueryString($location.path(), $routeParams)
            $window._gaq.push(['_trackPageview', path]);
        };

        var convertPathToQueryString = function(path, $routeParams) {
            for (var key in $routeParams) {
                var queryParam = '/' + $routeParams[key];
                path = path.replace(queryParam, '');
            }

          // TODO - FIX ME
//            var querystring = "";
//
//            querystring =  decodeURIComponent($.param($routeParams));
//
//            if (querystring === '') return path;
//
//            return path + "?" + querystring;

            return path;
        };
    });

