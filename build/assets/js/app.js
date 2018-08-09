// var url = '../build/assets/data/';
var url = '../assets/data/';

var pms = angular.module('pms', [

])

pms.controller('mainCtrl', ['$http', '$scope', function($http, $scope) {

  // Init value

  $scope.selected_period = "No period";
  $scope.total_score = 0;
  $scope.ranking = '';

  //Call data
  $http.get(url + 'gl.json').then(function(data) {
    $scope.users = data.data;
    $scope.overall_achievement = 0;
    $scope.overall_idp = 0;
    var overall = 0;
    var overall_idp=0;
    $scope.users.forEach(function(user) {
        overall= overall + user.achievement;
        overall = (overall/$scope.users.length);

        overall_idp= overall_idp + user.idp;
        overall_idp = (overall_idp/$scope.users.length);

        $scope.overall_achievement = overall.toFixed(0);
        $scope.overall_idp = overall_idp.toFixed(0);
      }
    )
  }, function(err) {

  });

  $http.get(url + 'Objectives.json').then(function(data) {
    $scope.objs = data.data;
    $scope.ref_objs = $scope.objs.slice(0, );
  }, function(err) {
    console.log(err);
  });

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
  $scope.selected = 0;
  $scope.selected_sub = 0;

  $scope.select = function(index) {
    $scope.selected = index;
  };

  $scope.select_sub = function(index, parent) {
    $scope.selected_sub = index;
    var parent_ele = '#' + parent;
    $(parent_ele).addClass('active');
  };

  $scope.delete_obj = function(index) {
    $scope.objs.shift(index);
  }

  $scope.delete_sub_obj = function(index) {
    $scope.sub_objs.shift(index);
  }

  $scope.add_obj = function(index, obj) {
    $scope.objs.push(index, obj);

  }

  $scope.add_period = function() {
    $('#new_period').css('display', '');
    $('#create_new_period').modal('hide');
  }

  // idp
  $http.get(url + 'idp.json').then(function(data) {
    $scope.idps = data.data;

  }, function(err) {
    console.log(err);
  })
  var idp_edit_index;

  $scope.open_edit_modal = function(index) {
    edit_modal.style.display = "block";
    var eta = new Date($scope.idps[index].eta);
    idp_edit_index = index;
    eta = eta.getFullYear() + '-' + ("0" + (eta.getMonth() + 1)).slice(-2) + '-' + eta.getDate();

    $scope.edit_idp = {
      "competency": $scope.idps[index].competency,
      "objective": $scope.idps[index].objective,
      "priority": $scope.idps[index].priority,
      "eta": eta,
      "progress": $scope.idps[index].progress,
      "status": $scope.idps[index].status,
      "comment": $scope.idps[index].comment,
    }
  }

  $scope.add_idp = function() {
    $scope.idps.push({
      "competency": $scope.new_competency,
      "objective": $scope.new_objective,
      "priority": $scope.new_priority,
      "eta": $scope.new_eta.getDate() + '/' + ("0" + ($scope.new_eta.getMonth() + 1)).slice(-2) + '/' + $scope.new_eta.getFullYear(),
      "progress": 0,
      "status": 'Not started'
    });

    $('#modal_add').css('display', 'none');
  }

  $scope.save_idp = function() {
    $scope.idps[idp_edit_index].eta = $scope.edit_idp.eta;
    $scope.idps[idp_edit_index].progress = $scope.edit_idp.progress;
    $scope.idps[idp_edit_index].comment = $scope.edit_idp.comment;

    switch ($scope.edit_idp.progress) {
      case 0:
        $scope.edit_idp.status = 'Not started';
        break;
      case 100:
        $scope.edit_idp.status = 'Completed';
        break;
      default:
        $scope.edit_idp.status = 'In progress';
    }
    console.log($scope.edit_idp.status);
    $scope.idps[idp_edit_index].status = $scope.edit_idp.status;

    $('#modal_edit').css('display', 'none');
  }

  $scope.delete_idp = function() {
    delete $scope.idps[idp_edit_index];
    $scope.idps.sort();
    $scope.idps.pop();
    $('#modal_edit').css('display', 'none');
  }

  $scope.show_team = function() {
    $('#team_bar').toggle();
  }



}])
