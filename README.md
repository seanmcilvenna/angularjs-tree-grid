## Installation
### Install with Bower
`bower install angularjs-tree-grid`

### Add dependency to module
```
angular.module('MyModule', ['angularjs-tree-grid']);
```

## Usage
```
<script type="text/javascript" src="bower_components/angularjs-tree-grid/angularjs-tree-grid.js"></script>
<tree-grid nodes="exampleNodes" node-selected="nodeSelected(selectedNode)">
    <options children-key="children">
        <columns>
            <column key="name" header="Name"></column>
            <column key="attribute" header="Attribute"></column>
        </columns>
    </options>
</tree-grid>
```

### Example
...

## Options
| Option | Description |
| ------ | ----------- |
| options.children-key | The name of the property of each node that contains children |
| options.columns | The array of columns |
| options.columns.key | The name of the property on each node that should be used for the column |
| options.columns.header | The header of the column (what is displayed in the first/header row of the table) |

## ☕ Support My Work

Find this useful and want to show appreciation??  

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-Support%20My%20Work-orange?style=flat&logo=buy-me-a-coffee)](https://buymeacoffee.com/seanmcilvenna)

Your support helps keep this project alive and motivates me to continue improving it! 🚀
