'use strict';

angular.module('panicApp.Controllers')
  .controller('NewDesignBuildCtrl', ['$scope', '$routeParams', 'Range', 'ReferenceDataCache', 'DesignBuilder',
    '$rootScope', '$window', '$location',
    function ($scope, $routeParams, Range, ReferenceDataCache, DesignBuilder,
              $rootScope, $window, $location) {

      trackPageInGoogleAnalytics($rootScope, $window, $location, $routeParams);
      var master="",
        categoryId = "dresses",//$routeParams.categoryId;
        designId = $routeParams.rangeId,
        itemId = $routeParams.itemId,
        allFabricSets = {},
        range = {};

      $scope.isDebugCollapsed = true;
      $scope.designId = designId;
      $scope.categoryId = categoryId;

      var clearTrim = function(partType) {
        partType.trim = "";
      }
      $scope.clearTrim = clearTrim;

//      var clearFabric = function(partType) {
//        console.log("partType");
//        console.log(partType);
//
//        partType.trim = "";
//      }
//      $scope.clearFabric = clearFabric;

      if(itemId) {
        Range.itemCollection(function(itemData){
            console.log("Looking up item: "+itemId);
            console.log("itemData.length: "+itemData.length);

            for (var i=0; i<itemData.length; i++){
              console.log("-Checking item: "+itemData[i].itemId);

              if (itemData[i].itemId === itemId) {
                console.log("---Found item: "+itemId + " -> "+itemData[i].design);
                master = angular.copy(itemData[i].design);
                break;
              }
            }
          },
          function(data) {
            console.log("Oops - failed to getItemColection: " + data.length)
          })
      }


//      $scope.isActive = function(cat) {
//        return cat.category.categoryName.designs.id === designId;
//      };

      $scope.ranges = Range.designCatalogue(
        function (data) {   //success

//          category  = getCategoryById(data, categoryId);
////          console.log('category.designs: '+category.designs);
//          design  = getDesignById(category.designs, designId);
//          console.log('design.desName: '+design.desName);
//          $scope.category = category;
//          $scope.design = design;
          console.log("==================");
          loadDesign($scope);//, data, categoryId, designId);

        }
      );
//      $scope.category = ReferenceDataCache.getCategory(categoryId);
//      $scope.design = ReferenceDataCache.getDesign(designId);

      $scope.range = DesignBuilder.get({fileId: $routeParams.rangeId},
        function (data) {   //success
          if(!itemId) {
            master = angular.copy(data.default);
          }
          range = angular.copy(data);
          $scope.master = master;     // so it can be viewed in debug screen
          $scope.cancel();            // set form to master
        },
        function (data) {             //failure
          alert("ooops - loading range");
        });

      $scope.cancel = function() {
        $scope.form = angular.copy(master);
      };

      $scope.fabricSets = DesignBuilder.fabricSets(
        function(data) {   // success
          allFabricSets = angular.copy(data);

          for (var option in range.options){
            for(var set in range.options[option].fabricSets){
              for(var fabricSet in allFabricSets) {
                if(range.options[option].fabricSets[set].set == allFabricSets[fabricSet].setId){
                  $scope.range.options[option].fabricSets[set] = allFabricSets[fabricSet];
                  break;
                }
              }
            }
          }

        }, function (data) {             //failure
          alert("ooops - loading fabrics");
        });
//      );

      $scope.save = function() {
        master = $scope.form;
        $scope.cancel();
      };

      $scope.isCancelDisabled = function() {
        return angular.equals(master, $scope.form);
      };

//      $scope.loadDesign = loadDesign;//, designId);

//    $scope.isSaveDisabled = function() {
//        return $scope.form.$invalid || angular.equals(master, $scope.form);
//    };

//    $scope.cancel();

    }])

var loadDesign = function($scope){//, catalogue, catId, desId) {
  var category  = getCategoryById($scope.ranges, $scope.categoryId),

    design  = getDesignById(category.designs, $scope.designId);
//  console.log('category.designs: '+category.designs);
//  console.log('design.desName: '+design.desName);
  $scope.category = category;
  $scope.design = design;
}

var getCategoryById = function(categories, id) {
  console.log("categories.length"+categories.length);

  var category = [];
  for (var i=0; i<categories.length; i++){
    console.log("categoryName"+categories[i].catId);
    if (categories[i].catId === id) {
      console.log("Found category: "+id + " -> "+categories[i].catId);
      category = angular.copy(categories[i]);
    }
  }
  console.log("Returning: "+category);

  return category;
}

var getDesignById = function(designs, id) {
  console.log("designs.length: "+designs.length);

  var design = {};
  for (var i=0; i<designs.length; i++){
    console.log("id: "+designs[i].desId);
    if (designs[i].desId === id) {
      console.log("Found category: "+id + " -> "+designs[i].desId);
      design = angular.copy(designs[i]);
    }
  }
  console.log("Returning: "+design);

  return design;
}

