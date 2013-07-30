'use strict';
angular.module('panicApp', [
  'panicApp.Controllers',
  'panicApp.referenceDataServices',
  'panicApp.designBuildDirectives',
  'panicApp.designBuildFilters',
  'ui.bootstrap'
]).config([
  '$routeProvider',
  '$locationProvider',
  function ($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
      templateUrl: 'views/newDesignBuild.html',
      controller: 'NewDesignBuildCtrl'
    }).when('/fit', {
      templateUrl: 'views/fit.html',
      controller: 'StaticPageCtrl'
    }).when('/fabrics', {
      templateUrl: 'views/fabrics.html',
      controller: 'StaticPageCtrl'
    }).when('/party', {
      templateUrl: 'views/party.html',
      controller: 'StaticPageCtrl'
    }).when('/contact', {
      templateUrl: 'views/contact.html',
      controller: 'StaticPageCtrl'
    }).when('/about', {
      templateUrl: 'views/about.html',
      controller: 'StaticPageCtrl'
    }).when('/collection', {
      templateUrl: 'views/dressCollection.html',
      controller: 'DressCollectionCtrl'
    }).when('/design', {
      templateUrl: 'views/silhouettes.html',
      controller: 'SilhouetteCtrl'
    }).when('/olddesign/:rangeId', {
      templateUrl: 'views/designBuildDirective.html',
      controller: 'DesignBuildCtrl'
    }).when('/olddesign/:rangeId/:itemId', {
      templateUrl: 'views/designBuildDirective.html',
      controller: 'DesignBuildCtrl'
    }).when('/design/:rangeId', {
      templateUrl: 'views/newDesignBuild.html',
      controller: 'NewDesignBuildCtrl'
    }).when('/design/:rangeId/:itemId', {
      templateUrl: 'views/newDesignBuild.html',
      controller: 'NewDesignBuildCtrl'
    }).when('/designAdmin/:rangeId', {
      templateUrl: 'views/designBuildAdmin.html',
      controller: 'NewDesignBuildCtrl'
    }).when('/purchase', {
      templateUrl: 'views/sizing.html',
      controller: 'StaticPageCtrl'
    }).when('/adminCollection', {
      templateUrl: 'views/adminCollection.html',
      controller: 'CollectionCtrl'
    }).when('/adminCollection/:rangeId', {
      templateUrl: 'views/adminRangeDetails.html',
      controller: 'RangeDetailsCtrl'
    }).otherwise({ redirectTo: '/' });
  }
]);
'use strict';
var _gaq = _gaq || [];
angular.module('analytics', []).run([
  '$http',
  function ($http) {
    console.log('run analytics');
    _gaq.push([
      '_setAccount',
      'UA-38964974-3'
    ]);
    _gaq.push([
      '_setDomainName',
      'none'
    ]);
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
  }
]).service('analytics', function ($rootScope, $window, $location, $routeParams) {
  $rootScope.$on('$viewContentLoaded', track);
  console.log('analytics service');
  var track = function () {
    console.log('in track');
    var path = convertPathToQueryString($location.path(), $routeParams);
    $window._gaq.push([
      '_trackPageview',
      path
    ]);
  };
  var convertPathToQueryString = function (path, $routeParams) {
    for (var key in $routeParams) {
      var queryParam = '/' + $routeParams[key];
      path = path.replace(queryParam, '');
    }
    return path;
  };
});
'use strict';
var referenceDataServices = angular.module('panicApp.referenceDataServices', ['ngResource']);
referenceDataServices.factory('Range', [
  '$resource',
  function ($resource) {
    return $resource('referenceData/:rangeId.json', {}, {
      designCatalogue: {
        method: 'GET',
        params: { rangeId: 'designCatalogue' },
        isArray: true
      },
      itemCollection: {
        method: 'GET',
        params: { rangeId: 'itemCollection' },
        isArray: true
      },
      labelLookup: {
        method: 'GET',
        params: { rangeId: 'labels' },
        isArray: true
      }
    });
  }
]).factory('DesignBuilder', [
  '$resource',
  function ($resource) {
    return $resource('referenceData/designBuilder/:fileId.json', {}, {
      options: {
        method: 'GET',
        params: { fileId: 'options' },
        isArray: true
      },
      fabricSets: {
        method: 'GET',
        params: { fileId: 'fabricSets' },
        isArray: true
      }
    });
  }
]).service('ReferenceDataCache', [
  'Range',
  'DesignBuilder',
  function (Range, DesignBuilder) {
    var designCatalogue = null, labelCache = null, optionCache = null, itemCollection = null;
    return {
      getDesignCatalogue: function () {
        if (designCatalogue == null) {
          designCatalogue = Range.designCatalogue();
          console.log('Lazy instantiation of designCatalogue:' + designCatalogue.length);
        }
        return designCatalogue;
      },
      getLabels: function () {
        console.log('getLabels');
        if (labelCache == null) {
          labelCache = Range.labelLookup();
          console.log('Lazy instantiation of labelCache:' + labelCache.length);
        }
        return labelCache;
      },
      getOptions: function () {
        console.log('getOptions');
        if (optionCache == null) {
          optionCache = DesignBuilder.options();
          console.log('Lazy instantiation of optionCache:' + optionCache.length);
        }
        return optionCache;
      },
      getItemCollection: function () {
        if (itemCollection == null) {
          itemCollection = Range.itemCollection(function (data) {
            console.log('----Lazy instantiation of itemCollection: ' + data.length);
          }, function (data) {
            console.log('Oops -failed to instantiate itemCollection: ' + data.length);
          });
        }
        return itemCollection;
      },
      getItemDesign: function (itemId) {
        var items = {}, out = '';
        items = this.getItemCollection(function (data) {
          console.log('Looking up item: ' + itemId);
          console.log('item.length: ' + items.length);
          for (var i = 0; i < items.length; i++) {
            console.log('-Checking item: ' + items[i].itemId);
            if (items[i].itemId === itemId) {
              console.log('---Found item: ' + itemId + ' -> ' + items[i].design);
              out = angular.copy(items[i].design);
              break;
            }
          }
        }, function (data) {
          console.log('Oops -failed to getItemColection: ' + data.length);
        });
        return out;
      }
    };
  }
]).filter('fabricLookup', [
  'ReferenceDataCache',
  function (ReferenceDataCache) {
    return function (input) {
      var options = ReferenceDataCache.getOptions();
      var out = '';
      console.log('Looking up fabric: ' + input);
      console.log('options.length: ' + options.length);
      for (var i = 0; i < options.length; i++) {
        if (options[i].id === input) {
          console.log('**Found options: ' + input + ' -> ' + options[i].fabrics);
          out = angular.copy(options[i].fabrics);
          break;
        }
      }
      return out;
    };
  }
]).filter('trimLookup', [
  'ReferenceDataCache',
  function (ReferenceDataCache) {
    return function (input) {
      var options = ReferenceDataCache.getOptions();
      var out = '';
      console.log('Looking up trim: ' + input);
      console.log('options.length: ' + options.length);
      for (var i = 0; i < options.length; i++) {
        if (options[i].id === input) {
          console.log('***********Found trim: ' + input + ' -> ' + options[i].trims);
          out = angular.copy(options[i].trims);
          break;
        }
      }
      return out;
    };
  }
]).filter('labelLookup', [
  'ReferenceDataCache',
  function (ReferenceDataCache) {
    return function (input) {
      var labels = ReferenceDataCache.getLabels();
      var out = '';
      console.log('Looking up label: ' + input);
      console.log('label.length: ' + labels.length);
      for (var i = 0; i < labels.length; i++) {
        if (labels[i].id === input) {
          console.log('Found label: ' + input + ' -> ' + labels[i].label);
          out = angular.copy(labels[i].label);
        }
      }
      return out;
    };
  }
]);
'use strict';
var designBuildDirective = angular.module('panicApp.designBuildDirectives', []);
designBuildDirective.directive('drawDress', function () {
  return {
    scope: { dress: '=' },
    template: '<img ng-repeat="selection in dress" ng-src="images/parts/{{selection.type}}-{{selection.id}}-{{selection.fabric}}.png" class="pic {{selection.type}}"/>'
  };
});
designBuildDirective.directive('drawTrim', function () {
  return {
    scope: { dress: '=' },
    template: '<img ng-repeat="selection in dress" ng-src="images/parts/trm-{{selection.type}}-{{selection.id}}-{{selection.trim}}.png" class="pic {{selection.type}}"/>'
  };
});
designBuildDirective.directive('drawExtras', function () {
  return {
    scope: { extras: '=' },
    template: '<img ng-repeat="selection in extras" ng-src="images/parts/{{selection.type}}-{{selection.id}}-{{selection.fabric}}.png" class="pic {{selection.type}}"/>'
  };
});
designBuildDirective.directive('fabricSelector', function () {
  return {
    restrict: 'E',
    templateUrl: 'template/designBuild/fabric.html',
    scope: {
      fabricSet: '=',
      selectedOption: '=',
      isTrim: '='
    }
  };
});
designBuildDirective.directive('drawFabrics', function () {
  return {
    scope: {
      selection: '=',
      selectedOption: '='
    },
    template: '<button ng-repeat="fabric in selection.fabrics" type="button" class="btn selector option fabric{{fabric.fabId}}" ng-model="selectedOption[\'fabric\']" btn-radio="fabric.fabId" tooltip="{{fabric.fabName}}"onClick="_gaq.push([\'_trackEvent\', \'Design Build\', \'select fabric\', \'{{selectedOption.type}}-{{selectedOption.id}}\', \'{{fabric.fabId}}\' ]);"></button>'
  };
});
designBuildDirective.directive('drawTrimFabrics', function () {
  return {
    scope: {
      selection: '=',
      selectedOption: '='
    },
    template: '<button ng-repeat="fabric in selection.fabrics" type="button" class="btn selector option fabric{{fabric.fabId}}" ng-model="selectedOption[\'trim\']" btn-radio="fabric.fabId" tooltip="{{fabric.fabName}}"onClick="_gaq.push([\'_trackEvent\', \'Design Build\', \'select fabric\', \'{{selectedOption.type}}-{{selectedOption.id}}\', \'{{fabric.fabId}}\' ]);"></button>'
  };
});
designBuildDirective.directive('drawAdmin', function () {
  return {
    scope: { dress: '=' },
    template: '<img ng-repeat="selection in dress" ng-src="images/parts/{{selection.type}}-{{selection.id}}-{{selection.fabric}}.png" class="pic {{selection.type}}"/>'
  };
});
'use strict';
var designBuildFilter = angular.module('panicApp.designBuildFilters', []);
designBuildFilter.filter('filterSets', function () {
  return function (sets, filter) {
    var filteredResult = [];
    for (var filterFabric in filter)
      for (var fabricSet in sets) {
        if (filter[filterFabric].setId == sets[fabricSet].setId) {
          filteredResult.push(sets[fabricSet]);
          break;
        }
      }
    return filteredResult;
  };
});
'use strict';
angular.module('panicApp.Controllers', []).run([
  '$http',
  function ($http) {
    console.log('run analytics');
    _gaq.push([
      '_setAccount',
      'UA-38964974-1'
    ]);
    _gaq.push([
      '_setDomainName',
      'none'
    ]);
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
  }
]);
var trackPageInGoogleAnalytics = function ($rootScope, $window, $location, $routeParams, path, search) {
  console.log('trackPageInGoogleAnalytics');
  $rootScope.$on('$viewContentLoaded', track($window, $location, $routeParams, path, search));
};
var track = function ($window, $location, $routeParams, path, search) {
  console.log('$location=');
  console.log($location);
  var path = convertPathToQueryString($location.path(), $routeParams);
  console.log('track: about to push: ' + path);
  $window._gaq.push([
    '_trackPageview',
    path
  ]);
  console.log('track: pushed ');
};
var convertPathToQueryString = function (locpath, $routeParams, path, search) {
  console.log('convertPathToQueryString');
  console.log('$routeParams=');
  console.log($routeParams);
  console.log('locpath=');
  console.log(locpath);
  console.log('path=');
  console.log(path);
  console.log('search=');
  console.log(search);
  for (var key in $routeParams) {
    var queryParam = '/' + $routeParams[key];
    console.log('queryParam=' + queryParam);
    locpath = locpath.replace(queryParam, '');
    console.log('path ADDED=' + locpath);
  }
  console.log('path NOW=' + locpath);
  for (key in $routeParams) {
    console.log('key=' + key);
  }
  var querystring = getAsUriParameters($routeParams);
  console.log('querystring=' + querystring);
  if (querystring === '')
    return path;
  return path + '?' + querystring;
};
var getAsUriParameters = function (data) {
  var url = '';
  for (var prop in data) {
    url += encodeURIComponent(prop) + '=' + encodeURIComponent(data[prop]) + '&';
  }
  return url.substring(0, url.length - 1);
};
'use strict';
angular.module('panicApp.Controllers').controller('NewDesignBuildCtrl', [
  '$scope',
  '$routeParams',
  'Range',
  'ReferenceDataCache',
  'DesignBuilder',
  '$rootScope',
  '$window',
  '$location',
  function ($scope, $routeParams, Range, ReferenceDataCache, DesignBuilder, $rootScope, $window, $location) {
    trackPageInGoogleAnalytics($rootScope, $window, $location, $routeParams);
    var master = '', categoryId = 'dresses', designId = 'sheath-fitted', itemId = '', allFabricSets = {}, range = {};
    $scope.isDebugCollapsed = true;
    $scope.designId = designId;
    $scope.categoryId = categoryId;
    var clearTrim = function (partType) {
      partType.trim = '';
    };
    $scope.clearTrim = clearTrim;
    if (itemId) {
      Range.itemCollection(function (itemData) {
        console.log('Looking up item: ' + itemId);
        console.log('itemData.length: ' + itemData.length);
        for (var i = 0; i < itemData.length; i++) {
          console.log('-Checking item: ' + itemData[i].itemId);
          if (itemData[i].itemId === itemId) {
            console.log('---Found item: ' + itemId + ' -> ' + itemData[i].design);
            master = angular.copy(itemData[i].design);
            break;
          }
        }
      }, function (data) {
        console.log('Oops - failed to getItemColection: ' + data.length);
      });
    }
    $scope.ranges = Range.designCatalogue(function (data) {
      console.log('==================');
      loadDesign($scope);
    });
    $scope.range = DesignBuilder.get({ fileId: designId }, function (data) {
      if (!itemId) {
        master = angular.copy(data.default);
      }
      range = angular.copy(data);
      $scope.master = master;
      $scope.cancel();
    }, function (data) {
      alert('ooops la - loading range');
    });
    $scope.cancel = function () {
      $scope.form = angular.copy(master);
    };
    $scope.fabricSets = DesignBuilder.fabricSets(function (data) {
      allFabricSets = angular.copy(data);
      for (var option in range.options) {
        for (var set in range.options[option].fabricSets) {
          for (var fabricSet in allFabricSets) {
            if (range.options[option].fabricSets[set].set == allFabricSets[fabricSet].setId) {
              $scope.range.options[option].fabricSets[set] = allFabricSets[fabricSet];
              break;
            }
          }
        }
      }
    }, function (data) {
      alert('ooops - loading fabrics');
    });
    $scope.save = function () {
      master = $scope.form;
      $scope.cancel();
    };
    $scope.isCancelDisabled = function () {
      return angular.equals(master, $scope.form);
    };
  }
]);
var loadDesign = function ($scope) {
  var category = getCategoryById($scope.ranges, $scope.categoryId), design = getDesignById(category.designs, $scope.designId);
  $scope.category = category;
  $scope.design = design;
};
var getCategoryById = function (categories, id) {
  console.log('categories.length' + categories.length);
  var category = [];
  for (var i = 0; i < categories.length; i++) {
    console.log('categoryName' + categories[i].catId);
    if (categories[i].catId === id) {
      console.log('Found category: ' + id + ' -> ' + categories[i].catId);
      category = angular.copy(categories[i]);
    }
  }
  console.log('Returning: ' + category);
  return category;
};
var getDesignById = function (designs, id) {
  console.log('designs.length: ' + designs.length);
  var design = {};
  for (var i = 0; i < designs.length; i++) {
    console.log('id: ' + designs[i].desId);
    if (designs[i].desId === id) {
      console.log('Found category: ' + id + ' -> ' + designs[i].desId);
      design = angular.copy(designs[i]);
    }
  }
  console.log('Returning: ' + design);
  return design;
};