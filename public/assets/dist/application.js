'use strict';
// Init the application configuration module for AngularJS application
var ApplicationConfiguration = function () {
    // Init module configuration options
    var applicationModuleName = 'mean';
    var applicationModuleVendorDependencies = [
        'ngResource',
        'ngAnimate',
        'ui.router',
        'ui.bootstrap',
        'ui.utils'
      ];
    // Add a new vertical module
    var registerModule = function (moduleName) {
      // Create angular module
      angular.module(moduleName, []);
      // Add the module to the AngularJS configuration file
      angular.module(applicationModuleName).requires.push(moduleName);
    };
    return {
      applicationModuleName: applicationModuleName,
      applicationModuleVendorDependencies: applicationModuleVendorDependencies,
      registerModule: registerModule
    };
  }();'use strict';
//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);
// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config([
  '$locationProvider',
  function ($locationProvider) {
    $locationProvider.hashPrefix('!');
  }
]);
//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash === '#_=_')
    window.location.hash = '#!';
  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('articles');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('koora');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');'use strict';
// Configuring the Articles module
angular.module('articles').run([
  'Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Articles', 'articles', 'dropdown', '/articles(/create)?');
    Menus.addSubMenuItem('topbar', 'articles', 'List Articles', 'articles');
    Menus.addSubMenuItem('topbar', 'articles', 'New Article', 'articles/create');
  }
]);'use strict';
// Setting up route
angular.module('articles').config([
  '$stateProvider',
  function ($stateProvider) {
    // Articles state routing
    $stateProvider.state('listArticles', {
      url: '/articles',
      templateUrl: 'modules/articles/views/list-articles.client.view.html'
    }).state('createArticle', {
      url: '/articles/create',
      templateUrl: 'modules/articles/views/create-article.client.view.html'
    }).state('viewArticle', {
      url: '/articles/:articleId',
      templateUrl: 'modules/articles/views/view-article.client.view.html'
    }).state('editArticle', {
      url: '/articles/:articleId/edit',
      templateUrl: 'modules/articles/views/edit-article.client.view.html'
    });
  }
]);'use strict';
angular.module('articles').controller('ArticlesController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'Articles',
  function ($scope, $stateParams, $location, Authentication, Articles) {
    $scope.authentication = Authentication;
    $scope.create = function () {
      var article = new Articles({
          title: this.title,
          content: this.content
        });
      article.$save(function (response) {
        $location.path('articles/' + response._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
      this.title = '';
      this.content = '';
    };
    $scope.remove = function (article) {
      if (article) {
        article.$remove();
        for (var i in $scope.articles) {
          if ($scope.articles[i] === article) {
            $scope.articles.splice(i, 1);
          }
        }
      } else {
        $scope.article.$remove(function () {
          $location.path('articles');
        });
      }
    };
    $scope.update = function () {
      var article = $scope.article;
      article.$update(function () {
        $location.path('articles/' + article._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    $scope.find = function () {
      $scope.articles = Articles.query();
    };
    $scope.findOne = function () {
      $scope.article = Articles.get({ articleId: $stateParams.articleId });
    };
  }
]);'use strict';
//Articles service used for communicating with the articles REST endpoints
angular.module('articles').factory('Articles', [
  '$resource',
  function ($resource) {
    return $resource('articles/:articleId', { articleId: '@_id' }, { update: { method: 'PUT' } });
  }
]);'use strict';
// Setting up route
angular.module('core').config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    // Redirect to home view when route not found
    $urlRouterProvider.otherwise('/');
    // Home state routing
    $stateProvider.state('home', {
      url: '/',
      templateUrl: 'modules/core/views/home.client.view.html'
    });
  }
]);'use strict';
angular.module('core').controller('HeaderController', [
  '$scope',
  '$location',
  'Authentication',
  'Menus',
  function ($scope, $location, Authentication, Menus) {
    $scope.authentication = Authentication;
    $scope.isCollapsed = false;
    $scope.menu = Menus.getMenu('topbar');
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };
    $scope.goTo = function (name) {
      // console.log($scope.selectedPage);
      if (name === 'auth/signout') {
        window.location.href = name;
      } else
        $location.path(name);
    };
    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });
  }
]);'use strict';
angular.module('core').controller('HomeController', [
  '$scope',
  '$interval',
  'Authentication',
  function ($scope, $interval, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    //http://stackoverflow.com/questions/9335140/how-to-countdown-to-a-date
    var worldCupStartDate = new Date('2014-06-12T16:00+0100');
    var _second = 1000;
    var _minute = _second * 60;
    var _hour = _minute * 60;
    var _day = _hour * 24;
    var timer;
    function showRemaining() {
      var now = new Date();
      var distance = worldCupStartDate - now;
      if (distance < 0) {
        $interval.cancel(timer);
        $scope.remaingTime = {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        };
        return;
      }
      var days = Math.floor(distance / _day);
      var hours = Math.floor(distance % _day / _hour);
      var minutes = Math.floor(distance % _hour / _minute);
      var seconds = Math.floor(distance % _minute / _second);
      $scope.remainingTime = {
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds
      };
    }
    timer = $interval(showRemaining, 1000);
  }
]);'use strict';
//Menu service used for managing  menus
angular.module('core').service('Menus', [function () {
    // Define a set of default roles
    this.defaultRoles = ['user'];
    // Define the menus object
    this.menus = {};
    // A private function for rendering decision 
    var shouldRender = function (user) {
      if (user) {
        for (var userRoleIndex in user.roles) {
          for (var roleIndex in this.roles) {
            if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
              return true;
            }
          }
        }
      } else {
        return this.isPublic;
      }
      return false;
    };
    // Validate menu existance
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId]) {
          return true;
        } else {
          throw new Error('Menu does not exists');
        }
      } else {
        throw new Error('MenuId was not provided');
      }
      return false;
    };
    // Get the menu object by menu id
    this.getMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      return this.menus[menuId];
    };
    // Add new menu object by menu id
    this.addMenu = function (menuId, isPublic, roles) {
      // Create the new menu
      this.menus[menuId] = {
        isPublic: isPublic || false,
        roles: roles || this.defaultRoles,
        items: [],
        shouldRender: shouldRender
      };
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      delete this.menus[menuId];
    };
    // Add menu item object
    this.addMenuItem = function (menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Push new menu item
      this.menus[menuId].items.push({
        title: menuItemTitle,
        link: menuItemURL,
        menuItemType: menuItemType || 'item',
        menuItemClass: menuItemType,
        uiRoute: menuItemUIRoute || '/' + menuItemURL,
        isPublic: isPublic || this.menus[menuId].isPublic,
        roles: roles || this.defaultRoles,
        items: [],
        shouldRender: shouldRender
      });
      // Return the menu object
      return this.menus[menuId];
    };
    // Add submenu item object
    this.addSubMenuItem = function (menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
          // Push new submenu item
          this.menus[menuId].items[itemIndex].items.push({
            title: menuItemTitle,
            link: menuItemURL,
            uiRoute: menuItemUIRoute || '/' + menuItemURL,
            isPublic: isPublic || this.menus[menuId].isPublic,
            roles: roles || this.defaultRoles,
            shouldRender: shouldRender
          });
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
          this.menus[menuId].items.splice(itemIndex, 1);
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
          if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
            this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
          }
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    //Adding the topbar menu
    this.addMenu('topbar');
  }]);'use strict';
