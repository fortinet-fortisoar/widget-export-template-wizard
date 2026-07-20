/* Copyright start
    MIT License
    Copyright (c) 2026 Fortinet Inc
Copyright end */
'use strict';
(function () {
  angular
    .module('cybersponse')
    .controller('exportTemplateWizard110Ctrl', exportTemplateWizard110Ctrl);

  exportTemplateWizard110Ctrl.$inject = ['$scope', '$uibModal', '$http', 'API', 'toaster', '_'];

  function exportTemplateWizard110Ctrl($scope, $uibModal, $http, API, toaster, _) {
    $scope.openWizard = openWizard;
    $scope.changeTemplate = changeTemplate;
    $scope.selectedTemplate = null;
    $scope.isTemplateSelected = false;

    function openWizard() {
      var queryPayload =
      {
        "sort": [
          {
            "field": "modifyDate",
            "direction": "DESC"
          }
        ],
        "limit": 30,
        "logic": "AND",
        "filters": [
          {
            "field": "name",
            "operator": "eq",
            "_operator": "eq",
            "value": $scope.selectedTemplate.name,
            "type": "primitive"
          }
        ],
        "__selectFields": [
          "name"
        ]
      };
      var queryUrl = API.QUERY + 'export_templates?$limit=30';
      $http.post(queryUrl, queryPayload).then(function (response) {
        if (response.data['hydra:member'] && response.data['hydra:member'].length > 0) {
          let templateUuid = $scope.selectedTemplate.uuid;
          let skipToReview = false;
          var modal = $uibModal.open({
            animation: false,
            component: 'exportWizardComponent',
            backdrop: 'static',
            windowClass: 'modal-ingestion',
            scope: $scope,
            resolve: {
              templateUuid: function () {
                return templateUuid;
              },
              skipToReview: function () {
                return skipToReview;
              }
            }
          });
          modal.result.finally(function () {
            $scope.$broadcast('csGrid:refresh');
          });
        }
        else {
          toaster.error({
            body: 'The export template "' + $scope.selectedTemplate.name + '" does not exist.'
          });
        }
        $scope.isTemplateSelected = false;
        $scope.selectedTemplate = null;
      });
    }

    function changeTemplate() {
      $scope.isTemplateSelected = true;
    }

    function getExportTemplate() {
      var queryPayload = $scope.config.query;
      var queryUrl = API.QUERY + 'export_templates?$limit=30';
      $http.post(queryUrl, queryPayload).then(function (response) {
        if (response.data['hydra:member'] && response.data['hydra:member'].length > 0) {
          $scope.exportTemplates = response.data['hydra:member'];
        }
      });
    }

    function init() {
      getExportTemplate();
    }

    init();
  }
})();
