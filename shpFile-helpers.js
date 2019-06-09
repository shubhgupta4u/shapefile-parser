"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shapefile_1 = require("./models/shapefile");
const dbf_1 = require("dbf-reader/dbf");
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
    static getPointMShapes(shapeFile, buffer, byteRead, fileSize) {
        try {
            while (byteRead < fileSize) {
                let point = ShapeFileHelpers.readNextPointMShape(shapeFile, buffer, byteRead, fileSize);
                shapeFile.ShapeRecords.push(point);
                byteRead = byteRead + point.contentLength + ShapeFileHelpers.recordHeaderSize;
            }
        }
        catch (error) {
            throw error;
        }
    }
    static readNextPointMShape(shapeFile, buffer, byteRead, fileSize) {
        let recordNumber = buffer.readIntBE(byteRead, 4);
        byteRead = byteRead + 4;
        let contentLength = buffer.readIntBE(byteRead, 4);
        byteRead = byteRead + 4;
        let shapeType = buffer.readIntLE(byteRead, 4);
        byteRead = byteRead + 4;
        if (shapeType == shapefile_1.ShapeType.NullShape) {
            return new shapefile_1.NullShape(recordNumber, contentLength, shapeType);
        }
        else if (shapeType == shapefile_1.ShapeType.PointM) {
            let x = buffer.readDoubleLE(byteRead);
            byteRead = byteRead + 8;
            let y = buffer.readDoubleLE(byteRead);
            byteRead = byteRead + 8;
            let m = buffer.readDoubleLE(byteRead);
            byteRead = byteRead + 8;
            if (m < -10) {
                m = null;
            }
            return new shapefile_1.PointM(recordNumber, contentLength, shapeType, x, y, m);
        }
        else {
            throw new SyntaxError("Invalid shape file");
        }
    }
    static getMultiPointMShapes(shapeFile, buffer, byteRead, fileSize) {
        try {
            while (byteRead < fileSize) {
                let multiPoint = ShapeFileHelpers.readNextMultiMPointShape(shapeFile, buffer, byteRead, fileSize);
                shapeFile.ShapeRecords.push(multiPoint);
                byteRead = byteRead + multiPoint.contentLength + ShapeFileHelpers.recordHeaderSize;
            }
        }
        catch (error) {
            throw error;
        }
    }
    static readNextMultiMPointShape(shapeFile, buffer, byteRead, fileSize) {
        let recordNumber = buffer.readIntBE(byteRead, 4);
        byteRead = byteRead + 4;
        let contentLength = buffer.readIntBE(byteRead, 4);
        byteRead = byteRead + 4;
        let shapeType = buffer.readIntLE(byteRead, 4);
        byteRead = byteRead + 4;
        if (shapeType == shapefile_1.ShapeType.NullShape) {
            return new shapefile_1.NullShape(recordNumber, contentLength, shapeType);
        }
        else if (shapeType == shapefile_1.ShapeType.MultiPointM) {
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
            let points = new Array();
            for (var i = 0; i < noOfPoints; i++) {
                let x = buffer.readDoubleLE(byteRead);
                byteRead = byteRead + 8;
                let y = buffer.readDoubleLE(byteRead);
                byteRead = byteRead + 8;
                points.push(new shapefile_1.Coordinate(x, y));
            }
            let mMin = buffer.readDoubleLE(byteRead);
            byteRead = byteRead + 8;
            let mMax = buffer.readDoubleLE(byteRead);
            byteRead = byteRead + 8;
            if (mMin < -10) {
                mMin = null;
            }
            if (mMax < -10) {
                mMax = null;
            }
            let pointsM = new Array();
            for (var i = 0; i < noOfPoints; i++) {
                let m = buffer.readDoubleLE(byteRead);
                byteRead = byteRead + 8;
                pointsM.push(m);
            }
            let multiPoint = new shapefile_1.MultiPointM(recordNumber, contentLength, shapeType, noOfPoints, box, mMin, mMax);
            for (var i = 0; i < points.length; i++) {
                multiPoint.coordinatesM.push(new shapefile_1.CoordinateM(points[i].x, points[i].y, pointsM[i]));
            }
            return multiPoint;
        }
        else {
            throw new SyntaxError("Invalid shape file");
        }
    }
    static getPolyLineMShapes(shapeFile, buffer, byteRead, fileSize) {
        try {
            while (byteRead < fileSize) {
                let polyLine = ShapeFileHelpers.readNextPolyLineMShape(shapeFile, buffer, byteRead, fileSize);
                shapeFile.ShapeRecords.push(polyLine);
                byteRead = byteRead + polyLine.contentLength + ShapeFileHelpers.recordHeaderSize;
            }
        }
        catch (error) {
            throw error;
        }
    }
    static readNextPolyLineMShape(shapeFile, buffer, byteRead, fileSize) {
        let recordNumber = buffer.readIntBE(byteRead, 4);
        byteRead = byteRead + 4;
        let contentLength = buffer.readIntBE(byteRead, 4);
        byteRead = byteRead + 4;
        let shapeType = buffer.readIntLE(byteRead, 4);
        byteRead = byteRead + 4;
        if (shapeType == shapefile_1.ShapeType.NullShape) {
            return new shapefile_1.NullShape(recordNumber, contentLength, shapeType);
        }
        else if (shapeType == shapefile_1.ShapeType.PolyLineM) {
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
            let partStartingIndexList = new Array();
            for (var i = 0; i < noOfParts; i++) {
                let partStartingIndex = buffer.readIntLE(byteRead, 4);
                byteRead = byteRead + 4;
                partStartingIndexList.push(partStartingIndex);
            }
            let points = new Array();
            for (var i = 0; i < noOfPoints; i++) {
                let x = buffer.readDoubleLE(byteRead);
                byteRead = byteRead + 8;
                let y = buffer.readDoubleLE(byteRead);
                byteRead = byteRead + 8;
                points.push(new shapefile_1.Coordinate(x, y));
            }
            let mMin = buffer.readDoubleLE(byteRead);
            byteRead = byteRead + 8;
            let mMax = buffer.readDoubleLE(byteRead);
            byteRead = byteRead + 8;
            if (mMin < -10) {
                mMin = null;
            }
            if (mMax < -10) {
                mMax = null;
            }
            let pointsM = new Array();
            for (var i = 0; i < noOfPoints; i++) {
                let m = buffer.readDoubleLE(byteRead);
                byteRead = byteRead + 8;
                pointsM.push(m);
            }
            let polyLine = new shapefile_1.PolyLineM(recordNumber, contentLength, shapeType, noOfParts, noOfPoints, box, mMin, mMax);
            let line = new shapefile_1.PartM();
            for (var i = 0, j = 1; i < points.length; i++) {
                if (i == partStartingIndexList[j]) {
                    polyLine.parts.push(line);
                    line = new shapefile_1.PartM();
                    j += 1;
                }
                line.coordinatesM.push(new shapefile_1.CoordinateM(points[i].x, points[i].y, pointsM[i]));
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
    static getPolygonMShapes(shapeFile, buffer, byteRead, fileSize) {
        try {
            while (byteRead < fileSize) {
                let polygon = ShapeFileHelpers.readNextPolygonMShape(shapeFile, buffer, byteRead, fileSize);
                shapeFile.ShapeRecords.push(polygon);
                byteRead = byteRead + polygon.contentLength + ShapeFileHelpers.recordHeaderSize;
            }
        }
        catch (error) {
            throw error;
        }
    }
    static readNextPolygonMShape(shapeFile, buffer, byteRead, fileSize) {
        let recordNumber = buffer.readIntBE(byteRead, 4);
        byteRead = byteRead + 4;
        let contentLength = buffer.readIntBE(byteRead, 4);
        byteRead = byteRead + 4;
        let shapeType = buffer.readIntLE(byteRead, 4);
        byteRead = byteRead + 4;
        if (shapeType == shapefile_1.ShapeType.NullShape) {
            return new shapefile_1.NullShape(recordNumber, contentLength, shapeType);
        }
        else if (shapeType == shapefile_1.ShapeType.PolygonM) {
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
            let partStartingIndexList = new Array();
            for (var i = 0; i < noOfParts; i++) {
                let partStartingIndex = buffer.readIntLE(byteRead, 4);
                byteRead = byteRead + 4;
                partStartingIndexList.push(partStartingIndex);
            }
            let points = new Array();
            for (var i = 0; i < noOfPoints; i++) {
                let x = buffer.readDoubleLE(byteRead);
                byteRead = byteRead + 8;
                let y = buffer.readDoubleLE(byteRead);
                byteRead = byteRead + 8;
                points.push(new shapefile_1.Coordinate(x, y));
            }
            let mMin = buffer.readDoubleLE(byteRead);
            byteRead = byteRead + 8;
            let mMax = buffer.readDoubleLE(byteRead);
            byteRead = byteRead + 8;
            if (mMin < -10) {
                mMin = null;
            }
            if (mMax < -10) {
                mMax = null;
            }
            let pointsM = new Array();
            for (var i = 0; i < noOfPoints; i++) {
                let m = buffer.readDoubleLE(byteRead);
                byteRead = byteRead + 8;
                pointsM.push(m);
            }
            let polygon = new shapefile_1.PolygonM(recordNumber, contentLength, shapeType, noOfParts, noOfPoints, box, mMin, mMax);
            let ring = new shapefile_1.PartM();
            for (var i = 0, j = 1; i < points.length; i++) {
                if (i == partStartingIndexList[j]) {
                    polygon.parts.push(ring);
                    ring = new shapefile_1.PartM();
                    j += 1;
                }
                ring.coordinatesM.push(new shapefile_1.CoordinateM(points[i].x, points[i].y, pointsM[i]));
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
    static getPointZShapes(shapeFile, buffer, byteRead, fileSize) {
        try {
            while (byteRead < fileSize) {
                let point = ShapeFileHelpers.readNextPointZShape(shapeFile, buffer, byteRead, fileSize);
                shapeFile.ShapeRecords.push(point);
                byteRead = byteRead + point.contentLength + ShapeFileHelpers.recordHeaderSize;
            }
        }
        catch (error) {
            throw error;
        }
    }
    static readNextPointZShape(shapeFile, buffer, byteRead, fileSize) {
        let recordNumber = buffer.readIntBE(byteRead, 4);
        byteRead = byteRead + 4;
        let contentLength = buffer.readIntBE(byteRead, 4);
        byteRead = byteRead + 4;
        let shapeType = buffer.readIntLE(byteRead, 4);
        byteRead = byteRead + 4;
        if (shapeType == shapefile_1.ShapeType.NullShape) {
            return new shapefile_1.NullShape(recordNumber, contentLength, shapeType);
        }
        else if (shapeType == shapefile_1.ShapeType.PointZ) {
            let x = buffer.readDoubleLE(byteRead);
            byteRead = byteRead + 8;
            let y = buffer.readDoubleLE(byteRead);
            byteRead = byteRead + 8;
            let z = buffer.readDoubleLE(byteRead);
            byteRead = byteRead + 8;
            let m = buffer.readDoubleLE(byteRead);
            byteRead = byteRead + 8;
            if (m < -10) {
                m = null;
            }
            return new shapefile_1.PointZ(recordNumber, contentLength, shapeType, x, y, z, m);
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
    static parseShpAndDbf(shpFileBuffer, dbfFileBuffer) {
        try {
            let shapeFile = ShapeFileHelpers.parse(shpFileBuffer);
            let dbfFile = dbf_1.Dbf.read(dbfFileBuffer);
            if (shapeFile && shapeFile.ShapeRecords && shapeFile.ShapeRecords.length > 0
                && dbfFile && dbfFile.columns.length > 0 && dbfFile.rows.length > 0) {
                let index = 0;
                shapeFile.ShapeRecords.forEach((record) => {
                    let row = dbfFile.rows[index];
                    dbfFile.columns.forEach((c) => {
                        record.attributes.push(new shapefile_1.Attribute(c.name, row[c.name]));
                    });
                    index += 1;
                });
            }
            return shapeFile;
        }
        catch (error) {
            throw error;
        }
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
                    case shapefile_1.ShapeType.PointM:
                        ShapeFileHelpers.getPointMShapes(shapeFile, shpFileBuffer, byteRead, fileSize);
                        break;
                    case shapefile_1.ShapeType.MultiPointM:
                        ShapeFileHelpers.getMultiPointMShapes(shapeFile, shpFileBuffer, byteRead, fileSize);
                        break;
                    case shapefile_1.ShapeType.PolyLineM:
                        ShapeFileHelpers.getPolyLineMShapes(shapeFile, shpFileBuffer, byteRead, fileSize);
                        break;
                    case shapefile_1.ShapeType.PolygonM:
                        ShapeFileHelpers.getPolygonMShapes(shapeFile, shpFileBuffer, byteRead, fileSize);
                        break;
                    case shapefile_1.ShapeType.PointZ:
                        ShapeFileHelpers.getPointZShapes(shapeFile, shpFileBuffer, byteRead, fileSize);
                        break;
                    default:
                        throw new SyntaxError("This shape file contains unsupported geometries.");
                }
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
