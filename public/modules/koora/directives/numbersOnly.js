angular.module('koora').directive('numbersOnly', function(){
   return {
     require: 'ngModel',
     link: function(scope, element, attrs, modelCtrl) {
       modelCtrl.$parsers.push(function (inputValue) {
           // this next if is necessary for when using ng-required on your input. 
           // In such cases, when a letter is typed first, this parser will be called
           // again, and the 2nd time, the value will be undefined
           if (!inputValue) return;
           var transformedInput = inputValue.replace(/[^0-9]/g, ''); 

           if(transformedInput.toString().length>2){
            transformedInput = transformedInput.substring(0,2);
           }
           if(transformedInput.toString().length == 2 && transformedInput.toString()[0] === "0")
            transformedInput = transformedInput.substring(1);

           if (transformedInput!==inputValue) {
              modelCtrl.$setViewValue(transformedInput);
              modelCtrl.$render();
           }

           return parseInt(transformedInput || 0);         
       });
     }
   };
});