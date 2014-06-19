var app = angular.module('app', []);

app.controller('CookingChallengeController', function($scope, $q) {
  var RARE_INGREDIENT = 'EARTH';
  var ICHIKO = 'ichiko';
  var ACHIO = 'achio';
  var FIRST_CUE = "north moutain in Shitusoka";
  var SECOND_CUE = "waterfall in Kanangawa";
  var THIRD_CUE = "blue sea in Hokido";

  $scope.winner = "";
  $scope.loser = "";

  findIngredientBy = function(challengerName) {
    var deferred = $q.defer();

    useFirstCue(challengerName)
      .then(useSecondCue)
      .then(useThirdCue)
      .then(function(result) {
          deferred.resolve({
            challengerName: result.challengerName,
            firstCue: result.firstCue,
            secondCue: result.secondCue,
            thirdCue: result.thirdCue,
            ingredient: result.ingredient,
            foundAt: Date.now()
          });
        }, function(reason) {
          deferred.reject({
            challengerName: reason.challengerName,
            firstCue: reason.firstCue,
            secondCue: reason.secondCue,
            thirdCue: reason.thirdCue,
            ingredient: "",
            givenupAt: Date.now()
          });
        });

    return deferred.promise;
  };

});
