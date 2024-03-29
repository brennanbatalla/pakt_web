'use strict';

(function () {


  angular.module('app')
    .component("toolbar", {
      templateUrl: 'components/toolbar/toolbar.html',
      controller: toolbarCtrl
    });

  /** @ngInject */
  function toolbarCtrl($mdDialog, $mdMedia, $scope, $state, APP_NAME, $mdSidenav, $rootScope) {
    var ctrl = this;

    var requiredSignInStatesMap = {
      profile: true,
      listings: true,
      listingEditPage: true,
      'profile.edit': true,
      messages: true
    };
    ctrl.appName = APP_NAME;
    ctrl.flags = {
      hideTitle: true,
      loggedIn: false,
      mediaXS: $mdMedia('xs')
    };

    ctrl.flags.hideTitle = $state.current.name === "main";


    ctrl.openSignInDialog = function (newSignIn, ev) {
      $mdDialog.show(
        {
          template: '<sign-up-form is-new="new"></sign-up-form>',
          controller: function (isNew, $scope) {
            $scope.new = isNew;
          },
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: true,
          locals: {
            isNew: newSignIn
          },
          fullscreen: $mdMedia('xs')
        }
      );
    };


    ctrl.toggleSideNav = function () {
      $mdSidenav('left').toggle();
    };

    $rootScope.$on('$stateChangeStart',
      function (event, toState, toParams, fromState, fromParams, options) {
        ctrl.flags.hideTitle = toState.name === "main";
      });

    $scope.$on('user-object-updated', function (event, args) {
      ctrl.flags.loggedIn = !!args.user;
      if (!ctrl.flags.loggedIn) {
        if (requiredSignInStatesMap[$state.current.name]) {
          $state.go("main");
        }
      }
      $scope.$apply();
    });

  }
})();
