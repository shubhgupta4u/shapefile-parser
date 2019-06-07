"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ShapeType;
(function (ShapeType) {
    ShapeType[ShapeType["NullShape"] = 0] = "NullShape";
    ShapeType[ShapeType["Point"] = 1] = "Point";
    ShapeType[ShapeType["Polyline"] = 3] = "Polyline";
    ShapeType[ShapeType["Polygon"] = 5] = "Polygon";
    ShapeType[ShapeType["MultiPoint"] = 8] = "MultiPoint";
    ShapeType[ShapeType["PointZ"] = 11] = "PointZ";
    ShapeType[ShapeType["PolylineZ"] = 13] = "PolylineZ";
    ShapeType[ShapeType["PolygonZ"] = 15] = "PolygonZ";
    ShapeType[ShapeType["MultiPointZ"] = 18] = "MultiPointZ";
    ShapeType[ShapeType["PointM"] = 21] = "PointM";
    ShapeType[ShapeType["PolylineM"] = 23] = "PolylineM";
    ShapeType[ShapeType["PolygonM"] = 25] = "PolygonM";
    ShapeType[ShapeType["MultiPointM"] = 28] = "MultiPointM";
    ShapeType[ShapeType["MultiPatch"] = 31] = "MultiPatch";
})(ShapeType = exports.ShapeType || (exports.ShapeType = {}));
class ShapeFile {
    constructor(shapeFileHeader) {
        this.shapeFileHeader = shapeFileHeader;
        this.ShapeRecords = new Array();
    }
}
exports.ShapeFile = ShapeFile;
class ShapeFileHeader {
    constructor(fileCode, fileLength, version, shapeType, xMin, yMin, xMax, yMax, zMin, zMax, mMin, mMax) {
        this.fileCode = fileCode;
        this.fileLength = fileLength * 2;
        this.version = version;
        this.shapeType = shapeType;
        this.xMin = xMin;
        this.yMin = yMin;
        this.xMax = xMax;
        this.yMax = yMax;
        this.zMin = zMin;
        this.zMax = zMax;
        this.mMin = mMin;
        this.mMax = mMax;
    }
}
exports.ShapeFileHeader = ShapeFileHeader;
class ShapeRecord {
    constructor(recordNumber, contentLength, shapeType) {
        this.recordNumber = recordNumber;
        this.contentLength = contentLength * 2 + 8;
        this.shapeType = shapeType;
    }
}
exports.ShapeRecord = ShapeRecord;
class Point extends ShapeRecord {
    constructor(recordNumber, contentLength, shapeType, x, y) {
        super(recordNumber, contentLength, shapeType);
        this.x = x;
        this.y = y;
    }
}
exports.Point = Point;
