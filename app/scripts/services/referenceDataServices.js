'use strict';

var referenceDataServices = angular.module('panicApp.referenceDataServices', ['ngResource']);

referenceDataServices
  .factory('Range', function($resource){
    return $resource('referenceData/:rangeId.json', {}, {
      designCatalogue: {method:'GET', params:{rangeId:'designCatalogue'}, isArray:true},
      itemCollection: {method:'GET', params:{rangeId:'itemCollection'}, isArray:true},
      labelLookup: {method:'GET', params:{rangeId:'labels'}, isArray:true}
    });
  })

  .factory('DesignBuilder', function($resource){
    return $resource('referenceData/designBuilder/:fileId.json', {}, {
//      query: {method:'GET', params:{rangeId:'ranges'}, isArray:true},
      options: {method:'GET', params:{fileId:'options'}, isArray:true},
      fabricSets: {method:'GET', params:{fileId:'fabricSets'}, isArray:true}
    });
  })
  .service('ReferenceDataCache', function (Range, DesignBuilder) {
    var designCatalogue = null,
        labelCache = null,
        optionCache = null,
        itemCollection = null;

//    $scope.range = DesignBuilder.get({rangeId: $routeParams.rangeId},
//      function (data) {   //success
//        if(!itemId) {
////            master = angular.copy(ReferenceDataCache.getItemDesign(itemId));
////          } else {
//          master = angular.copy(data.default);
//        }
//        $scope.master = master; // so it can be viewed in debug screen
//        $scope.cancel(); // set form to master
//      },
//      function (data) {   //failure
//        alert("ooops");
//      });


    return {
      // TODO is there any point in caching?
      getDesignCatalogue: function () {
        if(designCatalogue == null) {
          designCatalogue = Range.designCatalogue();
          console.log("Lazy instantiation of designCatalogue:" + designCatalogue.length)
        }
        return designCatalogue;
      },
      getLabels: function () {
        console.log("getLabels");
        if(labelCache == null) {
          labelCache = Range.labelLookup();
          console.log("Lazy instantiation of labelCache:" + labelCache.length)
        }

        return labelCache;
      },
      getOptions: function () {
        console.log("getOptions");
        if(optionCache == null) {
          optionCache = DesignBuilder.options();
          console.log("Lazy instantiation of optionCache:" + optionCache.length)
        }

        return optionCache;
      },
      getItemCollection: function () {
        if(itemCollection == null) {
          itemCollection = Range.itemCollection(function(data){
              console.log("----Lazy instantiation of itemCollection: " + data.length)
            },
            function(data) {
              console.log("Oops -failed to instantiate itemCollection: " + data.length)
            }
          );

        }
        return itemCollection;
      },
      getItemDesign: function (itemId) {
//        getDressCollection().
        var items = {},
            out = "";

        items = this.getItemCollection(function(data){
          console.log("Looking up item: "+itemId);
          console.log("item.length: "+items.length);

          for (var i=0; i<items.length; i++){
            console.log("-Checking item: "+items[i].itemId);

            if (items[i].itemId === itemId) {
              console.log("---Found item: "+itemId + " -> "+items[i].design);
              out = angular.copy(items[i].design);
              break
            }
          }
        },
          function(data) {
            console.log("Oops -failed to getItemColection: " + data.length)
          }
        )

        return out;
      }
    };
  })

  .filter('fabricLookup', function(ReferenceDataCache) {
    return function(input) {
      var options = ReferenceDataCache.getOptions();
      var out = "";
      console.log("Looking up fabric: "+input);
      console.log("options.length: "+options.length);

      for (var i=0; i<options.length; i++){
        if (options[i].id === input) {
          console.log("**Found options: "+input + " -> "+options[i].fabrics);
          out = angular.copy(options[i].fabrics);
          break
        }
      }
      return out;
    }
  })
  .filter('trimLookup', function(ReferenceDataCache) {
    return function(input) {
      var options = ReferenceDataCache.getOptions();
      var out = "";
      console.log("Looking up trim: "+input);
      console.log("options.length: "+options.length);

      for (var i=0; i<options.length; i++){
        if (options[i].id === input) {
          console.log("***********Found trim: "+input + " -> "+options[i].trims);
          out = angular.copy(options[i].trims);
          break
        }
      }
      return out;
    }
  })
//  .filter('trimFabricLookup', function(ReferenceDataCache) {
//    return function(input) {
//      var options = ReferenceDataCache.getOptions();
//      var out = "";
//      console.log("Looking up trim fabric: "+input);
//      console.log("options.length: "+options.length);
//
//      for (var i=0; i<options.length; i++){
//        if (options[i].id === input) {
//          console.log("***********Found trim: "+input + " -> "+options[i].trims);
//          out = angular.copy(options[i].trims);
//          break
//        }
//      }
//      return out;
//    }
//  })
  .filter('labelLookup', function(ReferenceDataCache) {
    return function(input) {
      var labels = ReferenceDataCache.getLabels();
      var out = "";
      console.log("Looking up label: "+input);
      console.log("label.length: "+labels.length);

      for (var i=0; i<labels.length; i++){
        if (labels[i].id === input) {
          console.log("Found label: "+input + " -> "+labels[i].label);
          out = angular.copy(labels[i].label);
        }
      }
      return out;
    }
  })

