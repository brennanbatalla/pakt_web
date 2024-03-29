'use strict';

(function () {


  angular.module('app')
    .component("searchResultsPage", {
      templateUrl: 'app/searchResultsPage/searchResultsPage.html',
      controller: searchResultsPageCtrl
    })
    .config(['$stateProvider', function ($stateProvider) {
      $stateProvider
        .state('results', {
          url: '/results?:keyword&&:address&&:lat&&:lng&&:start&&:end',
          template: '<search-results-page></search-results-page>',
          params: {
            searchParams: null
          }
        });
    }]);

  searchResultsPageCtrl.$injector = ['$stateParams', "$timeout", "$mdMedia", "$mdPanel", "ItemSvc","$scope"];

  function searchResultsPageCtrl($stateParams, $timeout, $mdMedia, $mdPanel, ItemSvc, $scope) {
    var ctrl = this;

    ctrl.flags = {
      screenSMoXS: false,
      showMap: false,
      whenPanelActive: false,
      whatPanelActive: false,
      wherePanelActive: false,
      loading: true
    };
    ctrl.items = [];
    ctrl.item = {
      "price": {
        "hour": 10,
        "day": 30,
        "week": 100
      },
      "id": "583021",
      "title": "Lawnmower",
      "location": "Forked River, NJ",
      "description": "This is a lawnmower.  It works perfectly fine and takes normal gas.",
      "created": "8461653454",
      "imageData": [
        {
          "image": "assets/images/lawnmower.jpg",
          "metaData": {
            "customMetadata": {
              "order": 1
            }
          }
        },
        {
          "image": "assets/images/firepit.jpg",
          "metaData": {
            "customMetadata": {
              "order": 0
            }
          }
        },
        {
          "image": "assets/images/surboard.jpeg",
          "metaData": {
            "customMetadata": {
              "order": 2
            }
          }
        },
        {
          "image": "assets/images/firepit.jpg",
          "metaData": {
            "customMetadata": {
              "order": 3
            }
          }
        }
      ],
      "ownerUid": "678987867564576879890-90897867564"
    };


    function bootstrap() {
      ctrl.search();
      ctrl.flags.screenSMoXS = $mdMedia('xs') || $mdMedia('sm');
    }

    ctrl.search = function() {
      ItemSvc.searchItems($stateParams.keyword, $stateParams.lat,  $stateParams.lng)
        .then(function(res){
          ctrl.flags.loading = false;
          ctrl.items = res.hits;
          ctrl.initMap();
          $scope.$apply();
        })
        .catch(function(error){
          console.log("ERROR", error);
          ctrl.flags.loading = false;

        })
    };

    ctrl.initMap = function () {
      ctrl.map = new google.maps.Map(document.getElementById('searchMap'), {
        center: {lat: parseFloat($stateParams.lat), lng: parseFloat($stateParams.lng)},
        zoom: 13,
        disableDefaultUI: false,
        scrollwheel: false
      });

      ctrl.items.forEach(function(item){
        console.log(item);

        new google.maps.Circle({
          strokeColor: '#FF0000',
          //strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          //fillOpacity: 0.35,
          map: ctrl.map,
          center: {lat: item.location.lat, lng: item.location.lng},
          radius: 150
        });
      });

    };

    ctrl.resizeMap = function () {
      google.maps.event.trigger(ctrl.map, 'resize');
      console.log("resize map");
      // map.setCenter(currCenter);
    };

    ctrl.openWhatPanel = function (ev) {
      ctrl.flags.whatPanelActive = true;

      var whatMdPanel = $mdPanel;

      var position = whatMdPanel
        .newPanelPosition()
        .relativeTo(ev.target)
        .addPanelPosition('align-start', 'below')

      var config = {
        attachTo: angular.element(document.body),
        controller: whatPanelCtrl,
        controllerAs: "ctrl",
        disableParentScroll: this.disableParentScroll,
        templateUrl: '/components/panelTemplates/searchResultsWhatPanel.html',
        hasBackdrop: false,
        position: position,
        locals: {
          panel: whatMdPanel,
          close: function (searchWord) {
            ctrl.searchParams.what = searchWord;
            ctrl.flags.whatPanelActive = false;
          }
        },
        onDomRemoved: function () {
          ctrl.flags.whatPanelActive = false;
        },
        trapFocus: true,
        zIndex: 150,
        clickOutsideToClose: true,
        escapeToClose: true,
        focusOnOpen: true
      };

      whatMdPanel.open(config);

    };

    ctrl.openWhenPanel = function (ev) {
      ctrl.flags.whenPanelActive = true;

      var whenMdPanel = $mdPanel;

      var position = whenMdPanel
        .newPanelPosition()
        .relativeTo(ev.target)
        .addPanelPosition('align-start', 'below')

      var config = {
        attachTo: angular.element(document.body),
        controller: whenPanelCtrl,
        controllerAs: "ctrl",
        disableParentScroll: this.disableParentScroll,
        templateUrl: '/components/panelTemplates/searchResultsWhenPanel.html',
        hasBackdrop: false,
        position: position,
        locals: {
          panel: whenMdPanel,
          close: function (start, end) {
            ctrl.searchParams.startDate = start;
            ctrl.searchParams.endDate = end;
            ctrl.flags.whenPanelActive = false;
          }
        },
        onDomRemoved: function () {
          ctrl.flags.whenPanelActive = false;
        },
        trapFocus: true,
        zIndex: 100,
        clickOutsideToClose: true,
        escapeToClose: true,
        focusOnOpen: true
      };

      whenMdPanel.open(config)
        .then(function (mdPanelRef) {

        });
    };

    ctrl.openWherePanel = function (ev) {
      ctrl.flags.wherePanelActive = true;

      var whenMdPanel = $mdPanel;

      var position = whenMdPanel
        .newPanelPosition()
        .relativeTo(ev.target)
        .addPanelPosition('align-start', 'below')

      var config = {
        attachTo: angular.element(document.body),
        controller: wherePanelCtrl,
        controllerAs: "ctrl",
        disableParentScroll: this.disableParentScroll,
        templateUrl: '/components/panelTemplates/searchResultsWherePanel.html',
        hasBackdrop: false,
        position: position,
        locals: {
          panel: whenMdPanel,
          close: function (address) {
            ctrl.searchParams.where = address;
          }
        },
        onDomRemoved: function () {
          ctrl.flags.wherePanelActive = false;
        },
        trapFocus: true,
        zIndex: 100,
        clickOutsideToClose: true,
        escapeToClose: true,
        focusOnOpen: true
      };

      whenMdPanel.open(config)
        .then(function (mdPanelRef) {

        });
    };

    ctrl.newSearch = function () {
      console.log("New Search", ctrl.searchParams);
    };

    function whatPanelCtrl(mdPanelRef, close, $scope) {

      $scope.searchWord = "";
      $scope.closePanel = function () {
        close($scope.searchWord);
        mdPanelRef.hide();
      }
    }

    function wherePanelCtrl(mdPanelRef, close, $scope) {

      $scope.address = "";
      $scope.closePanel = function () {
        close($scope.address);
        mdPanelRef.hide();
      }
    }

    function whenPanelCtrl(mdPanelRef, close, $scope) {

      $scope.minDate = new Date();
      $scope.startDate = new Date();
      $scope.endDate;

      $scope.closePanel = function () {
        close($scope.startDate, $scope.endDate);
        mdPanelRef.hide($scope.startDate, $scope.endDate);
      }
    }


    // End of controller
    $timeout(function () {
      bootstrap();
    }, 1)
  }


})();
