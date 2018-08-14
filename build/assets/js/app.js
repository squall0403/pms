var url = '../assets/data/';
// var url = '../build/assets/data/';

var overall = 0;
var overall_idp = 0;
var today = new Date();

var pms = angular.module('pms', [
  'ngRoute',
])
pms.filter('iif', function() {
  return function(input, trueValue, falseValue) {
    return input ? trueValue : falseValue;
  };
});

pms.controller('mainCtrl', ['$http', '$scope', '$routeParams', '$location', function($http, $scope, $routeParams, $location) {
  // Define scope variable -------------------------------

  $scope.eveId = $routeParams.itemId;
  $scope.total_score = 0;
  $scope.ranking = '';
  $scope.talent_index = 0;
  $scope.overall_achievement = 0;
  $scope.overall_idp = 0;
  $scope.added_priority = 'Normal';
  $scope.added_idp_eta = today;

  $scope.set_active = function(id) {
    $scope.active_obj = id.substr(-1, 1);
    $(id).addClass('active');
    if (id.substr(0, 4) != '#obj') {
      $scope.selected_comment = $scope.sub_objs[id.substr(-1, 1)].comment;
      $scope.selected_rate = $scope.sub_objs[id.substr(-1, 1)].rate1;
    }
  }

  // Call obj data
  $http.get(url + 'Objectives.json').then(function(data) {
    $scope.objs = data.data;
  }, function(err) {
    console.log(err);
  });

  // Call sub-obj data
  $http.get(url + 'Sub-Objectives.json').then(function(data) {
    $scope.sub_objs = data.data;
  }, function(err) {
    console.log(err);
  });

  // Call user data -------------------------------
  $http.get(url + 'gl.json').then(function(data) {
    $scope.users = data.data;
    $scope.num_of_users = data.data.length;


    // calculate user overall achievement  -------------------------------
    $scope.users.forEach(function(user) {
      overall = overall + user.achievement;
      overall_idp = overall_idp + user.idp;
    });

    overall = (overall / $scope.users.length);
    overall_idp = (overall_idp / $scope.users.length);
    $scope.overall_achievement = overall.toFixed(0);
    $scope.overall_idp = overall_idp.toFixed(0);

  }, function(err) {
    console.log(err);
  });

  // Call obj data
  $http.get(url + 'Objectives.json').then(function(data) {
    $scope.objs = data.data;

  }, function(err) {
    console.log(err);
  });

  // call idp ref datas
  $http.get(url + 'idp_ref.json').then(function(data) {
    $scope.idp_refs = data.data;
  }, function(err) {
    console.log(err);
  })

  // Call IDP data

  $http.get(url + 'IDP.json').then(function(data) {
    $scope.idps = data.data;
  }, function(err) {
    console.log(err);
  })

  // call sub-obj data
  $http.get(url + 'Sub-Objectives.json').then(function(data) {
    $scope.sub_objs = data.data;
    $scope.achievement = 0;

    // calculate achieve for each sub-obj
    $scope.sub_objs.forEach(function(item) {
      item.achievement = (((item.rate1 + item.rate2) / 2) * item.weight / 100).toFixed(0);
      $scope.total_score = $scope.total_score + parseInt(item.achievement);

    });


    // Calculate total score
    $scope.total_score = parseInt($scope.total_score.toFixed(2));
    if ($scope.total_score < 50) {
      $scope.ranking = 'Improvements required';
    } else if ($scope.total_score >= 50 && $scope.total_score < 65) {
      $scope.ranking = 'Partially meet expectation';
    } else if ($scope.total_score >= 65 && $scope.total_score < 80) {
      $scope.ranking = 'Meet expectation';
    } else {
      $scope.ranking = 'Exceed expectation';
    }
  }, function(err) {

  });

  // Set active on selected navbar item
  $scope.$watch(function() {
    return $location.path();
  }, function(value) {
    if (value.substr(0, 4) == '/idp') {
      $scope.navbar_selected = 'idp';
    } else {
      $scope.navbar_selected = 'eva';
    }
  });

  // Show team bar
  $scope.show_team = function(id) {
    $(id).toggle();
  }


}])

