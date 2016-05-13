(function() {
    'use strict';

    var app = angular.module('app', [
            'ui.router',
            'ngAnimate',

            //foundation
            'foundation',
            'foundation.dynamicRouting',
            'foundation.dynamicRouting.animations',
            'toolbox',
            'tool.dropbox',
            'tool.slack',
            'tool.trello',
            'tool.google-drive'
        ])
        .config(config)
        .run(run);

    config.$inject = ['$urlRouterProvider', '$locationProvider', '$logProvider'];

    function config($urlProvider, $locationProvider, $logProvider) {

        $logProvider.debugEnabled(false);

        $urlProvider.otherwise('/');

        $locationProvider.html5Mode({
            enabled: false,
            requireBase: false
        });

        $locationProvider.hashPrefix('!');


    }

    function run() {
        FastClick.attach(document.body);
    }


    app.directive('contenteditable', function() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, ngModel) {

                function read() {
                    if (attrs.placeholder !== element.text()) {
                        ngModel.$setViewValue(element.text());
                    }
                }

                ngModel.$render = function() {
                    element.text(attrs.placeholder || ngModel.$viewValue);
                };

                ngModel.$parsers.unshift(function(value) {
                    ngModel.$setValidity('require', value !== '');

                    return value;
                });

                element.bind('blur keyup change', function() {
                    scope.$apply(read);
                });

                element.bind('click', function() {
                    if (element.text() === attrs.placeholder) {
                        element.html('');
                    }
                });
            }
        };
    });

    app.directive('autoFocus', ['$timeout', function($timeout) {
        return {
            restrict: 'AC',
            link: function(_scope, _element) {
                $timeout(function() {
                    _element[0].focus();
                }, 0);
            }
        };
    }]);

})();
