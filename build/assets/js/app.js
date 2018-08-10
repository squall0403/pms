// var url = '../build/assets/data/';
var url = '../build/assets/data/';

var pms = angular.module('pms', [
  'ngRoute',
])
pms.filter('iif', function() {
  return function(input, trueValue, falseValue) {
    return input ? trueValue : falseValue;
  };
});
pms.controller('mainCtrl', ['$http', '$scope', function($http, $scope) {

}])

pms.controller('evaluator', ['$http', '$scope', function($http, $scope) {
  // Call user data
  $http.get(url + 'gl.json').then(function(data) {
    $scope.users = data.data;
    $scope.num_of_users = data.data.length;
    $scope.overall_achievement = 0;
    $scope.overall_idp = 0;
    var overall = 0;
    var overall_idp = 0;
    $scope.users.forEach(function(user) {
      overall = overall + user.achievement;
      overall = (overall / $scope.users.length);

      overall_idp = overall_idp + user.idp;
      overall_idp = (overall_idp / $scope.users.length);

      $scope.overall_achievement = overall.toFixed(0);
      $scope.overall_idp = overall_idp.toFixed(0);
    })
  }, function(err) {
    console.log(err);
  });

  // Toggle team bar
  $scope.show_team = function() {
    $('#team_bar').toggle();
  }

  // Team performance_chart
  function render_chart() {
    var ctx = document.getElementById('performance_indi_chart').getContext('2d');
    Chart.scaleService.updateScaleDefaults('linear', {
      ticks: {
        min: 0,
        max: 100,
        stepSize: 20
      }
    });
    var chart = new Chart(ctx, {
      // The type of chart we want to create
      type: 'line',

      // The data for our dataset
      data: {
        labels: ["S1/16", "S2/16", "S1/17", "S2/17", "S1/18", "S2/18"],
        datasets: [{
          label: "",
          backgroundColor: 'rgba(255,255,255,0)',
          borderColor: '#4265ed',
          data: [88, 89, 88, 87, 90, 90],
        }]
      },

      // Configuration options go here
      options: {
        legend: {
          display: false
        }
      }
    });
  }

  $scope.talent_index = 0;
  $scope.toggle = function(id, index) {
    $scope.talent_index = index;
    var target = '#' + id;
    $(target).toggle();
    render_chart();
  }

  // Talenet mapping

  // Select obj for comment

}]);

pms.controller('evaluatee', ['$http', '$scope', '$routeParams', function($http, $scope, $routeParams) {
  $scope.eveId = $routeParams.itemId;
  // Call user data
  $http.get(url + 'gl.json').then(function(data) {
    $scope.users = data.data;
  }, function(err) {
    console.log(err);
  });

  // Call obj data
  $http.get(url + 'Objectives.json').then(function(data) {
    $scope.objs = data.data;
    $scope.ref_objs = $scope.objs.slice(0, );
  }, function(err) {
    console.log(err);
  });

  // call sub-obj data
  $http.get(url + 'Sub-Objectives.json').then(function(data) {
    $scope.sub_objs = data.data;
    $scope.sub_objs.forEach(function(item) {
      $scope.total_score = $scope.total_score + item.achievement;
    });
    $scope.total_score = $scope.total_score.toFixed(2);

    switch ($scope.total_score) {
      case $scope.total_score < 50:
        $scope.ranking = 'Improvements required';
        break;
      case $scope.total_score <= 50 && $scope.total_score < 65:
        $scope.ranking = 'Partially meet expectation';
        break;
      case $scope.total_score <= 65 && $scope.total_score < 80:
        $scope.ranking = 'Meet expectation';
        break;
      case $scope.total_score >= 80:
        $scope.ranking = 'Exceed expectation';
        break;
    }
  }, function(err) {

  });

  // Show team bar
  $scope.show_team = function(id) {
    $(id).toggle();
  }

  // calculate DAte
  $scope.period_change = function() {
    switch ($scope.selected_period) {
      case 'S2-2018':
        $scope.end_date = '11/31/2018';
        $scope.start_date = '07/01/2018';
        break;
      case 'Q3-2018':
        $scope.end_date = '09/31/2018';
        $scope.start_date = '07/01/2018';
        break;
      case 'Q4-2018':
        $scope.end_date = '11/31/2018';
        $scope.start_date = '10/01/2018';
        break;
      default:
        $scope.end_date = '11/31/2018';
        $scope.start_date = '07/01/2018';
    }
    $scope.duration = (new Date($scope.end_date)).getMonth() - (new Date($scope.start_date)).getMonth();

  }

  $scope.add_period=function(){
      $scope.show_team('#create_new_period');
      $('#new_period').css('display','');
  }

  $scope.set_active = function(id){
    console.log(id);
    $(id).addClass('active');
  }
}]);

pms.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "partials/blank.html",
      title: 'PMS | Gameloft'
    })
    .when("/evaluator", {
      templateUrl: "partials/evaluator/index.html",
      controller: 'evaluator',
      title: 'Evaluator'
    })
    .when("/evaluatee/create/:itemId", {
      templateUrl: "partials/evaluatee/eve_create_period.html",
      controller: 'evaluatee',
      title: 'Evaluatee'
    })
    .when("/evaluatee/compose/:itemId", {
      templateUrl: "partials/evaluatee/eve_compose.html",
      controller: 'evaluatee',
      title: 'Evaluatee'
    })
    .when("/evaluatee/:itemId", {
      templateUrl: "partials/evaluatee/index.html",
      controller: 'evaluatee',
      title: 'Evaluatee'
    })
    .when("/evaluatee/info/:itemId", {
      templateUrl: "partials/evaluatee/eve_info.html",
      controller: 'evaluatee',
      title: 'Evaluatee'
    })
    .when("/evaluatee/detail/:itemId", {
      templateUrl: "partials/evaluator/eve_detail.html",
      controller: 'evaluatee',
      title: 'Evaluatee'
    });
  $locationProvider.hashPrefix('');
}]);
