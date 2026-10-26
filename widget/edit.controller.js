/* Copyright start
    MIT License
    Copyright (c) 2026 Fortinet Inc
Copyright end */
'use strict';
(function () {
  angular
    .module('cybersponse')
    .controller('editExportTemplateWizard110Ctrl', editExportTemplateWizard110Ctrl);

  editExportTemplateWizard110Ctrl.$inject = ['$scope', '$uibModalInstance', 'config', 'Entity'];

  function editExportTemplateWizard110Ctrl($scope, $uibModalInstance, config, Entity) {
    $scope.cancel = cancel;
    $scope.save = save;
    $scope.config = config;

    function loadAttributes() {
      $scope.fields = [];
      $scope.fieldsArray = [];
      $scope.pickListFields = [];
      $scope.config.module = "export_templates"
      var entity = new Entity($scope.config.module);
      entity.loadFields().then(function () {
        for (var key in entity.fields) {
          if (entity.fields[key].type === "picklist") {
            $scope.pickListFields.push(entity.fields[key]);
          }
        }
        $scope.fields = entity.getFormFields();
        angular.extend($scope.fields, entity.getRelationshipFields());
        $scope.fieldsArray = entity.getFormFieldsArray();
      });
    }

    function init() {
      loadAttributes();
    }

    init();

    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }

    function save() {
      if ($scope.exportTemplateWizardForm.$invalid) {
        $scope.exportTemplateWizardForm.$setTouched();
        $scope.exportTemplateWizardForm.$focusOnFirstError();
        return;
      }
      $uibModalInstance.close($scope.config);
    }

  }
})();
