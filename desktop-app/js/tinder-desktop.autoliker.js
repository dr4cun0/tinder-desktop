(function() {
  module = angular.module('tinder-desktop.autoliker', ['ngAutocomplete','ngRangeSlider', 'ngSanitize']);

  module.controller('AutolikerController', function($scope, $translate, $timeout, $interval, API, $rootScope) {

    function getYearsOld(girlsBirthday){
      let todaysDate = new Date();
      let girlsDate = new Date(girlsBirthday);
      var timeDiff = Math.abs(todaysDate.getTime() - girlsDate.getTime());
      var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      var diffYears = Math.floor(diffDays/365);
      return diffYears
    }

    if(!$rootScope.likedGirls){
      $rootScope.likedGirls = [];
    }

    $scope.likedGirls = $rootScope.likedGirls;

    $rootScope.allowedToAutolike = true;

    $rootScope.stopAutoliking = function(){
      $rootScope.allowedToAutolike = false;
      // $rootScope.alreadyRunning = false;
    };

    if(!$rootScope.counter) {
      $rootScope.counter = 0;
    }

    $rootScope.alreadyRunning = false;

    function likeGirls(){

      API.autoPeople(10).then(function(recResponse){
        // console.log(JSON.stringify(recResponse, 2, 2));
        recResponse.results.forEach(function(girl, index){
          let timeout = index * 2000;

          setTimeout(function(){
            let age = getYearsOld(girl.birth_date);
            let name = girl.name;
            let distance = (girl.distance_mi * 1.6).toFixed(1);
            let userId = girl._id;

            if(!$rootScope.allowedToAutolike) return;

            API.autoLike(girl._id).then(function(likeResponse){
              // console.log(JSON.stringify(likeResponse, 2, 2));
            });

            $rootScope.counter++;

            let counter = $rootScope.counter;

            var girlObject = {
              name,
              age,
              distance,
              userId,
              counter
            };

            $rootScope.likedGirls.push(girlObject);

            $scope.likedGirls = $rootScope.likedGirls;

          }, timeout)
        })
      })
    }

    function reboot(){
      if(!$rootScope.allowedToAutolike) return;
      // $rootScope.alreadyRunning = true;
      // begin liking girls
      likeGirls();
      setTimeout(function(){
          reboot()
        }, 30000 )
    }


    $scope.autoLikeGirls = function(){
      $rootScope.allowedToAutolike = true;

      reboot();
    }


  });
})();