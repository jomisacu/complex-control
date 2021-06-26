class ComplexControl {
    private static ready = [];

    public static refresh() {
        this.resetProcessedItems();
        this.removeExportedComplexControlValues();
        this.refreshComplexControls();
        this.resetProcessedItems();
    }

    private static resetProcessedItems() {
        this.ready = [];
    }

    private static removeExportedComplexControlValues() {
        document.querySelectorAll('.complex-control-value-exported').forEach(x => x.remove());
    }

    private static refreshComplexControls() {
        document.querySelectorAll('.complex-control').forEach(cc => this.refreshComplexControl(cc));
    }

    private static refreshComplexControl(cc) {
        cc.querySelectorAll('.complex-control').forEach(_cc => this.refreshComplexControl(_cc));

        if (this.ready.indexOf(cc) !== -1) {
            return;
        }

        let data = this.formatComplexControlJsonData(
            this.getComplexControlFields(cc)
        );

        let input = this.getComplexControlValueControl(cc);

        input.value = JSON.stringify(data);
        this.exportComplexControlValue(input);

        this.ready.push(cc);
    }

    private static exportComplexControlValue(valueInput) {
        let parentComplexControl = this.getParentComplexControl(valueInput);

        if (parentComplexControl && this.getParentComplexControl(parentComplexControl)) {
            valueInput = valueInput.cloneNode();
            valueInput.classList.remove('complex-control-value');
            valueInput.classList.add('complex-control-value-exported');

            parentComplexControl.insertAdjacentElement('beforebegin', valueInput);
        }
    }

    private static getComplexControlFields(cc) {
        let fields = [];

        cc.querySelectorAll('input,textarea,select').forEach(child => {
            if (cc === this.getParentComplexControl(child) && child.classList.contains('complex-control-value') === false) {
                fields.push(child);
            }
        });

        return fields;
    }

    private static getParentComplexControl(element) {
        return this.getFirstParent(element, (parent) => parent.classList.contains('complex-control'))
    }

    private static getComplexControlValueControl(cc) {
        let list = cc.querySelectorAll('.complex-control-value');

        for (let i = 0; i < list.length; i++) {
            if (cc === this.getParentComplexControl(list[i])) {
                return list[i];
            }
        }

        return null;
    }

    private static getFirstParent(element, discriminatorCallback) {
        let parent = element.parentNode;

        if (parent && parent.tagName.toLowerCase() !== 'html') {
            if (discriminatorCallback(parent)) {
                return parent;
            }

            return this.getFirstParent(parent, discriminatorCallback);
        }

        return null;
    }

    private static formatComplexControlJsonData(fields) {
        let data = {};

        for (let field of fields) {
            if (field.dataset.name === undefined) continue;

            let fieldValue = this.getFieldValue(field);

            if (fieldValue === undefined) continue;

            if (data[field.dataset.name] === undefined) {
                data[field.dataset.name] = fieldValue;
            } else {
                if (Array.isArray(data[field.dataset.name]) === false) {
                    let previous = data[field.dataset.name];

                    data[field.dataset.name] = [];
                    data[field.dataset.name].push(previous);
                }

                data[field.dataset.name].push(fieldValue);
            }
        }

        return data;
    }

    private static getFieldValue(field) {
        if (field.type === 'textarea') {
            return field.innerText;
        }

        if (field.type === 'select') {
            return field[field.selectedIndex];
        }

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
    }
}

