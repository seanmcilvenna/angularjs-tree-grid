angular.module('angular-tree-grid', [])
    .run(function($templateCache) {
        var treeGridHtml = `
<style type="text/css">
    .tree-grid tr.highlight {
        background-color: inherit;
        font-weight: bold;
    }
    
    .tree-grid tr.no-children td:first-child {
        padding-left: 26px;
    }
</style>
<div class="tree-grid">
    <table class="table table-striped">
        <thead>
            <tr>
                <th ng-repeat="c in options.columns">{{c.header}}</th>
            </tr>
        </thead>
        <tbody>
            <tr class="clickable" ng-repeat="node in flattenedNodes" ng-class="{ 'highlight': node.Constraint, 'danger': selectedNode == node, 'no-children': !nodeHasChildren(node) }">
                <td ng-repeat="c in options.columns" ng-click="toggleSelect(node, $event)">
                    <span ng-if="$index == 0">
                        <span style="white-space: pre">{{getNodeTabs(node)}}</span>
                        <i ng-show="nodeHasChildren(node)" class="glyphicon clickable" ng-class="{ 'glyphicon-plus': !node.$expanded, 'glyphicon-minus': node.$expanded }" ng-click="toggleExpand(node, $event)"></i>
                    </span>
                    <span>{{node[c.key]}}</span>
                </td>
            </tr>
        </tbody>
    </table>
</div>
`;
        $templateCache.put('/template/treeGrid.tpl.html', treeGridHtml);
    })
    .directive('treeGrid', function($templateCache) {
        return {
            restrict: 'E',
            template: $templateCache.get('/template/treeGrid.tpl.html'),
            transclude: true,
            scope: {
                nodes: '=nodes',
                onNodeSelected: '&nodeSelected',
                onNodeExpanded: '&nodeExpanded'
            },
            link: function ($scope, $element, $attributes, $controller, $transclude) {
                $scope.options = {
                    columns: []
                };

                $transclude(function(options) {
                    $scope.options.childrenKey = $(options[1]).attr('children-key');

                    var columns = options.find('columns > column');

                    for (var i = 0; i < columns.length; i++) {
                        var column = {};
                        column.key = $(columns[i]).attr('key');
                        column.header = $(columns[i]).attr('header');
                        $scope.options.columns.push(column);
                    }
                });

                $scope.flattenedNodes = [];
                $scope.selectedNode = null;
                
                $scope.nodeHasChildren = function(node) {
                    if ($scope.options.hasNodesKey) {
                        return node[$scope.options.hasNodesKey];
                    } else {
                        var children = node[$scope.options.childrenKey];
                        return children && children.length > 0;
                    }
                };

                $scope.getNodeTabs = function (node) {
                    var tabs = '';

                    for (var i = 0; i < node.$level; i++) {
                        tabs += '    ';
                    }

                    return tabs;
                };

                $scope.toggleExpand = function (node, $event) {
                    node.$expanded = !node.$expanded;
                    $scope.onNodeExpanded({ node });
                    $scope.flattenedNodes = getFlattenedNodes();

                    if ($event) {
                        $event.stopPropagation();
                    }
                };

                $scope.toggleSelect = function (node, $event) {
                    if ($scope.selectedNode == node) {
                        $scope.selectedNode = null;
                    } else {
                        $scope.selectedNode = node;
                    }

                    $scope.onNodeSelected({
                        selectedNode: $scope.selectedNode
                    });
                };

                var getFlattenedNodes = function () {
                    var flattenNodes = function (flattened, parent, level) {
                        for (var i = 0; i < parent[$scope.options.childrenKey].length; i++) {
                            var node = parent[$scope.options.childrenKey][i];

                            node.$level = level;
                            flattened.push(node);

                            if (node.$expanded) {
                                flattenNodes(flattened, node, level + 1);
                            }
                        }
                    };

                    var flattened = [];
                    var rootNode = {};
                    rootNode[$scope.options.childrenKey] = $scope.nodes;
                    flattenNodes(flattened, rootNode, 0);
                    return flattened;
                };

                $scope.$watch('nodes', function () {
                    $scope.flattenedNodes = getFlattenedNodes();
                }, true);
            }
        };
    });