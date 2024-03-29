# shapefile-parser
A Node.js/Typescript module to parse geometries data from the (*.shp) Shape and (*.dbf) dBase files.
## Installation 
```sh
npm install shapefile-parser --save
yarn add shapefile-parser
bower install shapefile-parser --save
```
## Usage 
### TypeScript
#### Methods for parsing geometries data from the shape Files
```typescript
import {ShapeFileParser} from 'shapefile-parser';
import { ShapeFile } from 'shapefile-parser/models/shapefile';

let shapeFile:ShapeFile = ShapeFileParser.parse(shpBuffer);
let shapeFileWithAttributes:ShapeFile = ShapeFileParser.parseShpAndDbf(shpBuffer, dbfBuffer);
```
```sh
Output should be an instance of ShapeFile class
```
#### Example 1:Reading shape file from local path 'D:\Workspace\tests\sampleShpFiles\sample2-line.shp'
```typescript
import {ShapeFileParser} from 'shapefile-parser';
import { ShapeFile } from 'shapefile-parser/models/shapefile';
import * as fs from "fs";

let buffer:Buffer=fs.readFileSync('/Workspace/tests/sampleShpFiles/sample2-line.shp')
let shapeFile:ShapeFile = ShapeFileParser.parse(buffer);
if(shapeFile.isValid()){
    console.log(shapeFile.shapeFileHeader);
    console.log(shapeFile.ShapeRecords);
}
```
#### Example 2:Reading shape file from 'File' input HtmlElement
```html
<input type="file" id="avatar" (change)="onFileChange($event)" #fileInput>
```
```typescript
import {ShapeFileParser} from 'shapefile-parser';
import { ShapeFile } from 'shapefile-parser/models/shapefile';
import * as fs from "fs";

onFileChange(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsArrayBuffer(file);
      reader.onload = () => {
        var arrayBuffer: ArrayBuffer = reader.result as ArrayBuffer;
        if (arrayBuffer) {
          let buffer: any = Buffer.from(arrayBuffer);
          let shapeFile:ShapeFile = ShapeFileParser.parse(buffer);
          if(shapeFile.isValid()){
            console.log(shapeFile.shapeFileHeader);
            console.log(shapeFile.ShapeRecords);
          }
        }
      };
    }
  }
```
### Javascript
#### Example 1:Reading shape file from local path 'D:\Workspace\tests\sampleShpFiles\sample2-line.shp'
```javascript
var shapeFileParser = require('shapefile-parser');
var fs = require('fs');

var buffer:Buffer=fs.readFileSync('/Workspace/tests/sampleShpFiles/sample2-line.shp')
var shapeFile:ShapeFile = shapeFileParser.parse(buffer);
if(shapeFile.isValid()){
    console.log(shapeFile.shapeFileHeader);
    console.log(shapeFile.ShapeRecords);
}
```
#### Exmaple 2:Reading shape file from 'File' input HtmlElement
```html
<input type="file" id="avatar" (change)="onFileChange($event)" #fileInput>
```
```typescript
var shapeFileParser = require('shapefile-parser');

function onFileChange(event) {
    var reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      var file = event.target.files[0];
      reader.readAsArrayBuffer(file);
      reader.onload = () => {
        var arrayBuffer: ArrayBuffer = reader.result as ArrayBuffer;
        if (arrayBuffer) {
          var buffer: any = Buffer.from(arrayBuffer);
          var shapeFile:ShapeFile = ShapeFileParser.parse(buffer);
          if(shapeFile.isValid()){
            console.log(shapeFile.shapeFileHeader);
            console.log(shapeFile.ShapeRecords);
          }
        }
      };
    }
  }

```
### AMD
```javascript
define(function(require,exports,module){
  var parser = require('shapefile-parser');
});
```
## Supported Shape File
#### ShapeFile Extension
```ShapeFile Extension
*.shp: Supported
*.dbf: Supported
*.prj: Not Supported
*.shx: Not Required, as reading geometries sequentially
```
## Supported Geometry Shape
#### 2D Geometry Shape
```2D geometry Shape
NullShape: Supported
Point: Supported
PolyLine: Supported
Polygon: Supported
MultiPoint: Supported
```
#### 3D Geometry Shape
```3D geometry Shape
PointM: Supported
PolyLineM: Supported
PolygonM: Supported
MultiPointM: Supported
```
#### 4D Geometry Shape
```4D geometry Shape
PointZ: Supported
PolyLineZ: Not Supported
PolygonZ: Not Supported
MultiPointZ: Not Supported
```
#### Other Geometry Shape
```Other geometry Shape
MultiPatch: Not Supported
```
### Support
```Bug or Suggestion Reporting
You can directly send any bug/issue or suggestion to my personal email id: shubhgupta4u@gmail.com.
```