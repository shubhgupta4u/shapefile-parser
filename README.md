# shapefile-parser
A Node.js/Typescript module to parse geometries data from the (*.shp) Shape file.
## Installation 
```sh
npm install shapefile-parser --save
yarn add shapefile-parser
bower install shapefile-parser --save
```
## Usage 
### TypeScript
### Case 1:Reading shape file from local path 'D:\Workspace\tests\sampleShpFiles\sample2-line.shp'
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
```sh
Output should be an instance of ShapeFile class
```
### Case 2:Reading shape file from 'File' input HtmlElement
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
```sh
Output should be an instance of ShapeFile class
```
### Javascript
### Case 1:Reading shape file from local path 'D:\Workspace\tests\sampleShpFiles\sample2-line.shp'
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
### Case 2:Reading shape file from 'File' input HtmlElement
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
```sh
Output should be an instance of ShapeFile class
```
### AMD
```javascript
define(function(require,exports,module){
  var parser = require('shapefile-parser');
});
```
### Support
```Bug or Suggestion Reporting
You can directly send any bug/issue or suggestion to my personal email id: shubhgupta4u@gmail.com.
```