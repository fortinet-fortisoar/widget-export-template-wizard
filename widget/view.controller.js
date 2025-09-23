/* Copyright start
    MIT License
    Copyright (c) 2025 Fortinet Inc
Copyright end */
'use strict';
(function () {
  angular
    .module('cybersponse')
    .controller('exportTemplateWizard100Ctrl', exportTemplateWizard100Ctrl);

  exportTemplateWizard100Ctrl.$inject = ['$scope', 'widgetUtilityService', '$uibModal', '$http', 'API', 'toaster', '_'];

  function exportTemplateWizard100Ctrl($scope, widgetUtilityService, $uibModal, $http, API, toaster, _) {
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

    function _handleTranslations() {
      widgetUtilityService.checkTranslationMode($scope.$parent.model.type).then(function () {
        $scope.viewWidgetVars = {
          // Create your translating static string variables here
          VIEW_DEFAULT_SELECT_ITEM: widgetUtilityService.translate('exportTemplateWizard.VIEW_DEFAULT_SELECT_ITEM'),
          VIEW_EXPORT_BTN_LABEL: widgetUtilityService.translate('exportTemplateWizard.VIEW_EXPORT_BTN_LABEL')
        };
      });
    }

    function init() {
      $scope.exportTemplates = _.filter($scope.config.exportTemplates, function (template) {
        return _.includes($scope.config.selectedExportTemplates, template.name);
      });
      _handleTranslations();
    }

    init();
  }
})();