pms.controller('evaluator', ['$http', '$scope', '$routeParams', '$location', function($http, $scope, $routeParams, $location) {

  $scope.eveId = $routeParams.itemId;

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
          data: [80, 65, 75, 70, 60, 85],
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

  // Render chart
  $scope.toggle = function(id, index) {
    $scope.talent_index = index;
    var target = '#' + id;
    $(target).toggle();
    render_chart();
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

  $scope.add_period = function() {
    $scope.show_team('#create_new_period');
    $('#new_period').css('display', '');
  }

  // Add idp to list

  $scope.add_idp = function() {
    $scope.idps.push({
      "competency": $scope.added_idp,
      "objective": $scope.added_obj_idp,
      "priority": $scope.added_priority,
      "eta": ('0' + ($scope.added_idp_eta.getMonth() + 1)).slice(-2) + '/' + ('0' + ($scope.added_idp_eta.getDate() + 1)).slice(-2) + '/' + $scope.added_idp_eta.getFullYear(),
      "comment": "",
      "ilearn": false,
      "progress": 0,
      "status": "Not started"
    });
    $scope.show_team('#modal_add');
  }

  $scope.edit_idp = function(id, index) {
    $(id).toggle();
    $scope.editing_idp = $scope.idps[index];
    $scope.editing_idp.eta = new Date($scope.editing_idp.eta);

    if ($scope.editing_idp.progress == 0) {
      $scope.editing_idp.status = 'Not started';
    } else if ($scope.editing_idp.progress == 100) {
      $scope.editing_idp.status = 'Completed';
    } else {
      $scope.editing_idp.status = 'In progress';
    }

    $scope.idps[index] = $scope.editing_idp;
  }

  // Set active on selected navbar item
  $scope.$watch(function() {
    return $location.path();
  }, function(value) {
    if (value.substr(0, 4) == '/idp') {
      $scope.navbar_selected = 'idp';
    } else {
      $scope.navbar_selected = 'eva';
    }
  });
}]);

pms.controller('evaluatee', ['$http', '$scope', '$routeParams','$location', function($http, $scope, $routeParams,$location) {
  $scope.eve_score = $scope.total_score;
  $scope.eve_ranking = $scope.ranking;
  $scope.eveId = $routeParams.itemId;
  $scope.eve_finish = false;
  // Call user data
  $http.get(url + 'gl.json').then(function(data) {
    $scope.users = data.data;
    $scope.num_of_users = data.data.length;
  }, function(err) {
    console.log(err);
  });

  // Add idp to list

  $scope.add_idp = function() {
    $scope.idps.push({
      "competency": $scope.added_idp,
      "objective": $scope.added_obj_idp,
      "priority": $scope.added_priority,
      "eta": ('0' + ($scope.added_idp_eta.getMonth() + 1)).slice(-2) + '/' + ('0' + ($scope.added_idp_eta.getDate() + 1)).slice(-2) + '/' + $scope.added_idp_eta.getFullYear(),
      "comment": "",
      "ilearn": false,
      "progress": 0,
      "status": "Not started"
    });
    $scope.show_team('#modal_add');
  }

  $scope.edit_idp = function(id, index) {
    $(id).toggle();
    $scope.editing_idp = $scope.idps[index];
    $scope.editing_idp.eta = new Date($scope.editing_idp.eta);

    if ($scope.editing_idp.progress == 0) {
      $scope.editing_idp.status = 'Not started';
    } else if ($scope.editing_idp.progress == 100) {
      $scope.editing_idp.status = 'Completed';
    } else {
      $scope.editing_idp.status = 'In progress';
    }

    $scope.idps[index] = $scope.editing_idp;
  }

  // Set active on selected navbar item
  $scope.$watch(function() {
    return $location.path();
  }, function(value) {
    if (value.substr(-6, 4) == '/idp') {
      $scope.navbar_selected = 'idp';
    } else {
      $scope.navbar_selected = 'eva';
    }
  });

  $scope.eve_agree = function() {
    $scope.eve_score = 0;
    $scope.eve_ranking = 'Completed';
    $scope.eve_finish = true;

    $location.url('evaluatee/info/' + $scope.eveId);
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
    .when("/evaluator/create/:itemId", {
      templateUrl: "partials/evaluator/evo_create_period.html",
      controller: 'evaluator',
      title: 'Evaluatee'
    })
    .when("/evaluator/detail/:itemId", {
      templateUrl: "partials/evaluator/evo_detail.html",
      controller: 'evaluator',
      title: 'Evaluatee'
    })
    .when("/evaluator/review/:itemId", {
      templateUrl: "partials/evaluator/evo_period_review.html",
      controller: 'evaluator',
      title: 'Evaluatee'
    })
    .when("/evaluator/compose/:itemId", {
      templateUrl: "partials/evaluator/evo_compose.html",
      controller: 'evaluator',
      title: 'Evaluatee'
    })
    .when("/evaluator/idp/:itemId", {
      templateUrl: "partials/evaluator/evo_idp.html",
      controller: 'evaluator',
      title: 'Evaluatee'
    })
    .when("/evaluatee/:itemId", {
      templateUrl: "partials/evaluatee/index.html",
      controller: 'evaluatee',
      title: 'Evaluatee'
    })
    .when("/evaluatee/review/:itemId", {
      templateUrl: "partials/evaluatee/eve_period_review.html",
      controller: 'evaluatee',
      title: 'Evaluatee'
    })
    .when("/evaluatee/info/:itemId", {
      templateUrl: "partials/evaluatee/eve_info.html",
      controller: 'evaluatee',
      title: 'Evaluatee'
    })
    .when("/evaluatee/idp/:itemId", {
      templateUrl: "partials/evaluatee/eve_idp.html",
      controller: 'evaluatee',
      title: 'Evaluatee'
    })
    .when("/idp/:itemId", {
      templateUrl: "partials/evaluator/evo_idp.html",
      controller: 'evaluator',
      title: 'Evaluatee'
    });
  $locationProvider.hashPrefix('');
}]);
