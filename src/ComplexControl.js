var ComplexControl = (function () {
    function ComplexControl() {
    }
    ComplexControl.refresh = function (scopeElement) {
        scopeElement = scopeElement || document;
        this.resetProcessedItems();
        this.removeExportedComplexControlValues(scopeElement);
        this.refreshComplexControls(scopeElement);
        this.resetProcessedItems();
    };
    ComplexControl.resetProcessedItems = function () {
        this.ready = [];
    };
    ComplexControl.removeExportedComplexControlValues = function (scopedElement) {
        scopedElement.querySelectorAll('.complex-control-value-exported').forEach(function (x) { return x.remove(); });
    };
    ComplexControl.refreshComplexControls = function (scopedElement) {
        var _this = this;
        scopedElement.querySelectorAll('.complex-control').forEach(function (cc) { return _this.refreshComplexControl(cc); });
    };
    ComplexControl.refreshComplexControl = function (cc) {
        var _this = this;
        cc.querySelectorAll('.complex-control').forEach(function (_cc) { return _this.refreshComplexControl(_cc); });
        if (this.ready.indexOf(cc) !== -1) {
            return;
        }
        var data = this.formatComplexControlJsonData(this.getComplexControlFields(cc));
        var input = this.getComplexControlValueControl(cc);
        input.value = JSON.stringify(data);
        this.exportComplexControlValue(input);
        this.ready.push(cc);
    };
    ComplexControl.exportComplexControlValue = function (valueInput) {
        var parentComplexControl = this.getParentComplexControl(valueInput);
        if (parentComplexControl && this.getParentComplexControl(parentComplexControl)) {
            valueInput = valueInput.cloneNode();
            valueInput.classList.remove('complex-control-value');
            valueInput.classList.add('complex-control-value-exported');
            parentComplexControl.insertAdjacentElement('beforebegin', valueInput);
        }
    };
    ComplexControl.getComplexControlFields = function (cc) {
        var _this = this;
        var fields = [];
        cc.querySelectorAll('input,textarea,select').forEach(function (child) {
            if (cc === _this.getParentComplexControl(child) && child.classList.contains('complex-control-value') === false) {
                fields.push(child);
            }
        });
        return fields;
    };
    ComplexControl.getParentComplexControl = function (element) {
        return this.getFirstParent(element, function (parent) { return parent.classList.contains('complex-control'); });
    };
    ComplexControl.getComplexControlValueControl = function (cc) {
        var list = cc.querySelectorAll('.complex-control-value');
        for (var i = 0; i < list.length; i++) {
            if (cc === this.getParentComplexControl(list[i])) {
                return list[i];
            }
        }
        return null;
    };
    ComplexControl.getFirstParent = function (element, discriminatorCallback) {
        var parent = element.parentNode;
        if (parent && parent.tagName.toLowerCase() !== 'html') {
            if (discriminatorCallback(parent)) {
                return parent;
            }
            return this.getFirstParent(parent, discriminatorCallback);
        }
        return null;
    };
    ComplexControl.formatComplexControlJsonData = function (fields) {
        var data = {};
        for (var _i = 0; _i < fields.length; _i++) {
            var field = fields[_i];
            if (field.dataset.name === undefined)
                continue;
            var fieldValue = this.getFieldValue(field);
            if (fieldValue === undefined)
                continue;
            if (data[field.dataset.name] === undefined) {
                data[field.dataset.name] = fieldValue;
            }
            else {
                if (Array.isArray(data[field.dataset.name]) === false) {
                    var previous = data[field.dataset.name];
                    data[field.dataset.name] = [];
                    data[field.dataset.name].push(previous);
                }
                data[field.dataset.name].push(fieldValue);
            }
        }
        return data;
    };
    ComplexControl.getFieldValue = function (field) {
        if (field.type === 'checkbox' || field.type === 'radio') {
            if (!field.checked) {
                return undefined;
            }
            return field.value;
        }
        if (field.classList.contains('complex-control-value')) {
            return undefined;
        }
        if (field.classList.contains('complex-control-value-exported')) {
            if (field.value !== "") {
                return JSON.parse(field.value);
            }
        }
        return field.value;
    };
    ComplexControl.ready = [];
    return ComplexControl;
})();