//Setting up route
angular.module('koora').config([
  '$stateProvider',
  function ($stateProvider) {
    // Koora state routing
    $stateProvider.state('my-predictions', {
      url: '/my-predictions',
      templateUrl: 'modules/koora/views/my-predictions.client.view.html'
    }).state('my-pools', {
      url: '/my-pools',
      templateUrl: 'modules/koora/views/my-pools.client.view.html'
    }).state('my-standings', {
      url: '/my-standings',
      templateUrl: 'modules/koora/views/my-pools.client.view.html'
    }).state('view-league', {
      url: '/my-leagues/:name',
      templateUrl: 'modules/koora/views/my-pools.client.view.html'
    }).state('view-pool', {
      url: '/my-pools/:name',
      templateUrl: 'modules/koora/views/my-pools.client.view.html'
    });
  }
]);
angular.module('kooraConfiguration', []);'use strict';
angular.module('koora').controller('MyPoolsController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'Pool',
  function ($scope, $stateParams, $location, Authentication, Pool) {
    var $originalScope = $scope;
    $scope.authentication = Authentication;
    $scope.baseUrl = $location.protocol() + '://' + $location.host() + '/#!/my-leagues';
    $scope.returnUrl = $location.url();
    $scope.groupByName = false;
    $scope.groupFound = true;
    $scope.isMemberOfGroup = true;
    if ($stateParams.name) {
      $scope.groupByName = true;
    }
    var loadPool = function (pool, status) {
      $scope.poolToJoin = pool;
      $scope.groupFound = true;
      $scope.groupNotFoundName = '';
      var userPools = Authentication.user.pools;
      if (userPools != null) {
        var matchedPool = _.find(userPools, function (userPool) {
            return userPool.name === pool.name;
          });
        $originalScope.isMemberOfGroup = !_.isUndefined(matchedPool);
        if (matchedPool) {
          $originalScope.selectedPool = _.extend(matchedPool, pool);
        }
      } else
        $originalScope.isMemberOfGroup = false;
    };
    var initPool = function (poolToLoad) {
      if (!Authentication.user) {
        $scope.notAuthenticated;
        return;
      }
      var poolName = poolToLoad || $stateParams.name;
      Pool.get(poolName).success(loadPool).error(function (data, status) {
        if (status === 404) {
          $scope.groupFound = false;
          $scope.groupNotFoundName = poolName;
        }
      });
    };
    if ($scope.authentication.user) {
      $scope.myPools = Authentication.user.pools || [];
      if ($stateParams.name) {
        initPool();
        $scope.groupByName = true;
      } else {
        $scope.groupNotFoundName = '';
        if ($scope.myPools.length > 0) {
          $scope.selectedPool = _.last($scope.myPools);
          $scope.isPoolAdmin = _.find($scope.myPools, function (pool) {
            return pool.isAdmin;
          }) !== undefined;
          initPool($scope.selectedPool.name);
        }
      }
    }
    //$scope.poolToSave;
    $scope.goTo = function (name) {
      $location.path('my-leagues/' + name);
    };
    $scope.savePool = function () {
      return Pool.save($scope.poolToSave).success(function (res) {
        $scope.poolToSave.displayName = '';
        $scope.isPoolAdmin = true;
        res.isAdmin = true;
        $scope.myPools.push(res);
        $scope.savedPool = res;
      }).error(function (data, status) {
        alert(data && data.message || 'An error occured');
      });
    };
    $scope.joinPool = function () {
      $scope.joinError = '';
      Pool.join($scope.poolToJoin.name, $scope.joinPassword).success(function (res, status) {
        $originalScope.joinPassword = '';
        $originalScope.joinedSuccess = true;
        $originalScope.authentication.user.pools = $originalScope.authentication.user.pools || [];
        $originalScope.authentication.user.pools.push(res);
      }).error(function (res, err) {
        $originalScope.joinPassword = '';
        $originalScope.joinError = res.message;
      });
    };
  }
]);'use strict';
angular.module('koora').controller('MyPredictionsController', [
  '$scope',
  '$modal',
  'Authentication',
  'MatchSchedule',
  'ScoreSheet',
  function ($scope, $modal, Authentication, matchSchedule, scoreSheet) {
    //$scope.global = Global;
    $scope.authentication = Authentication;
    $scope.matchSchedule = matchSchedule.schedule;
    $scope.teamsNames = matchSchedule.teamsNames;
    $scope.standings = {};
    _.each($scope.matchSchedule, function (group) {
      $scope.standings[group.group] = [];
      _.each(group.matches, function (match) {
        _.each([
          match.team1,
          match.team2
        ], function (team) {
          if ($scope.standings.length === 0 || !_.find($scope.standings[group.group], function (item) {
              return item.team === team;
            })) {
            $scope.standings[group.group].push({
              team: team,
              played: 0,
              won: 0,
              drawn: 0,
              lost: 0,
              gf: 0,
              ga: 0,
              pts: 0
            });
          }
        });
      });
    });
    function clearStanding(group) {
      for (var i = 0; i < group.length; i++) {
        var team = group[i];
        team.played = team.won = team.drawn = team.lost = team.gf = team.ga = team.pts = 0;
      }
    }
    $scope.$watch('matchSchedule', function (newValue, oldValue) {
      $scope.missingScores = [];
      $scope.qualifiers = {};
      var standings = $scope.standings;
      var standingChanged = false;
      for (var i = 0; i < $scope.matchSchedule.length; i++) {
        var group = $scope.matchSchedule[i];
        var currentgroup = standings[group.group];
        clearStanding(currentgroup);
        group.scoresAdded = 0;
        for (var j = 0; j < group.matches.length; j++) {
          var match = group.matches[j], team1 = match.team1, team2 = match.team2;
          if (!_.isUndefined(match.team1Score) && !_.isUndefined(match.team2Score)) {
            group.scoresAdded++;
            standingChanged = true;
            //teamScore = {played: 0, points: team1points}
            var team1Standing = _.find(currentgroup, function (item) {
                return item.team === team1;
              }), team2Standing = _.find(currentgroup, function (item) {
                return item.team === team2;
              });
            team1Standing.played = ++team1Standing.played;
            team2Standing.played = ++team2Standing.played;
            team1Standing.gf = team1Standing.gf + match.team1Score;
            team1Standing.ga = team1Standing.ga + match.team2Score;
            team2Standing.gf = team2Standing.gf + match.team2Score;
            team2Standing.ga = team2Standing.ga + match.team1Score;
            if (match.team1Score === match.team2Score) {
              team1Standing.pts++;
              team2Standing.pts++;
            } else if (match.team1Score > match.team2Score)
              team1Standing.pts += 3;
            else if (match.team2Score > match.team1Score)
              team2Standing.pts += 3;  // currentgroup[team1] = team1Standing;
                                       // currentgroup[team2] = team2Standing;
          }
        }
        if (group.scoresAdded !== 6) {
          $scope.missingScores.push('Group ' + group.group + ' is missing ' + (6 - group.scoresAdded) + ' scores.');
        }
        $scope.standings[group.group].sort(function (a, b) {
          if (a.pts !== b.pts)
            return a.pts < b.pts;
          else {
            var aDiff = a.gf - a.ga, bDiff = b.gf - b.ga;
            if (aDiff !== bDiff)
              return aDiff < bDiff;
            else {
              return a.gf < b.gf;
            }
          }
        });
        var firstQualifier = $scope.standings[group.group][0].team, secondQualifier = $scope.standings[group.group][1].team;
        group.qualifiers = [
          firstQualifier,
          secondQualifier
        ];
        $scope.qualifiers[firstQualifier] = $scope.teamsNames[firstQualifier];
        $scope.qualifiers[secondQualifier] = $scope.teamsNames[secondQualifier];
      }
    }, true);
    $scope.selectedGroup = $scope.matchSchedule[0];
    var saveScoresheet = function () {
      return scoreSheet.save($scope.matchSchedule, {
        qualifiers: _.map($scope.qualifiers, function (v, k) {
          return k;
        }),
        finalist1: $scope.finalist1,
        finalist2: $scope.finalist2,
        winner: $scope.winner
      });
    };
    $scope.$watchCollection('[finalist1, finalist2]', function (newValues, oldValues, scope) {
      if (oldValues && newValues && !_.contains(newValues, $scope.winner)) {
        $scope.winner = newValues[0] || newValues[1];
      }
    });
    $scope.changeGroup = function (group) {
      $scope.selectedGroup = _.find($scope.matchSchedule, function (schedule) {
        return schedule.group === group.group;
      });
    };
    //var successSaveModal = $modal.open({title: 'My Title', content: 'My Content', show: false});
    $scope.checkMissingScores = function () {
      if ($scope.missingScores.length < 8 && $scope.finalist1 && $scope.finalist2 && $scope.winner) {
        $scope.savingInProgress = true;
        $scope.showMissingScores = false;
        $scope.showMissingFinalists = false;
        saveScoresheet().success(function (response) {
          setTimeout(function () {
            $scope.savingInProgress = false;
            $modal.open({ template: ' <div class="modal-header"><h3 class="modal-title">Your predictions were successfully saved</h3></div><div class="modal-body text-center"> Make sure to save all your predictions before the start of the tournament. <br/><br/>Changes will be locked two hours before the opening game. <br/><br/>Good luck!</div>' });
          }, 1000);
        }).error(function (data, status) {
          $scope.savingInProgress = false;
          alert('error while saving');
        });
      } else {
        $scope.showMissingScores = true;
      }
    };
    if (Authentication.user) {
      scoreSheet.get().success(function (response) {
        if (!response.scores)
          return;
        var savedScores = _.object(_.map(response.scores, function (scoreSheet) {
            return [
              scoreSheet.matchId,
              {
                team1Score: scoreSheet.team1Score,
                team2Score: scoreSheet.team2Score
              }
            ];
          }));
        _.each($scope.matchSchedule, function (group) {
          _.each(group.matches, function (match) {
            match.team1Score = (savedScores[match.matchId] || {}).team1Score;
            match.team2Score = (savedScores[match.matchId] || {}).team2Score;
          });
        });
        $scope.finalist1 = response.extraPredictions.finalist1;
        $scope.finalist2 = response.extraPredictions.finalist2;
        $scope.winner = response.extraPredictions.winner;
      }).error(function (data, status) {
        alert('Error loading your predictions');
      });
    }
  }
]);angular.module('koora').directive('numbersOnly', function () {
  return {
    require: 'ngModel',
    link: function (scope, element, attrs, modelCtrl) {
      modelCtrl.$parsers.push(function (inputValue) {
        // this next if is necessary for when using ng-required on your input. 
        // In such cases, when a letter is typed first, this parser will be called
        // again, and the 2nd time, the value will be undefined
        if (!inputValue)
          return;
        var transformedInput = inputValue.replace(/[^0-9]/g, '');
        if (transformedInput.toString().length > 2) {
          transformedInput = transformedInput.substring(0, 2);
        }
        if (transformedInput.toString().length == 2 && transformedInput.toString()[0] === '0')
          transformedInput = transformedInput.substring(1);
        if (transformedInput !== inputValue) {
          modelCtrl.$setViewValue(transformedInput);
          modelCtrl.$render();
        }
        return parseInt(transformedInput || 0);
      });
    }
  };
});'use strict';
//Menu service used for managing  menus
angular.module('koora').service('MatchSchedule', [function () {
    // Define the menus object
    this.schedule = [
      {
        group: 'A',
        matches: [
          {
            matchId: 1,
            date: '2014-06-12T16:00+0100',
            team1: 'BRA',
            team2: 'CRO'
          },
          {
            matchId: 2,
            date: '2014-06-13T13:00+0100',
            team1: 'MEX',
            team2: 'CMR'
          },
          {
            matchId: 17,
            date: '2014-06-17T16:00+0100',
            team1: 'BRA',
            team2: 'MEX'
          },
          {
            matchId: 18,
            date: '2014-06-18T19:00+0100',
            team1: 'CMR',
            team2: 'CRO'
          },
          {
            matchId: 33,
            date: '2014-06-23T17:00+0100',
            team1: 'CMR',
            team2: 'BRA'
          },
          {
            matchId: 34,
            date: '2014-06-23T17:00+0100',
            team1: 'CRO',
            team2: 'MEX'
          }
        ]
      },
      {
        group: 'B',
        matches: [
          {
            matchId: 3,
            date: '2014-06-13T16:00+0100',
            team1: 'ESP',
            team2: 'NED'
          },
          {
            matchId: 4,
            date: '2014-06-13T19:00+0100',
            team1: 'CHI',
            team2: 'AUS'
          },
          {
            matchId: 20,
            date: '2014-06-18T13:00+0100',
            team1: 'AUS',
            team2: 'NED'
          },
          {
            matchId: 19,
            date: '2014-06-18T16:00+0100',
            team1: 'ESP',
            team2: 'CHI'
          },
          {
            matchId: 35,
            date: '2014-06-23T13:00+0100',
            team1: 'AUS',
            team2: 'ESP'
          },
          {
            matchId: 36,
            date: '2014-06-23T13:00+0100',
            team1: 'NED',
            team2: 'CHI'
          }
        ]
      },
      {
        group: 'C',
        matches: [
          {
            matchId: 5,
            date: '2014-06-14T13:00+0100',
            team1: 'COL',
            team2: 'GRE'
          },
          {
            matchId: 6,
            date: '2014-06-14T22:00+0100',
            team1: 'CIV',
            team2: 'JPN'
          },
          {
            matchId: 21,
            date: '2014-06-19T13:00+0100',
            team1: 'COL',
            team2: 'CIV'
          },
          {
            matchId: 22,
            date: '2014-06-19T19:00+0100',
            team1: 'JPN',
            team2: 'GRE'
          },
          {
            matchId: 37,
            date: '2014-06-24T17:00+0100',
            team1: 'JPN',
            team2: 'COL'
          },
          {
            matchId: 38,
            date: '2014-06-24T17:00+0100',
            team1: 'GRE',
            team2: 'CIV'
          }
        ]
      },
      {
        group: 'D',
        matches: [
          {
            matchId: 7,
            date: '2014-06-14T16:00+0100',
            team1: 'URU',
            team2: 'CRC'
          },
          {
            matchId: 8,
            date: '2014-06-14T19:00+0100',
            team1: 'ENG',
            team2: 'ITA'
          },
          {
            matchId: 23,
            date: '2014-06-19T16:00+0100',
            team1: 'URU',
            team2: 'ENG'
          },
          {
            matchId: 24,
            date: '2014-06-20T13:00+0100',
            team1: 'ITA',
            team2: 'CRC'
          },
          {
            matchId: 39,
            date: '2014-06-24T13:00+0100',
            team1: 'ITA',
            team2: 'URU'
          },
          {
            matchId: 40,
            date: '2014-06-24T13:00+0100',
            team1: 'CRC',
            team2: 'ENG'
          }
        ]
      },
      {
        group: 'E',
        matches: [
          {
            matchId: 9,
            date: '2014-06-15T13:00+0100',
            team1: 'SUI',
            team2: 'ECU'
          },
          {
            matchId: 10,
            date: '2014-06-15T16:00+0100',
            team1: 'FRA',
            team2: 'HON'
          },
          {
            matchId: 25,
            date: '2014-06-20T16:00+0100',
            team1: 'SUI',
            team2: 'FRA'
          },
          {
            matchId: 26,
            date: '2014-06-20T19:00+0100',
            team1: 'HON',
            team2: 'ECU'
          },
          {
            matchId: 41,
            date: '2014-06-25T17:00+0100',
            team1: 'HON',
            team2: 'SUI'
          },
          {
            matchId: 42,
            date: '2014-06-25T17:00+0100',
            team1: 'ECU',
            team2: 'FRA'
          }
        ]
      },
      {
        group: 'F',
        matches: [
          {
            matchId: 11,
            date: '2014-06-15T19:00+0100',
            team1: 'ARG',
            team2: 'BIH'
          },
          {
            matchId: 12,
            date: '2014-06-15T16:00+0100',
            team1: 'IRN',
            team2: 'NGA'
          },
          {
            matchId: 27,
            date: '2014-06-21T13:00+0100',
            team1: 'ARG',
            team2: 'IRN'
          },
          {
            matchId: 28,
            date: '2014-06-21T19:00+0100',
            team1: 'NGA',
            team2: 'BIH'
          },
          {
            matchId: 43,
            date: '2014-06-21T13:00+0100',
            team1: 'NGA',
            team2: 'ARG'
          },
          {
            matchId: 44,
            date: '2014-06-21T13:00+0100',
            team1: 'BIH',
            team2: 'IRN'
          }
        ]
      },
      {
        group: 'G',
        matches: [
          {
            matchId: 13,
            date: '2014-06-16T13:00+0100',
            team1: 'GER',
            team2: 'POR'
          },
          {
            matchId: 14,
            date: '2014-06-15T16:00+0100',
            team1: 'GHA',
            team2: 'USA'
          },
          {
            matchId: 29,
            date: '2014-06-21T16:00+0100',
            team1: 'GER',
            team2: 'GHA'
          },
          {
            matchId: 30,
            date: '2014-06-22T19:00+0100',
            team1: 'USA',
            team2: 'POR'
          },
          {
            matchId: 45,
            date: '2014-06-26T13:00+0100',
            team1: 'USA',
            team2: 'GER'
          },
          {
            matchId: 46,
            date: '2014-06-26T13:00+0100',
            team1: 'POR',
            team2: 'GHA'
          }
        ]
      },
      {
        group: 'H',
        matches: [
          {
            matchId: 15,
            date: '2014-06-17T13:00+0100',
            team1: 'BEL',
            team2: 'ALG'
          },
          {
            matchId: 16,
            date: '2014-06-17T19:00+0100',
            team1: 'RUS',
            team2: 'KOR'
          },
          {
            matchId: 31,
            date: '2014-06-22T13:00+0100',
            team1: 'BEL',
            team2: 'RUS'
          },
          {
            matchId: 32,
            date: '2014-06-22T16:00+0100',
            team1: 'KOR',
            team2: 'ALG'
          },
          {
            matchId: 47,
            date: '2014-06-26T17:00+0100',
            team1: 'KOR',
            team2: 'BEL'
          },
          {
            matchId: 48,
            date: '2014-06-26T17:00+0100',
            team1: 'ALG',
            team2: 'RUS'
          }
        ]
      }
    ];
    this.teamsNames = {
      'BRA': 'Brazil',
      'CRO': 'Croatia',
      'MEX': 'Mexico',
      'CMR': 'Cameroon',
      'ESP': 'Spain',
      'NED': 'Netherlands',
      'CHI': 'Chile',
      'AUS': 'Australia',
      'COL': 'Colombia',
      'GRE': 'Greece',
      'CIV': 'Cote d\'ivoire',
      'JPN': 'Japan',
      'URU': 'Uruguay',
      'CRC': 'Costa Rica',
      'ENG': 'England',
      'ITA': 'Italy',
      'SUI': 'Switzerland',
      'ECU': 'Ecuador',
      'FRA': 'France',
      'HON': 'Honduras',
      'ARG': 'Argentina',
      'BIH': 'Bosnia',
      'IRN': 'Iran',
      'NGA': 'Nigeria',
      'GER': 'Germany',
      'POR': 'Portugal',
      'GHA': 'Ghana',
      'USA': 'USA',
      'BEL': 'Belgium',
      'ALG': 'Algeria',
      'RUS': 'Russia',
      'KOR': 'Korea'
    };
  }]);'use strict';
