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

  $scope.startChallenge = function() {
    $q.all([findIngredientBy(ICHIKO), findIngredientBy(ACHIO)])
      .then(function(challengers) {
        ichiko = challengers[0];
        achio = challengers[1];
      }, function(loser) {

      });
  };

  findIngredientBy = function(challengerName) {
    var deferred = $q.defer();
    var challenger = initializeChallenger(challengerName);

    useFirstCue(challenger)
      .then(useSecondCue)
      .then(useThirdCue)
      .then(function(result)
          deferred.resolve({
            challengerName: result.challengerName,
            firstCue: result.firstCue,
            secondCue: result.secondCue,
            thirdCue: result.thirdCue,
            ingredient: result.ingredient,
            createdAt: Date.now()
          });
        }, function(reason) {
          deferred.reject({
            challengerName: reason.challengerName,
            firstCue: reason.firstCue,
            secondCue: reason.secondCue,
            thirdCue: reason.thirdCue,
            ingredient: "",
            createdAt: Date.now()
          });
        });

    return deferred.promise;
  };

  useFirstCue = function(challenger) {
    var deferred = $q.defer();

    challenger.firstCue = FIRST_CUE;
    challenger.secondCue = SECOND_CUE;
    challenger.updatedAt = Date.now();

    deferred.resolve(challenger);

    return deferred.promise;
  };

  useSecondCue = function(challenger) {
    var deferred = $q.defer();

    challenger.thirdCue = THIRD_CUE;
    challenger.updatedAt = Date.now();

    deferred.resolve(challenger);

    return deferred.promise;
  };

  useThirdCue = function(challenger) {
    var deferred = $q.defer();

    if (challenger.challengerName == ICHIKO) {

      challenger.ingredient = RARE_INGREDIENT,
      challenger.updatedAt = Date.now();
      deferred.resolve(challenger);
    } else {
      challenger.updatedAt = Date.now();
      deferred.reject(challenger);
    }

    return deferred.promise;
  }

  initializeChallenger = function(challengerName) {
    return {
      challengerName: challengerName,
      firstCue: "",
      secondCue: "",
      thirdCue: "",
      ingredient: "",
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
  }
});
