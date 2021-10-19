(()=>{"use strict";var e=function(){function e(){}return e.refresh=function(e){e=e||document,this.resetProcessedItems(),this.removeExportedComplexControlValues(e),this.refreshComplexControls(e),this.resetProcessedItems()},e.resetProcessedItems=function(){this.ready=[]},e.removeExportedComplexControlValues=function(e){e.querySelectorAll(".complex-control-value-exported").forEach((function(e){return e.remove()}))},e.refreshComplexControls=function(e){var t=this;e.querySelectorAll(".complex-control").forEach((function(e){return t.refreshComplexControl(e)}))},e.refreshComplexControl=function(e){var t=this;if(e.querySelectorAll(".complex-control").forEach((function(e){return t.refreshComplexControl(e)})),-1===this.ready.indexOf(e)){var o=this.formatComplexControlJsonData(this.getComplexControlFields(e)),r=this.getComplexControlValueControl(e);r.value=JSON.stringify(o),this.exportComplexControlValue(r),this.ready.push(e)}},e.exportComplexControlValue=function(e){var t=this.getParentComplexControl(e);t&&this.getParentComplexControl(t)&&((e=e.cloneNode()).classList.remove("complex-control-value"),e.classList.add("complex-control-value-exported"),t.insertAdjacentElement("beforebegin",e))},e.getComplexControlFields=function(e){var t=this,o=[];return e.querySelectorAll("input,textarea,select").forEach((function(r){e===t.getParentComplexControl(r)&&!1===r.classList.contains("complex-control-value")&&o.push(r)})),o},e.getParentComplexControl=function(e){return this.getFirstParent(e,(function(e){return e.classList.contains("complex-control")}))},e.getComplexControlValueControl=function(e){for(var t=e.querySelectorAll(".complex-control-value"),o=0;o<t.length;o++)if(e===this.getParentComplexControl(t[o]))return t[o];return null},e.getFirstParent=function(e,t){var o=e.parentNode;return o&&"html"!==o.tagName.toLowerCase()?t(o)?o:this.getFirstParent(o,t):null},e.formatComplexControlJsonData=function(e){for(var t={},o=0,r=e;o<r.length;o++){var n=r[o];if(void 0!==n.dataset.name){var l=this.getFieldValue(n);if(void 0!==l){var a=n.dataset.name,s=!1;-1!==n.dataset.name.indexOf("[")&&(a=n.dataset.name.replace(/(\[.*\])/g,""),s=!0),void 0===t[a]&&s&&(t[a]=[]),s?t[a].push(l):t[a]=l}}}return t},e.getFieldValue=function(e){if("checkbox"===e.type||"radio"===e.type){if(!e.checked)return;return e.value}if("select-multiple"===e.type){var t=[];return function(e,t){for(var o=0,r=t.length,n=e.length;o<r;o++,n++)e[n]=t[o];return e}([],e.selectedOptions).map((function(e){return t.push(e.value)})),t}if(!e.classList.contains("complex-control-value"))return e.classList.contains("complex-control-value-exported")&&""!==e.value?JSON.parse(e.value):e.value},e.ready=[],e}();window.ComplexControl=e})();