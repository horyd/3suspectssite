var myApp = angular.module('response', ['mongolab']).
  config(function($routeProvider) {
    $routeProvider.
      when('/thanks', {templateUrl:'partials/thanks'}).
      when('/edit/:response', {controller:EditCtrl, templateUrl:'partials/questions'}).
      when('/result/:id', {controller:CreateCtrl, templateUrl:'partials/email'}).
      when('/', {controller:SuspectCtrl, templateUrl:'partials/suspects'}).
      otherwise({redirectTo:'/'});
  });


myApp.service('suspects', function() {
  return [
          { name: 'Businessman',
            motive: 'The former business partner financially crippled by a deal gone wrong?',
            arrest: 'Sounds like cold blooded revenge, but where was the financial motive?',
            img: '/images/businessman-01.png',
            redimg: '/images/businessman-red-01.png'
          },
          { name: 'Ex-Lover',
            motive: 'The jilted ex-lover whose name is still in the will?',
            arrest: 'The money in the will isn\'t much, but what about the custody dispute over their only child?',
            img: '/images/woman-01.png',
            redimg: '/images/woman-red-01.png'
          },
          { name: 'Stranger',
            motive: 'The stranger seen lurking around the house over the past few weeks?',
            arrest: 'This man is a private investigator, or is that just a cover for \'hitman\'?',
            img: '/images/stranger-01.png',
            redimg: '/images/stranger-red-01.png'
          }
        ]
});

function CreateCtrl($scope, $location,$routeParams, suspects, Response) {
    
  $scope.suspect = suspects[$routeParams.id]

  $scope.save = function() {
    Response.save($scope.response, function(response) {
      $location.path('/edit/' + response._id.$oid);
    });
  };
}

function SuspectCtrl($scope, $location, suspects) {
  $scope.suspects = suspects;
  $scope.activate = 4;
  $scope.gotoResult = function(index){
    $location.path('/result/' + index)
  }
}

function EditCtrl($scope, $location, $filter, $routeParams, Response) {
  var self = this;


  Response.get({id: $routeParams.response}, function(response) {
    self.original = response;
    $scope.response = new Response(self.original);

    $scope.response.devices = [
      { name: 'iPhone',    checked: false },
      { name: 'iPad',   checked: false },
      { name: 'Android Phone',     checked: false },
      { name: 'Android Tablet', checked: false },
      { name: 'Windows Phone 8', checked: false },
      { name: 'Windows 8', checked: false },
      { name: 'A Web Browser', checked: false }
    ];


  });

  $scope.save = function() {
    $scope.response.update(function() {
      $location.path('/thanks');
    });
  }
}

// This is a module for cloud persistance in mongolab - https://mongolab.com
angular.module('mongolab', ['ngResource']).
    factory('Response', function($resource) {
      var Response = $resource('https://api.mongolab.com/api/1/databases' +
          '/3suspects/collections/responses/:id',
          { apiKey: '509286cee4b010d72c561e95' }, {
            update: { method: 'PUT' }
          }
      );

      Response.prototype.update = function(cb) {
        return Response.update({id: this._id.$oid},
            angular.extend({}, this, {_id:undefined}), cb);
      };

      Response.prototype.destroy = function(cb) {
        return Response.remove({id: this._id.$oid}, cb);
      };

      return Response;
    });