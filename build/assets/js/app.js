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

pms.controller('mainCtrl', ['$http', '$scope', '$routeParams', '$location', '$filter', function($http, $scope, $routeParams, $location, $filter) {
  // Define scope variable -------------------------------

  $scope.eveId = $routeParams.itemId;
  $scope.total_score = 0;
  $scope.ranking = '';
  $scope.talent_index = 0;
  $scope.overall_achievement = 0;
  $scope.overall_idp = 0;
  $scope.added_priority = 'Medium';
  $scope.added_idp_eta = today;
  $scope.active_obj = 0;
  $scope.end_date = '11/30/2018';
  $scope.start_date = '06/01/2018';
  $scope.duration = 6;
  $scope.idpId = 0;
  $scope.selected_ref_obj = "Quality Delivery/Customer Satisfaction";


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
    $scope.ref_objs = Array.from($scope.objs);

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

  // get ref sub_objs
    $http.get(url + 'Sub-Objectives_ref.json').then(function(data){
        $scope.ref_sub_objs = data.data;
    },function(err){
      console.log(err);
    })
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

pms.controller('evaluator', ['$http', '$scope', '$routeParams', '$location', '$filter', function($http, $scope, $routeParams, $location, $filter) {

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
        labels: ["S2-2015", "S1-2016", "S2-2016", "S1-2017", "S2-2017", "S1-2018"],
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

    $scope.talent = $scope.users.find(function(users) {
      return users.full_name == index;
    }, 'users.index');

    var target = '#' + id;
    $(target).toggle();
    render_chart();
  }

  // calculate DAte
  $scope.period_change = function(period) {

    switch (period) {
      case 'S2-2018':
        $scope.end_date = '11/30/2018';
        $scope.start_date = '06/01/2018';
        break;
      case 'Q3-2018':
        $scope.end_date = '09/30/2018';
        $scope.start_date = '07/01/2018';
        break;
      case 'Q4-2018':
        $scope.end_date = '12/31/2018';
        $scope.start_date = '10/01/2018';
        break;
      case 'Y-2018':
        $scope.end_date = '12/31/2018';
        $scope.start_date = '01/01/2018';
        break;
      default:
        $scope.end_date = '11/30/2018';
        $scope.start_date = '06/01/2018';
    }
    $scope.duration = (new Date($scope.end_date)).getMonth() - (new Date($scope.start_date)).getMonth() + 1;
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
    $scope.idpId = index;
    console.log($scope.idpId);
    $scope.editing_idp = $scope.idps[index];
    $scope.editing_idp.eta = new Date($scope.editing_idp.eta);

  }

  $scope.save_edit_idp = function(index) {
    if ($scope.editing_idp.progress == 0) {
      $scope.editing_idp.status = 'Not started';
    } else if ($scope.editing_idp.progress == 100) {
      $scope.editing_idp.status = 'Completed';
    } else {
      $scope.editing_idp.status = 'In progress';
    }
    $scope.editing_idp.eta = ('0' + ($scope.editing_idp.eta.getMonth() + 1)).slice(-2) + '/' + ('0' + ($scope.editing_idp.eta.getDate() + 1)).slice(-2) + '/' + $scope.editing_idp.eta.getFullYear();
    $scope.idps[index] = $scope.editing_idp;

    $scope.show_team('#modal_edit');
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

  // Delete objs
  $scope.delete_obj = function(index) {
    $scope.objs.splice(index, 1);
  }

  $scope.delete_sub_obj = function(index) {
    $scope.sub_objs.splice(index, 1);
  }

  $scope.set_active = function(id) {
    $('#edit_from_ref').css('display','block');
    $scope.active_obj = id.substr(-1, 2);
    $(id).addClass('active');
    if (id.substr(0, 4) != '#obj') {
      $scope.selected_comment = $('#comment' + id.substr(-2)).html();
      $scope.selected_rate = $scope.sub_objs[id.substr(-1, 1)].rate1;
    }
  }

  $scope.add_obj_from_ref = function(index) {

    if (index == null) {
      $('#edit_from_ref').css('display','none');
      $('#edit_blank').css('display','block');
    } else {
      $('#edit_from_ref').css('display','block');
      $('#edit_blank').css('display','none');
    }
    $scope.objs[index.id - 1].level = 'Senior';
    var ss = [];
    ss = $filter('filter')($scope.ref_sub_objs, $scope.objs[index.id - 1].objective);

    ss.forEach(function(value, index) {

      if ($scope.sub_objs.find(function(element){
        return element != value
      })) {
        $scope.sub_objs.push(value);
      }

    });
  }

    $scope.add_sub_obj_from_ref = function(index) {
      console.log(index);
      $scope.sub_objs.push(index);
    }

    $scope.new_blank_sub_obj = function(){
      $('#blank_task_list').append('<div class="task-list-item d-flex align-items-center"><div class="task-list-item-inputs bg-pale-grey"><div class="form-group "><label for="sub1">Sub-objective</label> <textarea class="form-control" id="sub1 " rows="5"></textarea> </div><div class="form-group"> <label for="weight">Weight (%)</label> <input type="number" id="weight" class="form-control number-only"> </div><div class="form-group active "> <label for="eta ">ETA</label><input class="input-date " type="date " value="" /> </div></div><div class="task-list-item-operates"><a href="javascript:void(0) " class="action action-remove not_a " ng-click="delete_sub_obj($index) "><span class="icon-close "></span></a> </div></div>');
    }

}]);

pms.controller('evaluatee', ['$http', '$scope', '$routeParams', '$location', function($http, $scope, $routeParams, $location) {
  $scope.eve_score = $scope.total_score;
  $scope.eve_ranking = $scope.ranking;
  $scope.eveId = $routeParams.itemId;
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

  $scope.set_active = function(id) {
    $scope.active_obj = id.substr(-1, 2);
    $(id).addClass('active');
    if (id.substr(0, 4) != '#obj') {
      $scope.selected_comment = $('#comment' + id.substr(-2)).html();
      $scope.selected_rate = $scope.sub_objs[id.substr(-1, 1)].rate1;
    }
  }

}]);

pms.controller('dashboard',['$http','$scope',function($http,$scope){
  var ctx = document.getElementById('myChart').getContext('2d');
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
      labels: ["S2-2015", "S1-2016", "S2-2016", "S1-2017", "S2-2017", "S1-2018"],
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
      templateUrl: "partials/evaluator/evo_detail_full.html",
      controller: 'evaluator',
      title: 'Evaluatee'
    })
    .when("/evaluator/review/:itemId", {
      templateUrl: "partials/evaluator/evo_period_review_full.html",
      controller: 'evaluator',
      title: 'Evaluatee'
    })
    .when("/evaluator/compose/:itemId", {
      templateUrl: "partials/evaluator/evo_compose_full.html",
      controller: 'evaluator',
      title: 'Evaluatee'
    })
    .when("/evaluator/idp/:itemId", {
      templateUrl: "partials/evaluator/evo_idp.html",
      controller: 'evaluator',
      title: 'Evaluatee'
    })
    .when("/evaluator/dashboard", {
      templateUrl: "partials/evaluator/evo_dashboard.html",
      controller: 'dashboard',
      title: 'Evaluatee'
    })
    .when("/evaluatee/:itemId", {
      templateUrl: "partials/evaluatee/index.html",
      controller: 'evaluatee',
      title: 'Evaluatee'
    })
    .when("/evaluatee/detail/:itemId", {
      templateUrl: "partials/evaluatee/eve_detail.html",
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
