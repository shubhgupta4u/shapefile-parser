import { expect, should } from 'chai';
import { ShapeFileParser } from '../lib/shapeFile-parser';
import * as fs from "fs";
import { ShapeFile } from '../lib/models/shapefile';

describe('Reading Polyline Shape File', function () {
  it('parseShapeFileOfSample2Polyline', function() {
    let buffer:Buffer=fs.readFileSync('/Workspace/shapefile-parser/tests/sampleShpFiles/sample2-line.shp')
    let dbfbuffer:Buffer=fs.readFileSync('/Workspace/shapefile-parser/tests/sampleShpFiles/sample2-line.dbf')
    let shapeFile:ShapeFile = ShapeFileParser.parseShpAndDbf(buffer,dbfbuffer);
    should().exist(shapeFile);
    expect(shapeFile).instanceOf(ShapeFile);
    expect(shapeFile.isValid()).equals(true);
  });
});