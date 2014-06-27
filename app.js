var app = angular.module('app', []);

app.controller('CookingChallengeController', function($scope, $q) {
  var RARE_INGREDIENT = 'EARTH';
  var ICHIKO = 'ichiko';
  var ACHIO = 'achio';
  var FIRST_CUE = "north moutain in Shitusoka";
  var SECOND_CUE = "waterfall in Kanangawa";
  var THIRD_CUE = "blue sea in Hokido";

  $scope.result = "";

  $scope.startChallenge = function() {
    $q.all([findIngredientBy(ICHIKO), findIngredientBy(ACHIO)])
      .then(decidesWhoWins, decidesWinnerFromLoser);
  };

  function decidesWhoWins(challengers) {
    ichiko = challengers[0];
    achio = challengers[1];

    if (ichiko.ingredient == RARE_INGREDIENT && achio.ingredient == RARE_INGREDIENT) {
      $scope.result = "Mr.Ichiko and President Achio drawn";
    } else if (ichiko.ingredient == RARE_INGREDIENT && achio.ingredient != RARE_INGREDIENT) {
      $scope.result = "Mr.Ichiko win";
    } else if (achio.ingredient == RARE_INGREDIENT && ichiko.ingredient != RARE_INGREDIENT) {
      $scope.result = "President Achio win";
    } else {
      $scope.result = "Both of challengers failed to find the ingredient";
    }
  };

  function decidesWinnerFromLoser(loser) {
    if (loser.challenger == ICHIKO) {
      $scope.result = "President Achio win";
    } else {
      $scope.result = "Mr.Ichiko win";
    }
  };

  var findIngredientBy = function(challengerName) {
    var deferred = $q.defer();
    var challenger = initializeChallenger(challengerName);

    $q.when(challenger)
      .then(useFirstCue)
      .then(useSecondCue)
      .then(useThirdCue)
      .then(function(challenger) {
          challenger.updatedAt = Date.now();
          deferred.resolve(challenger);
        }, function(reason) {
          challenger.updatedAt = Date.now();
          deferred.reject(challenger);
        });

    return deferred.promise;
  };

  var useFirstCue = function(challenger) {
    challenger.useFirst2Cues(FIRST_CUE, SECOND_CUE);
    return challenger;
  };

  var useSecondCue = function(challenger) {
    challenger.useThirdCue(THIRD_CUE);
    return challenger;
  };

  var useThirdCue = function(challenger) {
    if (challenger.challengerName == ACHIO) {
      challenger.ingredient = RARE_INGREDIENT;
      challenger.updatedAt = Date.now();
      return challenger;
    } else {
      challenger.updatedAt = Date.now();
      throw challenger;
    }
  };

  var initializeChallenger = function(challengerName) {
    return new Challenger(challengerName);
  }
});

function Challenger(name) {
  this.challengerName = name;
  this.firstCue = "";
  this.secondCue = "";
  this.thirdCue = "";
  this.ingredient = "";
  this.createdAt = Date.now();
  this.updatedAt = Date.now();

  this.useFirst2Cues = function(firstCue, secondCue) {
    challenger.firstCue = firstCue;
    challenger.secondCue = secondCue;
    challenger.updatedAt = Date.now();
  };
  
  this.useThirdCue = function(thirdCue) {
    challenger.thirdCue = thirdCue;
    challenger.updatedAt = Date.now();
  };
}
