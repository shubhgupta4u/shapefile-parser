"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ShapeType;
(function (ShapeType) {
    ShapeType[ShapeType["NullShape"] = 0] = "NullShape";
    ShapeType[ShapeType["Point"] = 1] = "Point";
    ShapeType[ShapeType["PolyLine"] = 3] = "PolyLine";
    ShapeType[ShapeType["Polygon"] = 5] = "Polygon";
    ShapeType[ShapeType["MultiPoint"] = 8] = "MultiPoint";
    ShapeType[ShapeType["PointZ"] = 11] = "PointZ";
    ShapeType[ShapeType["PolyLineZ"] = 13] = "PolyLineZ";
    ShapeType[ShapeType["PolygonZ"] = 15] = "PolygonZ";
    ShapeType[ShapeType["MultiPointZ"] = 18] = "MultiPointZ";
    ShapeType[ShapeType["PointM"] = 21] = "PointM";
    ShapeType[ShapeType["PolyLineM"] = 23] = "PolyLineM";
    ShapeType[ShapeType["PolygonM"] = 25] = "PolygonM";
    ShapeType[ShapeType["MultiPointM"] = 28] = "MultiPointM";
    ShapeType[ShapeType["MultiPatch"] = 31] = "MultiPatch";
})(ShapeType = exports.ShapeType || (exports.ShapeType = {}));
class ShapeFile {
    constructor(shapeFileHeader) {
        this.shapeFileHeader = shapeFileHeader;
        this.ShapeRecords = new Array();
    }
    isValid() {
        let contentSize = 0;
        let isAllShapeRecordValid = true;
        this.ShapeRecords.forEach((record) => {
            contentSize = contentSize + record.getRecordSize();
            if (!record.isValidShape()) {
                isAllShapeRecordValid = false;
            }
        });
        return isAllShapeRecordValid && this.shapeFileHeader && this.shapeFileHeader.fileLength == (contentSize + this.shapeFileHeader.headerSize);
    }
}
exports.ShapeFile = ShapeFile;
class ShapeFileHeader {
    constructor(fileCode, fileLength, version, shapeType, xMin, yMin, xMax, yMax, zMin, zMax, mMin, mMax) {
        this.headerSize = 100;
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
        this.contentLength = contentLength * 2;
        this.shapeType = shapeType;
        this.attributes = new Array();
    }
    getRecordSize() {
        return 8 + this.getContentSize();
    }
}
exports.ShapeRecord = ShapeRecord;
class NullShape extends ShapeRecord {
    constructor(recordNumber, contentLength, shapeType) {
        super(recordNumber, contentLength, shapeType);
    }
    getContentSize() {
        return ShapeFileFieldSize.shapeType;
    }
    isValidShape() {
        return this.contentLength == this.getContentSize();
    }
}
exports.NullShape = NullShape;
class Point extends ShapeRecord {
    constructor(recordNumber, contentLength, shapeType, x, y) {
        super(recordNumber, contentLength, shapeType);
        this.coordinate = new Coordinate(x, y);
    }
    getContentSize() {
        return ShapeFileFieldSize.shapeType + ShapeFileFieldSize.point;
    }
    isValidShape() {
        return this.contentLength == this.getContentSize();
    }
}
exports.Point = Point;
class MultiPoint extends ShapeRecord {
    constructor(recordNumber, contentLength, shapeType, numberOfPoints, boundingBox) {
        super(recordNumber, contentLength, shapeType);
        this.coordinates = new Array();
        this.numberOfPoints = numberOfPoints;
        if (boundingBox && boundingBox.length == 4) {
            this.boundingBox = new BoundingBox(new Coordinate(boundingBox[0], boundingBox[1]), new Coordinate(boundingBox[2], boundingBox[3]));
        }
        else {
            this.boundingBox = null;
        }
    }
    getContentSize() {
        return ShapeFileFieldSize.shapeType + ShapeFileFieldSize.boundingBox + ShapeFileFieldSize.NumOfPoint + (this.numberOfPoints * ShapeFileFieldSize.point);
    }
    isValidShape() {
        return this.contentLength == this.getContentSize() && this.boundingBox instanceof BoundingBox && (this.numberOfPoints == this.coordinates.length);
    }
}
exports.MultiPoint = MultiPoint;
class PolyLine extends ShapeRecord {
    constructor(recordNumber, contentLength, shapeType, numberOfParts, numberOfPoints, boundingBox) {
        super(recordNumber, contentLength, shapeType);
        this.parts = new Array();
        this.numberOfParts = numberOfParts;
        this.numberOfPoints = numberOfPoints;
        if (boundingBox && boundingBox.length == 4) {
            this.boundingBox = new BoundingBox(new Coordinate(boundingBox[0], boundingBox[1]), new Coordinate(boundingBox[2], boundingBox[3]));
        }
        else {
            this.boundingBox = null;
        }
    }
    getContentSize() {
        return ShapeFileFieldSize.shapeType + ShapeFileFieldSize.boundingBox + ShapeFileFieldSize.NumOfPart + ShapeFileFieldSize.NumOfPoint + (this.numberOfParts * ShapeFileFieldSize.part) + (this.numberOfPoints * ShapeFileFieldSize.point);
    }
    isValidShape() {
        let pointsCount = 0;
        this.parts.forEach((line) => {
            pointsCount = pointsCount + line.coordinates.length;
        });
        return this.contentLength == this.getContentSize() && this.boundingBox instanceof BoundingBox && (this.numberOfParts == this.parts.length) && (this.numberOfPoints == pointsCount);
    }
}
exports.PolyLine = PolyLine;
class Polygon extends ShapeRecord {
    constructor(recordNumber, contentLength, shapeType, numberOfParts, numberOfPoints, boundingBox) {
        super(recordNumber, contentLength, shapeType);
        this.parts = new Array();
        this.numberOfParts = numberOfParts;
        this.numberOfPoints = numberOfPoints;
        if (boundingBox && boundingBox.length == 4) {
            this.boundingBox = new BoundingBox(new Coordinate(boundingBox[0], boundingBox[1]), new Coordinate(boundingBox[2], boundingBox[3]));
        }
        else {
            this.boundingBox = null;
        }
    }
    getContentSize() {
        return ShapeFileFieldSize.shapeType + ShapeFileFieldSize.boundingBox + ShapeFileFieldSize.NumOfPart + ShapeFileFieldSize.NumOfPoint + (this.numberOfParts * ShapeFileFieldSize.part) + (this.numberOfPoints * ShapeFileFieldSize.point);
    }
    isValidShape() {
        let pointsCount = 0;
        this.parts.forEach((line) => {
            pointsCount = pointsCount + line.coordinates.length;
        });
        return this.contentLength == this.getContentSize() && this.boundingBox instanceof BoundingBox && (this.numberOfParts == this.parts.length) && (this.numberOfPoints == pointsCount);
    }
}
exports.Polygon = Polygon;
class PointM extends ShapeRecord {
    constructor(recordNumber, contentLength, shapeType, x, y, m) {
        super(recordNumber, contentLength, shapeType);
        this.coordinateM = new CoordinateM(x, y, m);
    }
    getContentSize() {
        return ShapeFileFieldSize.shapeType + ShapeFileFieldSize.pointM;
    }
    isValidShape() {
        return this.contentLength == this.getContentSize();
    }
}
exports.PointM = PointM;
class MultiPointM extends ShapeRecord {
    constructor(recordNumber, contentLength, shapeType, numberOfPoints, boundingBox, mMin, mMax) {
        super(recordNumber, contentLength, shapeType);
        this.coordinatesM = new Array();
        this.numberOfPoints = numberOfPoints;
        this.mMin = mMin;
        this.mMax = mMax;
        if (boundingBox && boundingBox.length == 4) {
            this.boundingBox = new BoundingBox(new Coordinate(boundingBox[0], boundingBox[1]), new Coordinate(boundingBox[2], boundingBox[3]));
        }
        else {
            this.boundingBox = null;
        }
    }
    getContentSize() {
        return ShapeFileFieldSize.shapeType + ShapeFileFieldSize.boundingBox + ShapeFileFieldSize.NumOfPoint + (this.numberOfPoints * ShapeFileFieldSize.pointM) + ShapeFileFieldSize.rangeM;
    }
    isValidShape() {
        return this.contentLength == this.getContentSize() && this.boundingBox instanceof BoundingBox && (this.numberOfPoints == this.coordinatesM.length);
    }
}
exports.MultiPointM = MultiPointM;
class PolyLineM extends ShapeRecord {
    constructor(recordNumber, contentLength, shapeType, numberOfParts, numberOfPoints, boundingBox, mMin, mMax) {
        super(recordNumber, contentLength, shapeType);
        this.parts = new Array();
        this.numberOfParts = numberOfParts;
        this.numberOfPoints = numberOfPoints;
        this.mMin = mMin;
        this.mMax = mMax;
        if (boundingBox && boundingBox.length == 4) {
            this.boundingBox = new BoundingBox(new Coordinate(boundingBox[0], boundingBox[1]), new Coordinate(boundingBox[2], boundingBox[3]));
        }
        else {
            this.boundingBox = null;
        }
    }
    getContentSize() {
        return ShapeFileFieldSize.shapeType + ShapeFileFieldSize.boundingBox + ShapeFileFieldSize.NumOfPart + ShapeFileFieldSize.NumOfPoint + (this.numberOfParts * ShapeFileFieldSize.part) + (this.numberOfPoints * ShapeFileFieldSize.pointM) + ShapeFileFieldSize.rangeM;
    }
    isValidShape() {
        let pointsCount = 0;
        this.parts.forEach((line) => {
            pointsCount = pointsCount + line.coordinatesM.length;
        });
        return this.contentLength == this.getContentSize() && this.boundingBox instanceof BoundingBox && (this.numberOfParts == this.parts.length) && (this.numberOfPoints == pointsCount);
    }
}
exports.PolyLineM = PolyLineM;
class PolygonM extends ShapeRecord {
    constructor(recordNumber, contentLength, shapeType, numberOfParts, numberOfPoints, boundingBox, mMin, mMax) {
        super(recordNumber, contentLength, shapeType);
        this.parts = new Array();
        this.numberOfParts = numberOfParts;
        this.numberOfPoints = numberOfPoints;
        this.mMin = mMin;
        this.mMax = mMax;
        if (boundingBox && boundingBox.length == 4) {
            this.boundingBox = new BoundingBox(new Coordinate(boundingBox[0], boundingBox[1]), new Coordinate(boundingBox[2], boundingBox[3]));
        }
        else {
            this.boundingBox = null;
        }
    }
    getContentSize() {
        return ShapeFileFieldSize.shapeType + ShapeFileFieldSize.boundingBox + ShapeFileFieldSize.NumOfPart + ShapeFileFieldSize.NumOfPoint + (this.numberOfParts * ShapeFileFieldSize.part) + (this.numberOfPoints * ShapeFileFieldSize.pointM) + ShapeFileFieldSize.rangeM;
    }
    isValidShape() {
        let pointsCount = 0;
        this.parts.forEach((line) => {
            pointsCount = pointsCount + line.coordinatesM.length;
        });
        return this.contentLength == this.getContentSize() && this.boundingBox instanceof BoundingBox && (this.numberOfParts == this.parts.length) && (this.numberOfPoints == pointsCount);
    }
}
exports.PolygonM = PolygonM;
class PointZ extends ShapeRecord {
    constructor(recordNumber, contentLength, shapeType, x, y, z, m) {
        super(recordNumber, contentLength, shapeType);
        this.coordinateZ = new CoordinateZ(x, y, z, m);
    }
    getContentSize() {
        return ShapeFileFieldSize.shapeType + ShapeFileFieldSize.pointZ;
    }
    isValidShape() {
        return this.contentLength == this.getContentSize();
    }
}
exports.PointZ = PointZ;
class Part {
    constructor() {
        this.coordinates = new Array();
    }
}
exports.Part = Part;
class PartM {
    constructor() {
        this.coordinatesM = new Array();
    }
}
exports.PartM = PartM;
class BoundingBox {
    constructor(southwest, northeast) {
        this.southwest = southwest;
        this.northeast = northeast;
    }
}
exports.BoundingBox = BoundingBox;
class Coordinate {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
exports.Coordinate = Coordinate;
class CoordinateM extends Coordinate {
    constructor(x, y, m) {
        super(x, y);
        this.m = m;
    }
}
exports.CoordinateM = CoordinateM;
class CoordinateZ extends CoordinateM {
    constructor(x, y, z, m) {
        super(x, y, m);
        this.z = z;
    }
}
exports.CoordinateZ = CoordinateZ;
class Attribute {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }
}
exports.Attribute = Attribute;
class ShapeFileFieldSize {
}
ShapeFileFieldSize.boundingBox = 32;
ShapeFileFieldSize.shapeType = 4;
ShapeFileFieldSize.NumOfPart = 4;
ShapeFileFieldSize.NumOfPoint = 4;
ShapeFileFieldSize.point = 16;
ShapeFileFieldSize.pointM = 24;
ShapeFileFieldSize.pointZ = 32;
ShapeFileFieldSize.rangeM = 16;
ShapeFileFieldSize.part = 4;
exports.ShapeFileFieldSize = ShapeFileFieldSize;
