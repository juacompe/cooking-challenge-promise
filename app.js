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
    var deferred, challenger;
    deferred = $q.defer();
    challenger = new Challenger(challengerName);

    $q.when(challenger)
      .then(doQuestOnDay1)
      .then(doQuestOnDay2)
      .then(doQuestOnDay3)
      .then(function(challenger) {
          challenger.updatedAt = Date.now();
          deferred.resolve(challenger);
        }, function(reason) {
          challenger.updatedAt = Date.now();
          deferred.reject(challenger);
        });

    return deferred.promise;
  };

  var doQuestOnDay1 = function(challenger) {
    challenger.useFirst2Cues(FIRST_CUE, SECOND_CUE);
    return challenger;
  };

  var doQuestOnDay2 = function(challenger) {
    challenger.useThirdCue(THIRD_CUE);
    return challenger;
  };

  var doQuestOnDay3 = function(challenger) {
    var d = $q.defer();
    if (challenger.challengerName == ICHIKO) {
      challenger.findIngredient(RARE_INGREDIENT);
      return challenger;
    } else {
      challenger.admitDefeat();
      d.reject(challenger);
    }
    return d.promise;
  };

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
    this.firstCue = firstCue;
    this.secondCue = secondCue;
    this.updatedAt = Date.now();
  };
  
  this.useThirdCue = function(thirdCue) {
    this.thirdCue = thirdCue;
    this.update();
  };

  this.findIngredient = function(i) {
    this.ingredient = i;
    this.update();
  };

  this.admitDefeat = function() {
    this.update();
  };

  this.update = function() {
    this.updatedAt = Date.now();
  };
}
