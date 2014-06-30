describe('CookingChallengeController', function() {
    var $scope;

    beforeEach(function() {
        module('app');
        inject(createController);
    });

    function createController($rootScope, $controller) {
        var config;
        $scope = $rootScope.$new();
        $controller('CookingChallengeController', {$scope:$scope});
    }

    it('should let chin jung solve quiz1', inject(function($rootScope) {
        $scope.chinjung.quiz1.solved();
        expect($scope.chinjung.quiz1.isSolved()).toEqual(true);
    }));

    it('should let chin jung solve quiz3 without solving quiz1 first', inject(function($rootScope) {
        $scope.chinjung.quiz3.solved();
        expect($scope.chinjung.quiz3.isSolved()).toEqual(true);
    }));

    it('should let chin jung wins', inject(function($rootScope) {
        $scope.chinjung.quiz1.solved();
        $scope.chinjung.quiz2.solved();
        $scope.chinjung.quiz3.solved();
        $rootScope.$apply();
        //expect($scope.completed).toEqual(true);
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

});