angular.module('koora').factory('Pool', [
  '$http',
  function ($http) {
    return {
      get: function (name) {
        return $http.get('/pool/' + name);
      },
      join: function (name, password) {
        return $http.post('pool/' + name + '/join', { password: password });
      },
      save: function (pool) {
        return $http.post('/Pool', pool);
      }
    };
  }
]);'use strict';
angular.module('koora').factory('ScoreSheet', [
  '$http',
  function ($http) {
    return {
      get: function () {
        return $http.get('/ScoreSheet');
      },
      save: function (matchSchedule, extraPredictions) {
        var scoreSheet = _.map(matchSchedule, function (group) {
            return _.map(group.matches, function (match) {
              return {
                matchId: match.matchId,
                team1Score: match.team1Score,
                team2Score: match.team2Score
              };
            });
          });
        scoreSheet = _.flatten(scoreSheet);
        return $http.put('/ScoreSheet', {
          scores: scoreSheet,
          extraPredictions: extraPredictions
        });
      }
    };
  }
]);'use strict';
// Config HTTP Error Handling
angular.module('users').config([
  '$httpProvider',
  function ($httpProvider) {
    // Set the httpProvider "not authorized" interceptor
    $httpProvider.interceptors.push([
      '$q',
      '$location',
      'Authentication',
      function ($q, $location, Authentication) {
        return {
          responseError: function (rejection) {
            switch (rejection.status) {
            case 401:
              // Deauthenticate the global user
              Authentication.user = null;
              // Redirect to signin page
              $location.path('signin');
              break;
            case 403:
              // Add unauthorized behaviour 
              break;
            }
            return $q.reject(rejection);
          }
        };
      }
    ]);
  }
]);'use strict';
// Setting up route
angular.module('users').config([
  '$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider.state('profile', {
      url: '/settings/profile',
      templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
    }).state('password', {
      url: '/settings/password',
      templateUrl: 'modules/users/views/settings/change-password.client.view.html'
    }).state('accounts', {
      url: '/settings/accounts',
      templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
    }).state('signup', {
      url: '/signup?returnUrl',
      templateUrl: 'modules/users/views/signup.client.view.html'
    }).state('signin', {
      url: '/signin?returnUrl',
      templateUrl: 'modules/users/views/signin.client.view.html'
    });
  }
]);'use strict';
angular.module('users').controller('AuthenticationController', [
  '$scope',
  '$http',
  '$location',
  '$stateParams',
  'Authentication',
  'MatchSchedule',
  function ($scope, $http, $location, $stateParams, Authentication, matchSchedule) {
    $scope.authentication = Authentication;
    $scope.teamsNames = matchSchedule.teamsNames;
    //If user is signed in then redirect back home
    if ($scope.authentication.user)
      $location.path('/');
    $scope.signup = function () {
      $scope.credentials.predictions = {
        finalist1: $scope.finalist1,
        finalist2: $scope.finalist2,
        winner: $scope.winner
      };
      $http.post('/auth/signup', $scope.credentials).success(function (response) {
        //If successful we assign the response to the global user model
        $scope.authentication.user = response;
        debugger;
        if ($stateParams.returnUrl) {
          $location.path($stateParams.returnUrl);
        } else
          $location.path('/');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    $scope.$watchCollection('[finalist1, finalist2]', function (newValues, oldValues, scope) {
      if (_.contains(newValues, $scope.winner)) {
        $scope.winner = newValues[0] || newValues[1];
      }
    });
    $scope.signin = function () {
      $http.post('/auth/signin', $scope.credentials).success(function (response) {
        //If successful we assign the response to the global user model
        $scope.authentication.user = response;
        if ($stateParams.returnUrl) {
          $location.path($stateParams.returnUrl);
        } else
          $location.path('/');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
angular.module('users').controller('SettingsController', [
  '$scope',
  '$http',
  '$location',
  'Users',
  'Authentication',
  function ($scope, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user;
    // If user is not signed in then redirect back home
    if (!$scope.user)
      $location.path('/');
    // Check if there are additional accounts 
    $scope.hasConnectedAdditionalSocialAccounts = function (provider) {
      for (var i in $scope.user.additionalProvidersData) {
        return true;
      }
      return false;
    };
    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function (provider) {
      return $scope.user.provider === provider || $scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider];
    };
    // Remove a user social account
    $scope.removeUserSocialAccount = function (provider) {
      $scope.success = $scope.error = null;
      $http.delete('/users/accounts', { params: { provider: provider } }).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.user = Authentication.user = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    // Update a user profile
    $scope.updateUserProfile = function () {
      $scope.success = $scope.error = null;
      var user = new Users($scope.user);
      user.$update(function (response) {
        $scope.success = true;
        Authentication.user = response;
      }, function (response) {
        $scope.error = response.data.message;
      });
    };
    // Change user password
    $scope.changeUserPassword = function () {
      $scope.success = $scope.error = null;
      $http.post('/users/password', $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.passwordDetails = null;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
// Authentication service for user variables
angular.module('users').factory('Authentication', [function () {
    var _this = this;
    _this._data = { user: window.user };
    return _this._data;
  }]);'use strict';
// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', [
  '$resource',
  function ($resource) {
    return $resource('users', {}, { update: { method: 'PUT' } });
  }
]);