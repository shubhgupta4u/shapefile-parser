"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shapefile_1 = require("./models/shapefile");
class ShapeFileHelpers {
    //Start of methods for converting Shp binaryArray into the geojson object
    static getPointShapes(shapeFile, buffer, byteRead, fileSize) {
        while (byteRead < fileSize) {
            let point = ShapeFileHelpers.readNextPointShape(shapeFile, buffer, byteRead, fileSize);
            shapeFile.ShapeRecords.push(point);
            byteRead = byteRead + point.contentLength;
        }
    }
    static getShapeFileHeader(buffer) {
        let fileCode = buffer.readIntBE(0, 4);
        let fileLength = buffer.readIntBE(24, 4);
        let version = buffer.readIntLE(28, 4);
        let shapeType = buffer.readIntLE(32, 4);
        let xMin = buffer.readDoubleLE(36);
        let yMin = buffer.readDoubleLE(44);
        let xMax = buffer.readDoubleLE(52);
        let yMax = buffer.readDoubleLE(60);
        let zMin = buffer.readDoubleLE(68);
        let zMax = buffer.readDoubleLE(76);
        let mMin = buffer.readDoubleLE(84);
        let mMax = buffer.readDoubleLE(92);
        mMin;
        return new shapefile_1.ShapeFileHeader(fileCode, fileLength, version, shapeType, xMin, yMin, xMax, yMax, zMin, zMax, mMin, mMax);
    }
    static readNextPointShape(shapeFile, buffer, byteRead, fileSize) {
        let recordNumber = buffer.readIntBE(byteRead, 4);
        byteRead = byteRead + 4;
        let contentLength = buffer.readIntBE(byteRead, 4);
        byteRead = byteRead + 4;
        let shapeType = buffer.readIntLE(byteRead, 4);
        byteRead = byteRead + 4;
        let x = buffer.readDoubleLE(byteRead);
        byteRead = byteRead + 8;
        let y = buffer.readDoubleLE(byteRead);
        byteRead = byteRead + 8;
        return new shapefile_1.Point(recordNumber, contentLength, shapeType, x, y);
    }
    static parse(shpFileBuffer) {
        {
            try {
                let byteRead = 0;
                let fileSize = shpFileBuffer.byteLength;
                let fileHeader = ShapeFileHelpers.getShapeFileHeader(shpFileBuffer);
                byteRead = 100;
                let shapeFile = new shapefile_1.ShapeFile(fileHeader);
                switch (fileHeader.shapeType) {
                    case shapefile_1.ShapeType.Point:
                        ShapeFileHelpers.getPointShapes(shapeFile, shpFileBuffer, byteRead, fileSize);
                        break;
                    case shapefile_1.ShapeType.Polyline:
                        break;
                    case shapefile_1.ShapeType.Polygon:
                        break;
                    case shapefile_1.ShapeType.MultiPoint:
                        break;
                    default:
                        throw new SyntaxError("This shape file contains unsupported geometries.");
                }
                console.log(shapeFile);
                return shapeFile;
            }
            catch (error) {
                throw error;
            }
        }
    }
}
exports.ShapeFileHelpers = ShapeFileHelpers;
