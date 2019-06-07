import { expect, should } from 'chai';
import {ShapeFileParser} from '../lib/shapeFile-parser';
import * as fs from "fs";
import { ShapeFile } from '../lib/models/shapefile';

describe('Geojson Creator', function() {
  it('parseShapeFileOfSample2Point', function() {
    let buffer:Buffer=fs.readFileSync('sample2-point.shp')
    let shapeFile:ShapeFile = ShapeFileParser.parse(buffer);
    should().exist(shapeFile);
    expect(shapeFile).instanceOf(ShapeFile);
  });
  it('parseShapeFileOfSample3Point', function() {
    let buffer:Buffer=fs.readFileSync('sample3-point.shp')
    let shapeFile:ShapeFile = ShapeFileParser.parse(buffer);
    should().exist(shapeFile);
    expect(shapeFile).instanceOf(ShapeFile);
  });
  it('parseShapeFileOfSample4Point', function() {
    let buffer:Buffer=fs.readFileSync('sample4-point.shp')
    let shapeFile:ShapeFile = ShapeFileParser.parse(buffer);
    should().exist(shapeFile);
    expect(shapeFile).instanceOf(ShapeFile);
  });
  // it('createJsonFromshpBlob', function () {  
  //   let shpFile:Blob =new Blob([]);
  //   var reader = new FileReader();
  //   reader.onload = function (e) {
  //     var arrayBuffer: ArrayBuffer = reader.result as ArrayBuffer;
  //     if (arrayBuffer) {
  //       let buffer:Buffer = Buffer.from(arrayBuffer)
  //       let geojson = Geojson.fromShp(buffer);
  //       should().exist(geojson);
  //     }
  //   }
  //   reader.readAsArrayBuffer(shpFile);    
  // });  
});