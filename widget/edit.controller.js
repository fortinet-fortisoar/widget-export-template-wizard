/* Copyright start
    MIT License
    Copyright (c) 2025 Fortinet Inc
Copyright end */
'use strict';
(function () {
  angular
    .module('cybersponse')
    .controller('editExportTemplateWizard100Ctrl', editExportTemplateWizard100Ctrl);

  editExportTemplateWizard100Ctrl.$inject = ['$scope', '$uibModalInstance', 'config', 'widgetUtilityService', '$timeout', '$http', 'API'];

  function editExportTemplateWizard100Ctrl($scope, $uibModalInstance, config, widgetUtilityService, $timeout, $http, API) {
    $scope.cancel = cancel;
    $scope.save = save;
    $scope.config = config;

    function _handleTranslations() {
      let widgetNameVersion = widgetUtilityService.getWidgetNameVersion($scope.$resolve.widget, $scope.$resolve.widgetBasePath);
      if (widgetNameVersion) {
        widgetUtilityService.checkTranslationMode(widgetNameVersion).then(function () {
          $scope.viewWidgetVars = {
            // Create your translating static string variables here
            EDIT_VIEW_SELECT_DESCRIPTION: widgetUtilityService.translate('exportTemplateWizard.EDIT_VIEW_SELECT_DESCRIPTION'),
            EDIT_VIEW_DEFAULT_SELECT_ITEM: widgetUtilityService.translate('exportTemplateWizard.EDIT_VIEW_DEFAULT_SELECT_ITEM'),
            EDIT_VIEW_SAVE_BTN_LABEL: widgetUtilityService.translate('exportTemplateWizard.EDIT_VIEW_SAVE_BTN_LABEL'),
            EDIT_VIEW_CLOSE_BTN_LABEL: widgetUtilityService.translate('exportTemplateWizard.EDIT_VIEW_CLOSE_BTN_LABEL')
          };
        });
      } else {
        $timeout(function () {
          $scope.cancel();
        });
      }
    }

    function getExportTemplate() {
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
            "field": "type",
            "operator": "neq",
            "_operator": "neq",
            "value": "SolutionPack Export",
            "type": "primitive"
          }
        ],
        "__selectFields": [
          "name",
          "lastExportDate",
          "modifyUser",
          "portingActions",
          "@id",
          "@type",
          "id"
        ]
      };
      var queryUrl = API.QUERY + 'export_templates?$limit=30';
      $http.post(queryUrl, queryPayload).then(function (response) {
        if (response.data['hydra:member'] && response.data['hydra:member'].length > 0) {
          $scope.config.exportTemplates = response.data['hydra:member'];
          $scope.templateNames = $scope.config.exportTemplates.map(function (template) {
            return template.name;
          });
        }
      });
    }

    function init() {
      getExportTemplate();
      _handleTranslations();
    }

    init();

    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }

    function save() {
      $uibModalInstance.close($scope.config);
    }

  }
})();
