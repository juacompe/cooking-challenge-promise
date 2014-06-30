var app = angular.module('app', []);

app.controller('CookingChallengeController', function($scope, $q, challenges, competition) {

  $scope.clock = 10;
  $scope.chinjung = new challenges('chin jung');
  $scope.akiko = new challenges('akiko');

  $scope.competition = new competition([$scope.chinjung, $scope.akiko], $scope.clock);

  $scope.competition.clock.then(null, null, function(data) {
    $scope.clock = data;
  });

  $scope.competition.start().then(function(data) {
    $scope.completed = true;
    $scope.message = data;
  });

});

app.factory('competition', function($q, timer) {
  return function(challengers, second) {
    var clock = new timer(second);

    this.start = function() {
      var promises = challengers.map(function(ch) { return ch.start(clock); });
      return $q.all(promises).then(function(data) {
        clock.stop();
        return data;
      });
    };

    this.clock = clock;

    return this;
  };
});

app.factory('challenges', function($q, quiz) {

  return function(challenger) {
    this.challenger_name = challenger;

    this.start = function(timer) {

      var deferred = $q.defer();
      this.quiz1 = new quiz('mushroom', timer);
      this.quiz2 = new quiz('ginseng', timer);
      this.quiz3 = new quiz('green tea', timer);

      this.quiz1.result()
        .then(this.quiz2.result)
        .then(this.quiz3.result)
        .then(function() {
          deferred.resolve(challenger + " has completed all the challenges!");
      }, function(data) {
          deferred.resolve(challenger + " is out because : " + data);
      });

      return deferred.promise;
    };
  };
});

app.factory('quiz', function($q) {

  return function(item, timer) {
    var name = item;
    var isSolved = false;
    var deferred = $q.defer();

    timer.catch(function() { deferred.reject('cannot find ' + item + ' in time'); });

    this.solved = function() {
      deferred.resolve('found ' + name);
      isSolved = true;
    };

    this.isSolved = function() {
      return isSolved;
    };

    this.result = function() {
      return deferred.promise;
    };

    return this;
  };
});

app.factory('timer', function($interval, $q) {

  return function(second) {
    var deferred = $q.defer();
    var counter = second;
    var clock = $interval(function() {
      counter--;
      deferred.notify(counter);
      if (counter <= 0) {
        deferred.reject("timeout");
        $interval.cancel(clock);
      }
    }, 1000);

    deferred.promise.stop = function() { $interval.cancel(clock); };

    return deferred.promise;
  };
});
