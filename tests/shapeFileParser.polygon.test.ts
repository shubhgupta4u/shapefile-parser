import { expect, should } from 'chai';
import {ShapeFileParser} from '../lib/shapeFile-parser';
import * as fs from "fs";
import { ShapeFile, Polygon } from '../lib/models/shapefile';

describe('Reading Polygon Shape File', function() {
  it('parseShapeFileOfSample2Polygon', function() {
    let buffer:Buffer=fs.readFileSync('sample2-polygon.shp')
    let shapeFile:ShapeFile = ShapeFileParser.parse(buffer);
    should().exist(shapeFile);
    expect(shapeFile).instanceOf(ShapeFile);
    expect(shapeFile.isValid()).equals(true);
  });
  it('parseShapeFileOfSample4Polygon', function() {
    let buffer:Buffer=fs.readFileSync('sample4-polygon.shp')
    let shapeFile:ShapeFile = ShapeFileParser.parse(buffer);
    should().exist(shapeFile);
    expect(shapeFile).instanceOf(ShapeFile);
    expect(shapeFile.isValid()).equals(true);
  });  
});