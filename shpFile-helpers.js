"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shapefile_1 = require("./models/shapefile");
class ShapeFileHelpers {
    static getNullShapes(shapeFile, buffer, byteRead, fileSize) {
        while (byteRead < fileSize) {
            let nullShape = ShapeFileHelpers.readNextNullShape(shapeFile, buffer, byteRead, fileSize);
            shapeFile.ShapeRecords.push(nullShape);
            byteRead = byteRead + nullShape.contentLength + ShapeFileHelpers.recordHeaderSize;
            ;
        }
    }
    static readNextNullShape(shapeFile, buffer, byteRead, fileSize) {
        let recordNumber = buffer.readIntBE(byteRead, 4);
        byteRead = byteRead + 4;
        let contentLength = buffer.readIntBE(byteRead, 4);
        byteRead = byteRead + 4;
        let shapeType = buffer.readIntLE(byteRead, 4);
        byteRead = byteRead + 4;
        return new shapefile_1.NullShape(recordNumber, contentLength, shapeType);
    }
    static getPointShapes(shapeFile, buffer, byteRead, fileSize) {
        try {
            while (byteRead < fileSize) {
                let point = ShapeFileHelpers.readNextPointShape(shapeFile, buffer, byteRead, fileSize);
                shapeFile.ShapeRecords.push(point);
                byteRead = byteRead + point.contentLength + ShapeFileHelpers.recordHeaderSize;
            }
        }
        catch (error) {
            throw error;
        }
    }
    static readNextPointShape(shapeFile, buffer, byteRead, fileSize) {
        let recordNumber = buffer.readIntBE(byteRead, 4);
        byteRead = byteRead + 4;
        let contentLength = buffer.readIntBE(byteRead, 4);
        byteRead = byteRead + 4;
        let shapeType = buffer.readIntLE(byteRead, 4);
        byteRead = byteRead + 4;
        if (shapeType == shapefile_1.ShapeType.NullShape) {
            return new shapefile_1.NullShape(recordNumber, contentLength, shapeType);
        }
        else if (shapeType == shapefile_1.ShapeType.Point) {
            let x = buffer.readDoubleLE(byteRead);
            byteRead = byteRead + 8;
            let y = buffer.readDoubleLE(byteRead);
            byteRead = byteRead + 8;
            return new shapefile_1.Point(recordNumber, contentLength, shapeType, x, y);
        }
        else {
            throw new SyntaxError("Invalid shape file");
        }
    }
    static getMultiPointShapes(shapeFile, buffer, byteRead, fileSize) {
        try {
            while (byteRead < fileSize) {
                let multiPoint = ShapeFileHelpers.readNextMultiPointShape(shapeFile, buffer, byteRead, fileSize);
                shapeFile.ShapeRecords.push(multiPoint);
                byteRead = byteRead + multiPoint.contentLength + ShapeFileHelpers.recordHeaderSize;
            }
        }
        catch (error) {
            throw error;
        }
    }
    static readNextMultiPointShape(shapeFile, buffer, byteRead, fileSize) {
        let recordNumber = buffer.readIntBE(byteRead, 4);
        byteRead = byteRead + 4;
        let contentLength = buffer.readIntBE(byteRead, 4);
        byteRead = byteRead + 4;
        let shapeType = buffer.readIntLE(byteRead, 4);
        byteRead = byteRead + 4;
        if (shapeType == shapefile_1.ShapeType.NullShape) {
            return new shapefile_1.NullShape(recordNumber, contentLength, shapeType);
        }
        else if (shapeType == shapefile_1.ShapeType.MultiPoint) {
            let xmin = buffer.readDoubleLE(byteRead);
            byteRead = byteRead + 8;
            let ymin = buffer.readDoubleLE(byteRead);
            byteRead = byteRead + 8;
            let xmax = buffer.readDoubleLE(byteRead);
            byteRead = byteRead + 8;
            let ymax = buffer.readDoubleLE(byteRead);
            byteRead = byteRead + 8;
            let box = new Array();
            box.push(xmin);
            box.push(ymin);
            box.push(xmax);
            box.push(ymax);
            let noOfPoints = buffer.readIntLE(byteRead, 4);
            byteRead = byteRead + 4;
            let multiPoint = new shapefile_1.MultiPoint(recordNumber, contentLength, shapeType, noOfPoints, box);
            for (var i = 0; i < noOfPoints; i++) {
                let x = buffer.readDoubleLE(byteRead);
                byteRead = byteRead + 8;
                let y = buffer.readDoubleLE(byteRead);
                byteRead = byteRead + 8;
                multiPoint.coordinates.push(new shapefile_1.Coordinate(x, y));
            }
            return multiPoint;
        }
        else {
            throw new SyntaxError("Invalid shape file");
        }
    }
    static getPolyLineShapes(shapeFile, buffer, byteRead, fileSize) {
        try {
            while (byteRead < fileSize) {
                let polyLine = ShapeFileHelpers.readNextPolyLineShape(shapeFile, buffer, byteRead, fileSize);
                shapeFile.ShapeRecords.push(polyLine);
                byteRead = byteRead + polyLine.contentLength + ShapeFileHelpers.recordHeaderSize;
            }
        }
        catch (error) {
            throw error;
        }
    }
    static readNextPolyLineShape(shapeFile, buffer, byteRead, fileSize) {
        let recordNumber = buffer.readIntBE(byteRead, 4);
        byteRead = byteRead + 4;
        let contentLength = buffer.readIntBE(byteRead, 4);
        byteRead = byteRead + 4;
        let shapeType = buffer.readIntLE(byteRead, 4);
        byteRead = byteRead + 4;
        if (shapeType == shapefile_1.ShapeType.NullShape) {
            return new shapefile_1.NullShape(recordNumber, contentLength, shapeType);
        }
        else if (shapeType == shapefile_1.ShapeType.PolyLine) {
            let xmin = buffer.readDoubleLE(byteRead);
            byteRead = byteRead + 8;
            let ymin = buffer.readDoubleLE(byteRead);
            byteRead = byteRead + 8;
            let xmax = buffer.readDoubleLE(byteRead);
            byteRead = byteRead + 8;
            let ymax = buffer.readDoubleLE(byteRead);
            byteRead = byteRead + 8;
            let box = new Array();
            box.push(xmin);
            box.push(ymin);
            box.push(xmax);
            box.push(ymax);
            let noOfParts = buffer.readIntLE(byteRead, 4);
            byteRead = byteRead + 4;
            let noOfPoints = buffer.readIntLE(byteRead, 4);
            byteRead = byteRead + 4;
            let polyLine = new shapefile_1.PolyLine(recordNumber, contentLength, shapeType, noOfParts, noOfPoints, box);
            let partStartingIndexList = new Array();
            for (var i = 0; i < noOfParts; i++) {
                let partStartingIndex = buffer.readIntLE(byteRead, 4);
                byteRead = byteRead + 4;
                partStartingIndexList.push(partStartingIndex);
            }
            let line = new shapefile_1.Part();
            for (var i = 0, j = 1; i < noOfPoints; i++) {
                if (i == partStartingIndexList[j]) {
                    polyLine.parts.push(line);
                    line = new shapefile_1.Part();
                    j += 1;
                }
                let x = buffer.readDoubleLE(byteRead);
                byteRead = byteRead + 8;
                let y = buffer.readDoubleLE(byteRead);
                byteRead = byteRead + 8;
                line.coordinates.push(new shapefile_1.Coordinate(x, y));
            }
            if (line) {
                polyLine.parts.push(line);
            }
            return polyLine;
        }
        else {
            throw new SyntaxError("Invalid shape file");
        }
    }
    static getPolygonShapes(shapeFile, buffer, byteRead, fileSize) {
        try {
            while (byteRead < fileSize) {
                let polygon = ShapeFileHelpers.readNextPolygonShape(shapeFile, buffer, byteRead, fileSize);
                shapeFile.ShapeRecords.push(polygon);
                byteRead = byteRead + polygon.contentLength + ShapeFileHelpers.recordHeaderSize;
            }
        }
        catch (error) {
            throw error;
        }
    }
    static readNextPolygonShape(shapeFile, buffer, byteRead, fileSize) {
        let recordNumber = buffer.readIntBE(byteRead, 4);
        byteRead = byteRead + 4;
        let contentLength = buffer.readIntBE(byteRead, 4);
        byteRead = byteRead + 4;
        let shapeType = buffer.readIntLE(byteRead, 4);
        byteRead = byteRead + 4;
        if (shapeType == shapefile_1.ShapeType.NullShape) {
            return new shapefile_1.NullShape(recordNumber, contentLength, shapeType);
        }
        else if (shapeType == shapefile_1.ShapeType.Polygon) {
            let xmin = buffer.readDoubleLE(byteRead);
            byteRead = byteRead + 8;
            let ymin = buffer.readDoubleLE(byteRead);
            byteRead = byteRead + 8;
            let xmax = buffer.readDoubleLE(byteRead);
            byteRead = byteRead + 8;
            let ymax = buffer.readDoubleLE(byteRead);
            byteRead = byteRead + 8;
            let box = new Array();
            box.push(xmin);
            box.push(ymin);
            box.push(xmax);
            box.push(ymax);
            let noOfParts = buffer.readIntLE(byteRead, 4);
            byteRead = byteRead + 4;
            let noOfPoints = buffer.readIntLE(byteRead, 4);
            byteRead = byteRead + 4;
            let polygon = new shapefile_1.Polygon(recordNumber, contentLength, shapeType, noOfParts, noOfPoints, box);
            let partStartingIndexList = new Array();
            for (var i = 0; i < noOfParts; i++) {
                let partStartingIndex = buffer.readIntLE(byteRead, 4);
                byteRead = byteRead + 4;
                partStartingIndexList.push(partStartingIndex);
            }
            let ring = new shapefile_1.Part();
            for (var i = 0, j = 1; i < noOfPoints; i++) {
                if (i == partStartingIndexList[j]) {
                    polygon.parts.push(ring);
                    ring = new shapefile_1.Part();
                    j += 1;
                }
                let x = buffer.readDoubleLE(byteRead);
                byteRead = byteRead + 8;
                let y = buffer.readDoubleLE(byteRead);
                byteRead = byteRead + 8;
                ring.coordinates.push(new shapefile_1.Coordinate(x, y));
            }
            if (ring) {
                polygon.parts.push(ring);
            }
            return polygon;
        }
        else {
            throw new SyntaxError("Invalid shape file");
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
    static parse(shpFileBuffer) {
        {
            try {
                let byteRead = 0;
                let fileSize = shpFileBuffer.byteLength;
                let fileHeader = ShapeFileHelpers.getShapeFileHeader(shpFileBuffer);
                byteRead = fileHeader.headerSize;
                let shapeFile = new shapefile_1.ShapeFile(fileHeader);
                switch (fileHeader.shapeType) {
                    case shapefile_1.ShapeType.NullShape:
                        ShapeFileHelpers.getNullShapes(shapeFile, shpFileBuffer, byteRead, fileSize);
                        break;
                    case shapefile_1.ShapeType.Point:
                        ShapeFileHelpers.getPointShapes(shapeFile, shpFileBuffer, byteRead, fileSize);
                        break;
                    case shapefile_1.ShapeType.MultiPoint:
                        ShapeFileHelpers.getMultiPointShapes(shapeFile, shpFileBuffer, byteRead, fileSize);
                        break;
                    case shapefile_1.ShapeType.PolyLine:
                        ShapeFileHelpers.getPolyLineShapes(shapeFile, shpFileBuffer, byteRead, fileSize);
                        break;
                    case shapefile_1.ShapeType.Polygon:
                        ShapeFileHelpers.getPolygonShapes(shapeFile, shpFileBuffer, byteRead, fileSize);
                        break;
                    default:
                        throw new SyntaxError("This shape file contains unsupported geometries.");
                }
                // console.log(shapeFile);
                return shapeFile;
            }
            catch (error) {
                throw error;
            }
        }
    }
}
ShapeFileHelpers.recordHeaderSize = 8;
exports.ShapeFileHelpers = ShapeFileHelpers;
