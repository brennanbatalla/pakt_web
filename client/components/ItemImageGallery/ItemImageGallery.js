'use strict';

(function () {


  angular.module('app')
    .component("itemImageGallery", {
      templateUrl: 'components/ItemImageGallery/ItemImageGallery.html',
      controller: itemImageGalleryCtrl,
      bindings: {
        imageData: "=",
        editMode: '<'
      }
    });

  itemImageGalleryCtrl.$inject = ["$timeout", "UtilsSvc", "$scope", "$mdDialog", "ItemSvc", "$mdMedia"];
  function itemImageGalleryCtrl($timeout, UtilsSvc, $scope, $mdDialog, ItemSvc, $mdMedia) {
    var ctrl = this;

    ctrl.imageIndex = 0;
    ctrl.activeImage = {};
    var imageLength;
    ctrl.sizeXS = $mdMedia('xs');

    // ___________ Functions below ____________
    function bootstrap() {
      imageLength = ctrl.imageData.length;
      ctrl.images = UtilsSvc.sortImages(ctrl.imageData);
      ctrl.activeImage.backgroundImage = "url(" + ctrl.images[ctrl.imageIndex] + ")";
    }

    ctrl.imagePopout = function(ev){
      console.log("POP out");
      $mdDialog.show(
        {
          controller: function(images, $scope){
            $scope.images = images;
            $scope.imageIndex = 0;
            $scope.activeImage = {};
            $scope.activeImage.backgroundImage = "url(" + images[$scope.imageIndex] + ")";
            $scope.nextImage = function (next) {
              if (next) {
                ($scope.imageIndex + 1 >= $scope.images.length) ? $scope.imageIndex = 0 : $scope.imageIndex++;
              } else {
                ($scope.imageIndex - 1 < 0) ? $scope.imageIndex = $scope.images.length - 1 : $scope.imageIndex--;
              }
              $scope.activeImage.backgroundImage = "url(" + $scope.images[$scope.imageIndex] + ")";

            };

          },
          templateUrl: 'components/ItemImageGallery/popoutImagesTemplate.html',
          parent: document.getElementById('itemPageGalleryImageContainer'),
         // targetEvent: ev,
          locals:{
            images: ctrl.images
          },
          clickOutsideToClose:true,
        }
      )
    };

    ctrl.nextImage = function (next) {
      if (ctrl.images.length !== ctrl.imageData.length) ctrl.images = UtilsSvc.sortImages(ctrl.imageData);

      if (next) {
        (ctrl.imageIndex + 1 >= ctrl.images.length) ? ctrl.imageIndex = 0 : ctrl.imageIndex++;
      } else {
        (ctrl.imageIndex - 1 < 0) ? ctrl.imageIndex = ctrl.images.length - 1 : ctrl.imageIndex--;
      }
      ctrl.activeImage.backgroundImage = "url(" + ctrl.images[ctrl.imageIndex] + ")";

    };

    ctrl.setMainImage = function () {
      if (ctrl.imageIndex === 0) return;
      ctrl.imageData[0].metaData.customMetadata.order = ctrl.imageIndex;
      ctrl.imageData[ctrl.imageIndex].metaData.customMetadata.order = 0;
      ctrl.images = UtilsSvc.sortImages(ctrl.imageData);
      ctrl.imageIndex = 0;
      ctrl.activeImage.backgroundImage = "url(" + ctrl.images[ctrl.imageIndex] + ")";
    };

    ctrl.deleteImage = function (ev) {
      $mdDialog.show(
        $mdDialog.confirm()
          .title('Are you sure you would like to delete this image?')
          .textContent('')
          .ariaLabel('Delete Image')
          .targetEvent(ev)
          .ok('Yes')
          .cancel('Nevermind')
      )
        .then(function () {
          // YES
          var delImageData;
          for (var i = 0; i < ctrl.imageData.length; i++) {

            if (ctrl.imageData[i].metaData.customMetadata.order == ctrl.imageIndex) {
              delImageData = angular.copy(ctrl.imageData[i]);
              ctrl.imageData[i] = null;
              ctrl.imageData.splice(i,1);
              console.log(ctrl.imageData)
            }
            if (ctrl.imageData[i] && ctrl.imageData[i].metaData.customMetadata.order >= ctrl.imageIndex) {
              ctrl.imageData[i].metaData.customMetadata.order = ctrl.imageData[i].metaData.customMetadata.order - 1;
            }
          }

          ctrl.images = UtilsSvc.sortImages(ctrl.imageData);

          if (ctrl.imageIndex === ctrl.imageData.length - 1){
            ctrl.imageIndex = ctrl.imageData.length - 2;
          }
          ctrl.activeImage.backgroundImage = "url(" + ctrl.images[ctrl.imageIndex] + ")";


          if(!delImageData.metaData.key) return;

          ItemSvc.deleteImage(delImageData, ctrl.imageData)
            .then(function(){
              console.log("Deleted Image");
            })
            .catch(function(error){
              console.log("Error deleting Image", error);
            });
        })
        .catch(function () {

        })
    };

    $scope.$watch(function (newValue, oldValue, scope) {
      if (imageLength && imageLength !== ctrl.imageData.length) {
        imageLength = ctrl.imageData.length;
        ctrl.imageIndex = ctrl.imageData.length - 1;
        //debugger;
        console.log("IMAGES",ctrl.imageData);

        ctrl.images = UtilsSvc.sortImages(ctrl.imageData);
        console.log("IMAGES",ctrl.images);

        ctrl.activeImage.backgroundImage = "url(" + ctrl.images[ctrl.imageIndex] + ")";

      }
    });

// End of Controller
    $timeout(function () {
      bootstrap()
    }, 1);
  }
})();
