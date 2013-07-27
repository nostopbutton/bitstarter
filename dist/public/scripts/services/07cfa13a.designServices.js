'use strict';

var designServices = angular.module('panicApp.designServices', []);

designServices
    .service('designParameters', function(){

    var design = {};

    return {
      getDesign: function () {
        return design;
      },
      setDesign: function(value) {
        design = value;
      }
    };
  }
);
