describe('CookingChallengeController', function() {
    var $scope;

    beforeEach(function() {
        module('app');
        inject(createController);
    });

    function createController($rootScope, $controller) {
        $scope = $rootScope.$new();
        $controller('CookingChallengeController', {$scope:$scope});
    }

    it('should let chin jung solve quiz1', function() {
        $scope.chinjung.quiz1.solved();
        expect($scope.chinjung.quiz1.isSolved()).toEqual(true);
    });

    it('should let chin jung solve quiz3 without solving quiz1 first', function() {
        $scope.chinjung.quiz3.solved();
        expect($scope.chinjung.quiz3.isSolved()).toEqual(true);
    });

    it('should let chin jung wins', inject(function($rootScope, $interval) {
        var clock = $scope.clock;
        $scope.chinjung.quiz1.solved();
        $scope.chinjung.quiz2.solved();
        $scope.chinjung.quiz3.solved();

        // trick 10 seconds interval
        for (var i = 0; i < clock; i++) $interval.flush(1000);

        $rootScope.$apply();
        expect($scope.completed).toEqual(true);
    }));
});

describe('challenges', function() {
    var c;

    beforeEach(function(){
        module('app');
        inject(function(challenges){
            c = new challenges('akiko');
        });
    });

    it('should out when cannot find ingredient in time', inject(function($q, $rootScope) {
        var d, promise, message;
        d = $q.defer();
        promise = c.start(d.promise);
        d.reject('timeout');
        message = 'akiko is out because : cannot find mushroom in time';
        expect(getResolvedValue(promise, $rootScope)).toEqual(message);
    }));

    it('should complete when all ingredient are found', inject(function(timer, $rootScope) {
        var promise, message;
        promise = c.start(new timer());
        c.quiz1.solved();
        c.quiz2.solved();
        c.quiz3.solved();
        message = 'akiko has completed all the challenges!';
        expect(getResolvedValue(promise, $rootScope)).toEqual(message);
    }));
});

describe('quiz', function() {
    var q;

    beforeEach(function(){
        module('app');
        inject(function(quiz, timer){
            q = new quiz('mushroom', new timer());
        });
    });

    it('can be solved', function() {
        q.solved();
        expect(q.isSolved()).toEqual(true);
    });

    it('return result after solved', inject(function($rootScope) {
        q.solved();
        expect(getResolvedValue(q.result(), $rootScope)).toEqual('found mushroom');
    }));

    it('return cannot find item in time when time up', inject(function($rootScope, $q) {
        var d = $q.defer();
        inject(function(quiz){
            q = new quiz('mushroom', d.promise);
        });
        d.reject('timeout');
        expect(getRejectedValue(q.result(), $rootScope)).toEqual('cannot find mushroom in time');
    }));

});

function getResolvedValue(promise, $rootScope) {
    var result;
    promise.then(function(value) {
        result = value;
    });
    $rootScope.$apply();
    return result;
}

function getRejectedValue(promise, $rootScope) {
    var result;
    promise.catch(function(value) {
        result = value;
    });
    $rootScope.$apply();
    return result;
}