//  .factory('lookup', ['$http', '$rootScope', '$window', '$filter', function ($http, $rootScope, $window, $filter) {
//    var lookup = {
//      // use the $window service to get the language of the user's browser
//      language:$window.navigator.userLanguage || $window.navigator.language,
//      // array to hold the lookupd resource string entries
//      dictionary:[],
//      // flag to indicate if the service hs loaded the resource file
//      resourceFileLoaded:false,
//
//      // success handler for all server communication
//      successCallback:function (data) {
//        // store the returned array in the dictionary
//        lookup.dictionary = data;
//        // set the flag that the resource are loaded
//        lookup.resourceFileLoaded = true;
//        // broadcast that the file has been loaded
//        $rootScope.$broadcast('lookupResourcesUpdates');
//      },
//
//      // allows setting of language on the fly
//      setLanguage: function(value) {
//        lookup.language = value;
//        lookup.initlookupdResources();
//      },
//
//      // loads the language resource file from the server
//      initlookupdResources:function () {
//        // build the url to retrieve the lookupd resource file
//        var url = '/i18n/resources-locale_' + lookup.language + '.js';
//        // request the resource file
//        $http({ method:"GET", url:url, cache:false }).success(lookup.successCallback).error(function () {
//          // the request failed set the url to the default resource file
//          var url = '/i18n/resources-locale_default.js';
//          // request the default resource file
//          $http({ method:"GET", url:url, cache:false }).success(lookup.successCallback);
//        });
//      },
//
//      // checks the dictionary for a lookupd resource string
//      getCodeName: function(value) {
//        // default the result to an empty string
//        var result = '';
//
//        // make sure the dictionary has valid data
//        if ((lookup.dictionary !== []) && (lookup.dictionary.length > 0)) {
//          // use the filter service to only return those entries which match the value
//          // and only take the first result
//          var entry = $filter('filter')(lookup.dictionary, function(element) {
//              return element.key === value;
//            }
//          )[0];
//
//          // set the result
//          result = entry.value;
//        }
//        // return the value to the call
//        return result;
//      }
//    };
//
//    // force the load of the resource file
//    lookup.initlookupdResources();
//
//    // return the local instance when called
//    return lookup;
//  } ])
//// simple codename lookup filter
//// usage {{ TOKEN | codename }}
//  .filter('codename', ['lookup', function (lookup) {
//    return function (input) {
//      return lookup.getCodeName(input);
//    };
//  }])
//;

//var getCategoryFromCacheArray = function(id) {
//  for (var i=0; i<categoryCache; i++){
////    console.log("id: "+designs[i].desId);
//    if (categoryCache[i].catId === id) {
//      console.log("Found category: "+id + " -> "+designs[i].desId);
//      design = angular.copy(designs[i]);
//    }
//  }
//}

//var getCategoryById = function(categories, id) {
//  console.log("categories.length"+categories.length);
//
//  var category = [];
//  for (var i=0; i<categories.length; i++){
//    console.log("categoryName"+categories[i].catId);
//    if (categories[i].catId === id) {
//      console.log("Found category: "+id + " -> "+categories[i].catId);
//      category = angular.copy(categories[i]);
//    }
//  }
//  console.log("Returning: "+category);
//
//  return category;
//}
//
//var getDesignById = function(designs, id) {
//  console.log("designs.length: "+designs.length);
//
//  var design = {};
//  for (var i=0; i<designs.length; i++){
//    console.log("id: "+designs[i].desId);
//    if (designs[i].desId === id) {
//      console.log("Found category: "+id + " -> "+designs[i].desId);
//      design = angular.copy(designs[i]);
//    }
//  }
//  console.log("Returning: "+design);
//
//  return design;
//}


//function (data) {   //success
//  category  = getCategoryById(data, categoryId);
//  console.log('category.designs: '+category.designs);
//  design  = getDesignById(category.designs, designId);
//  console.log('design.desName: '+design.desName);
//  $scope.category = category;
//  $scope.design = design;
//}
//);

//  .factory('Lookup', function($resource){
//    return $resource('referenceData/:lookupId.json', {}, {
//      fabrics: {method:'GET', params:{lookupId:'fabrics'}, isArray:true}
//    });
//  })


//referenceDataServices
//  .factory('DressCollection', function($resource){
//    return $resource('referenceData/:rangeId.json', {}, {
//      query: {method:'GET', params:{rangeId:'silhouettes'}, isArray:true}
//    });
//  });

//referenceDataServices.
//    service('analytics', function($rootScope, $window, $location, $routeParams) {
//
//    $rootScope.$on('$viewContentLoaded', track);
//
//    var track = function() {
//        var path = convertPathToQueryString($location.path(), $routeParams)
//        $window._gaq.push(['_trackPageview', path]);
//    };
//
//    var convertPathToQueryString = function(path, $routeParams) {
//        for (var key in $routeParams) {
//            var queryParam = '/' + $routeParams[key];
//            path = path.replace(queryParam, '');
//        }
//
//        var querystring = decodeURIComponent($.param($routeParams));
//
//        if (querystring === '') return path;
//
//        return path + "?" + querystring;
//    };
//});


