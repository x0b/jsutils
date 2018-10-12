/**
 * Pack the values of all contained children's form input elments into an object.
 * Function will scan the children for any valid element (meaning, id needs a name).
 * @param form
 */
function formData(form) {
    var formTarget = null;
    if (form instanceof Element) {
        formTarget = form;
    } else {
        formTarget = document.querySelector(form);
    }

    var elements = formTarget.getElementsByTagName('input')
    //var textareas = Array.prototype.slice.call(formTarget.getElementsByTagName('textarea'));
    //elements.push.apply(elements, textareas);

    var data = {};
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        if (!element.hasAttribute('name')) {
            continue;
        }
        // serialize as string
        if (element.type === 'text'
            || element.type === 'hidden'
            || element.type === 'password'
            || (element.type === 'checkbox' && element.value)) {
            data[element.getAttribute('name')] = element.value;
        } else if (element.type === 'checkbox') {
            data[element.getAttribute('name')] = !!element.checked;
        } else if (element.type === 'radio' && element.checked) {
            data[element.getAttribute('name')] = !!element.checked;
        }
    }

    var textareas = formTarget.getElementsByTagName('textarea');
    for (var i = 0; i < textareas.length; i++) {
        var textarea = textareas[i];
        if (!textarea.hasAttribute('name')) {
            continue;
        }
        data[textarea.getAttribute('name')] = textarea.value;
    }

    // selects are either flattened or packed as arrays (for multiple)
    var selects = form.getElementsByTagName('select');
    for (var i = 0; i < selects.length; i++) {
        var select = selects[i];
        if (!select.hasAttribute('name') || select.selectedIndex === -1) {
            continue;
        }
        if (select.hasAttribute('multiple')) {
            var selectValues = [];
            for (var j = 0; j < select.options.length; j++) {
                var option = select.options[j];
                if (option.selected) {
                    selectValues.push(option.value || option.text);
                }
            }
            data[select.getAttribute('name')] = selectValues;
        } else {
            var option = select.options[select.selectedIndex];
            data[select.getAttribute('name')] = option.value || option.text;
        }
    }

    //console.log(data);
    return data;
}

// convert if directed to, returns unchanged if not supported
function applyExtraTyping(value, element){
    if(!element.hasAttribute('data-type')){
        return;
    }
    var targetType = element.getAttribute('data-type');
    var actualType = typeof value;
    if(targetType === actualType){
        return;
    }
    if(actualType === 'string'){
        switch(targetType){
            case 'number':
                return +value;
            case 'boolean':
                return value === 'true' || value === '1' || false;
            case 'object':
                try {
                    return JSON.parse(value);
                } catch(e){
                    return new String(value);
                }
            case 'array':
                return value.split(',').map(Function.prototype.call, String.prototype.trim);
        }
    }
    return value;
}