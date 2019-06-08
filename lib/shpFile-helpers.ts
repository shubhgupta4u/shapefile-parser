import { ShapeFileHeader, ShapeType, ShapeFile, Point, MultiPoint, Coordinate, PolyLine, Polygon, Part, NullShape, PointM, PointZ, PolyLineM, PartM, CoordinateM, PolygonM, MultiPointM } from "./models/shapefile";

export abstract class ShapeFileHelpers {
   private static readonly recordHeaderSize: number = 8;
   private static getNullShapes(shapeFile: ShapeFile, buffer: Buffer, byteRead: number, fileSize: number) {
      while (byteRead < fileSize) {
         let nullShape: NullShape = ShapeFileHelpers.readNextNullShape(shapeFile, buffer, byteRead, fileSize);
         shapeFile.ShapeRecords.push(nullShape);
         byteRead = byteRead + nullShape.contentLength + ShapeFileHelpers.recordHeaderSize;;
      }
   }
   private static readNextNullShape(shapeFile: ShapeFile, buffer: Buffer, byteRead: number, fileSize: number): NullShape {

      let recordNumber: number = buffer.readIntBE(byteRead, 4);
      byteRead = byteRead + 4;
      let contentLength: number = buffer.readIntBE(byteRead, 4);
      byteRead = byteRead + 4;
      let shapeType: number = buffer.readIntLE(byteRead, 4);
      byteRead = byteRead + 4;
      return new NullShape(recordNumber, contentLength, shapeType);
   }
   private static getPointShapes(shapeFile: ShapeFile, buffer: Buffer, byteRead: number, fileSize: number) {
      try {
         while (byteRead < fileSize) {
            let point: Point | NullShape = ShapeFileHelpers.readNextPointShape(shapeFile, buffer, byteRead, fileSize);
            shapeFile.ShapeRecords.push(point);
            byteRead = byteRead + point.contentLength + ShapeFileHelpers.recordHeaderSize;
         }
      }
      catch (error) {
         throw error;
      }
   }
   private static readNextPointShape(shapeFile: ShapeFile, buffer: Buffer, byteRead: number, fileSize: number): Point | NullShape {
      let recordNumber: number = buffer.readIntBE(byteRead, 4);
      byteRead = byteRead + 4;
      let contentLength: number = buffer.readIntBE(byteRead, 4);
      byteRead = byteRead + 4;
      let shapeType: number = buffer.readIntLE(byteRead, 4);
      byteRead = byteRead + 4;
      if (shapeType == ShapeType.NullShape) {
         return new NullShape(recordNumber, contentLength, shapeType);
      } else if (shapeType == ShapeType.Point) {
         let x: number = buffer.readDoubleLE(byteRead);
         byteRead = byteRead + 8;
         let y: number = buffer.readDoubleLE(byteRead);
         byteRead = byteRead + 8;
         return new Point(recordNumber, contentLength, shapeType, x, y);
      }
      else {
         throw new SyntaxError("Invalid shape file");
      }
   }
   private static getMultiPointShapes(shapeFile: ShapeFile, buffer: Buffer, byteRead: number, fileSize: number) {
      try {
         while (byteRead < fileSize) {
            let multiPoint: MultiPoint | NullShape = ShapeFileHelpers.readNextMultiPointShape(shapeFile, buffer, byteRead, fileSize);
            shapeFile.ShapeRecords.push(multiPoint);
            byteRead = byteRead + multiPoint.contentLength + ShapeFileHelpers.recordHeaderSize;
         }
      }
      catch (error) {
         throw error;
      }
   }
   private static readNextMultiPointShape(shapeFile: ShapeFile, buffer: Buffer, byteRead: number, fileSize: number): MultiPoint | NullShape {
      let recordNumber: number = buffer.readIntBE(byteRead, 4);
      byteRead = byteRead + 4;
      let contentLength: number = buffer.readIntBE(byteRead, 4);
      byteRead = byteRead + 4;
      let shapeType: number = buffer.readIntLE(byteRead, 4);
      byteRead = byteRead + 4;
      if (shapeType == ShapeType.NullShape) {
         return new NullShape(recordNumber, contentLength, shapeType);
      }
      else if (shapeType == ShapeType.MultiPoint) {
         let xmin: number = buffer.readDoubleLE(byteRead);
         byteRead = byteRead + 8;
         let ymin: number = buffer.readDoubleLE(byteRead);
         byteRead = byteRead + 8;
         let xmax: number = buffer.readDoubleLE(byteRead);
         byteRead = byteRead + 8;
         let ymax: number = buffer.readDoubleLE(byteRead);
         byteRead = byteRead + 8;
         let box: Array<number> = new Array<number>();
         box.push(xmin);
         box.push(ymin);
         box.push(xmax);
         box.push(ymax);
         let noOfPoints: number = buffer.readIntLE(byteRead, 4);
         byteRead = byteRead + 4;
         let multiPoint: MultiPoint = new MultiPoint(recordNumber, contentLength, shapeType, noOfPoints, box);
         for (var i = 0; i < noOfPoints; i++) {
            let x: number = buffer.readDoubleLE(byteRead);
            byteRead = byteRead + 8;
            let y: number = buffer.readDoubleLE(byteRead);
            byteRead = byteRead + 8;
            multiPoint.coordinates.push(new Coordinate(x, y));
         }
         return multiPoint;
      } else {
         throw new SyntaxError("Invalid shape file");
      }
   }
   private static getPolyLineShapes(shapeFile: ShapeFile, buffer: Buffer, byteRead: number, fileSize: number) {
      try {
         while (byteRead < fileSize) {
            let polyLine: PolyLine | NullShape = ShapeFileHelpers.readNextPolyLineShape(shapeFile, buffer, byteRead, fileSize);
            shapeFile.ShapeRecords.push(polyLine);
            byteRead = byteRead + polyLine.contentLength + ShapeFileHelpers.recordHeaderSize;
         }
      }
      catch (error) {
         throw error;
      }
   }
   private static readNextPolyLineShape(shapeFile: ShapeFile, buffer: Buffer, byteRead: number, fileSize: number): PolyLine | NullShape {
      let recordNumber: number = buffer.readIntBE(byteRead, 4);
      byteRead = byteRead + 4;
      let contentLength: number = buffer.readIntBE(byteRead, 4);
      byteRead = byteRead + 4;
      let shapeType: number = buffer.readIntLE(byteRead, 4);
      byteRead = byteRead + 4;
      if (shapeType == ShapeType.NullShape) {
         return new NullShape(recordNumber, contentLength, shapeType);
      }
      else if (shapeType == ShapeType.PolyLine) {
         let xmin: number = buffer.readDoubleLE(byteRead);
         byteRead = byteRead + 8;
         let ymin: number = buffer.readDoubleLE(byteRead);
         byteRead = byteRead + 8;
         let xmax: number = buffer.readDoubleLE(byteRead);
         byteRead = byteRead + 8;
         let ymax: number = buffer.readDoubleLE(byteRead);
         byteRead = byteRead + 8;
         let box: Array<number> = new Array<number>();
         box.push(xmin);
         box.push(ymin);
         box.push(xmax);
         box.push(ymax);
         let noOfParts: number = buffer.readIntLE(byteRead, 4);
         byteRead = byteRead + 4;
         let noOfPoints: number = buffer.readIntLE(byteRead, 4);
         byteRead = byteRead + 4;
         let polyLine: PolyLine = new PolyLine(recordNumber, contentLength, shapeType, noOfParts, noOfPoints, box);
         let partStartingIndexList: Array<Number> = new Array<Number>();
         for (var i = 0; i < noOfParts; i++) {
            let partStartingIndex: number = buffer.readIntLE(byteRead, 4);
            byteRead = byteRead + 4;
            partStartingIndexList.push(partStartingIndex);
         }
         let line: Part = new Part();
         for (var i = 0, j = 1; i < noOfPoints; i++) {
            if (i == partStartingIndexList[j]) {
               polyLine.parts.push(line);
               line = new Part();
               j += 1;
            }
            let x: number = buffer.readDoubleLE(byteRead);
            byteRead = byteRead + 8;
            let y: number = buffer.readDoubleLE(byteRead);
            byteRead = byteRead + 8;
            line.coordinates.push(new Coordinate(x, y));
         }
         if (line) {
            polyLine.parts.push(line);
         }
         return polyLine;
      } else {
         throw new SyntaxError("Invalid shape file");
      }
   }
   private static getPolygonShapes(shapeFile: ShapeFile, buffer: Buffer, byteRead: number, fileSize: number) {
      try {
         while (byteRead < fileSize) {
            let polygon: Polygon | NullShape = ShapeFileHelpers.readNextPolygonShape(shapeFile, buffer, byteRead, fileSize);
            shapeFile.ShapeRecords.push(polygon);
            byteRead = byteRead + polygon.contentLength + ShapeFileHelpers.recordHeaderSize;
         }
      }
      catch (error) {
         throw error;
      }
   }
   private static readNextPolygonShape(shapeFile: ShapeFile, buffer: Buffer, byteRead: number, fileSize: number): Polygon | NullShape {
      let recordNumber: number = buffer.readIntBE(byteRead, 4);
      byteRead = byteRead + 4;
      let contentLength: number = buffer.readIntBE(byteRead, 4);
      byteRead = byteRead + 4;
      let shapeType: number = buffer.readIntLE(byteRead, 4);
      byteRead = byteRead + 4;
      if (shapeType == ShapeType.NullShape) {
         return new NullShape(recordNumber, contentLength, shapeType);
      }
      else if (shapeType == ShapeType.Polygon) {
         let xmin: number = buffer.readDoubleLE(byteRead);
         byteRead = byteRead + 8;
         let ymin: number = buffer.readDoubleLE(byteRead);
         byteRead = byteRead + 8;
         let xmax: number = buffer.readDoubleLE(byteRead);
         byteRead = byteRead + 8;
         let ymax: number = buffer.readDoubleLE(byteRead);
         byteRead = byteRead + 8;
         let box: Array<number> = new Array<number>();
         box.push(xmin);
         box.push(ymin);
         box.push(xmax);
         box.push(ymax);
         let noOfParts: number = buffer.readIntLE(byteRead, 4);
         byteRead = byteRead + 4;
         let noOfPoints: number = buffer.readIntLE(byteRead, 4);
         byteRead = byteRead + 4;
         let polygon: Polygon = new Polygon(recordNumber, contentLength, shapeType, noOfParts, noOfPoints, box);
         let partStartingIndexList: Array<Number> = new Array<Number>();
         for (var i = 0; i < noOfParts; i++) {
            let partStartingIndex: number = buffer.readIntLE(byteRead, 4);
            byteRead = byteRead + 4;
            partStartingIndexList.push(partStartingIndex);
         }
         let ring: Part = new Part();
         for (var i = 0, j = 1; i < noOfPoints; i++) {
            if (i == partStartingIndexList[j]) {
               polygon.parts.push(ring);
               ring = new Part();
               j += 1;
            }
            let x: number = buffer.readDoubleLE(byteRead);
            byteRead = byteRead + 8;
            let y: number = buffer.readDoubleLE(byteRead);
            byteRead = byteRead + 8;
            ring.coordinates.push(new Coordinate(x, y));
         }
         if (ring) {
            polygon.parts.push(ring);
         }
         return polygon;
      } else {
         throw new SyntaxError("Invalid shape file");
      }
   }
   private static getPointMShapes(shapeFile: ShapeFile, buffer: Buffer, byteRead: number, fileSize: number) {
      try {
         while (byteRead < fileSize) {
            let point: PointM | NullShape = ShapeFileHelpers.readNextPointMShape(shapeFile, buffer, byteRead, fileSize);
            shapeFile.ShapeRecords.push(point);
            byteRead = byteRead + point.contentLength + ShapeFileHelpers.recordHeaderSize;
         }
      }
      catch (error) {
         throw error;
      }
   }
   private static readNextPointMShape(shapeFile: ShapeFile, buffer: Buffer, byteRead: number, fileSize: number): PointM | NullShape {
      let recordNumber: number = buffer.readIntBE(byteRead, 4);
      byteRead = byteRead + 4;
      let contentLength: number = buffer.readIntBE(byteRead, 4);
      byteRead = byteRead + 4;
      let shapeType: number = buffer.readIntLE(byteRead, 4);
      byteRead = byteRead + 4;
      if (shapeType == ShapeType.NullShape) {
         return new NullShape(recordNumber, contentLength, shapeType);
      } else if (shapeType == ShapeType.PointM) {
         let x: number = buffer.readDoubleLE(byteRead);
         byteRead = byteRead + 8;
         let y: number = buffer.readDoubleLE(byteRead);
         byteRead = byteRead + 8;
         let m: number | null = buffer.readDoubleLE(byteRead);
         byteRead = byteRead + 8;
         if (m < -10) {
            m = null;
         }
         return new PointM(recordNumber, contentLength, shapeType, x, y, m);
      }
      else {
         throw new SyntaxError("Invalid shape file");
      }
   }
   private static getMultiPointMShapes(shapeFile: ShapeFile, buffer: Buffer, byteRead: number, fileSize: number) {
      try {
         while (byteRead < fileSize) {
            let multiPoint: MultiPointM | NullShape = ShapeFileHelpers.readNextMultiMPointShape(shapeFile, buffer, byteRead, fileSize);
            shapeFile.ShapeRecords.push(multiPoint);
            byteRead = byteRead + multiPoint.contentLength + ShapeFileHelpers.recordHeaderSize;
         }
      }
      catch (error) {
         throw error;
      }
   }
   private static readNextMultiMPointShape(shapeFile: ShapeFile, buffer: Buffer, byteRead: number, fileSize: number): MultiPointM | NullShape {
      let recordNumber: number = buffer.readIntBE(byteRead, 4);
      byteRead = byteRead + 4;
      let contentLength: number = buffer.readIntBE(byteRead, 4);
      byteRead = byteRead + 4;
      let shapeType: number = buffer.readIntLE(byteRead, 4);
      byteRead = byteRead + 4;
      if (shapeType == ShapeType.NullShape) {
         return new NullShape(recordNumber, contentLength, shapeType);
      }
      else if (shapeType == ShapeType.MultiPointM) {
         let xmin: number = buffer.readDoubleLE(byteRead);
         byteRead = byteRead + 8;
         let ymin: number = buffer.readDoubleLE(byteRead);
         byteRead = byteRead + 8;
         let xmax: number = buffer.readDoubleLE(byteRead);
         byteRead = byteRead + 8;
         let ymax: number = buffer.readDoubleLE(byteRead);
         byteRead = byteRead + 8;
         let box: Array<number> = new Array<number>();
         box.push(xmin);
         box.push(ymin);
         box.push(xmax);
         box.push(ymax);
         let noOfPoints: number = buffer.readIntLE(byteRead, 4);
         byteRead = byteRead + 4;

         let points: Array<Coordinate> = new Array<Coordinate>();
         for (var i = 0; i < noOfPoints; i++) {
            let x: number = buffer.readDoubleLE(byteRead);
            byteRead = byteRead + 8;
            let y: number = buffer.readDoubleLE(byteRead);
            byteRead = byteRead + 8;
            points.push(new Coordinate(x, y));
         }

         let mMin: number | null = buffer.readDoubleLE(byteRead);
         byteRead = byteRead + 8;
         let mMax: number | null = buffer.readDoubleLE(byteRead);
         byteRead = byteRead + 8;
         if (mMin < -10) { mMin = null; }
         if (mMax < -10) { mMax = null; }
         let pointsM: Array<number> = new Array<number>();
         for (var i = 0; i < noOfPoints; i++) {
            let m: number = buffer.readDoubleLE(byteRead);
            byteRead = byteRead + 8;
            pointsM.push(m);
         }

         let multiPoint: MultiPointM = new MultiPointM(recordNumber, contentLength, shapeType, noOfPoints, box, mMin, mMax);
         for (var i = 0; i < points.length; i++) {
            multiPoint.coordinatesM.push(new CoordinateM(points[i].x, points[i].y, pointsM[i]));
         }
         return multiPoint;
      } else {
         throw new SyntaxError("Invalid shape file");
      }
   }
   private static getPolyLineMShapes(shapeFile: ShapeFile, buffer: Buffer, byteRead: number, fileSize: number) {
      try {
         while (byteRead < fileSize) {
            let polyLine: PolyLineM | NullShape = ShapeFileHelpers.readNextPolyLineMShape(shapeFile, buffer, byteRead, fileSize);
            shapeFile.ShapeRecords.push(polyLine);
            byteRead = byteRead + polyLine.contentLength + ShapeFileHelpers.recordHeaderSize;
         }
      }
      catch (error) {
         throw error;
      }
   }
   private static readNextPolyLineMShape(shapeFile: ShapeFile, buffer: Buffer, byteRead: number, fileSize: number): PolyLineM | NullShape {
      let recordNumber: number = buffer.readIntBE(byteRead, 4);
      byteRead = byteRead + 4;
      let contentLength: number = buffer.readIntBE(byteRead, 4);
      byteRead = byteRead + 4;
      let shapeType: number = buffer.readIntLE(byteRead, 4);
      byteRead = byteRead + 4;
      if (shapeType == ShapeType.NullShape) {
         return new NullShape(recordNumber, contentLength, shapeType);
      }
      else if (shapeType == ShapeType.PolyLineM) {
         let xmin: number = buffer.readDoubleLE(byteRead);
         byteRead = byteRead + 8;
         let ymin: number = buffer.readDoubleLE(byteRead);
         byteRead = byteRead + 8;
         let xmax: number = buffer.readDoubleLE(byteRead);
         byteRead = byteRead + 8;
         let ymax: number = buffer.readDoubleLE(byteRead);
         byteRead = byteRead + 8;
         let box: Array<number> = new Array<number>();
         box.push(xmin);
         box.push(ymin);
         box.push(xmax);
         box.push(ymax);
         let noOfParts: number = buffer.readIntLE(byteRead, 4);
         byteRead = byteRead + 4;
         let noOfPoints: number = buffer.readIntLE(byteRead, 4);
         byteRead = byteRead + 4;


         let partStartingIndexList: Array<Number> = new Array<Number>();
         for (var i = 0; i < noOfParts; i++) {
            let partStartingIndex: number = buffer.readIntLE(byteRead, 4);
            byteRead = byteRead + 4;
            partStartingIndexList.push(partStartingIndex);
         }

         let points: Array<Coordinate> = new Array<Coordinate>();
         for (var i = 0; i < noOfPoints; i++) {
            let x: number = buffer.readDoubleLE(byteRead);
            byteRead = byteRead + 8;
            let y: number = buffer.readDoubleLE(byteRead);
            byteRead = byteRead + 8;
            points.push(new Coordinate(x, y));
         }

         let mMin: number | null = buffer.readDoubleLE(byteRead);
         byteRead = byteRead + 8;
         let mMax: number | null = buffer.readDoubleLE(byteRead);
         byteRead = byteRead + 8;
         if (mMin < -10) { mMin = null; }
         if (mMax < -10) { mMax = null; }
         let pointsM: Array<number> = new Array<number>();
         for (var i = 0; i < noOfPoints; i++) {
            let m: number = buffer.readDoubleLE(byteRead);
            byteRead = byteRead + 8;
            pointsM.push(m);
         }
         let polyLine: PolyLineM = new PolyLineM(recordNumber, contentLength, shapeType, noOfParts, noOfPoints, box, mMin, mMax);

         let line: PartM = new PartM();
         for (var i = 0, j = 1; i < points.length; i++) {
            if (i == partStartingIndexList[j]) {
               polyLine.parts.push(line);
               line = new PartM();
               j += 1;
            }
            line.coordinatesM.push(new CoordinateM(points[i].x, points[i].y, pointsM[i]));
         }
         if (line) {
            polyLine.parts.push(line);
         }
         return polyLine;
      } else {
         throw new SyntaxError("Invalid shape file");
      }
   }
   private static getPolygonMShapes(shapeFile: ShapeFile, buffer: Buffer, byteRead: number, fileSize: number) {
      try {
         while (byteRead < fileSize) {
            let polygon: PolygonM | NullShape = ShapeFileHelpers.readNextPolygonMShape(shapeFile, buffer, byteRead, fileSize);
            shapeFile.ShapeRecords.push(polygon);
            byteRead = byteRead + polygon.contentLength + ShapeFileHelpers.recordHeaderSize;
         }
      }
      catch (error) {
         throw error;
      }
   }
   private static readNextPolygonMShape(shapeFile: ShapeFile, buffer: Buffer, byteRead: number, fileSize: number): PolygonM | NullShape {
      let recordNumber: number = buffer.readIntBE(byteRead, 4);
      byteRead = byteRead + 4;
      let contentLength: number = buffer.readIntBE(byteRead, 4);
      byteRead = byteRead + 4;
      let shapeType: number = buffer.readIntLE(byteRead, 4);
      byteRead = byteRead + 4;
      if (shapeType == ShapeType.NullShape) {
         return new NullShape(recordNumber, contentLength, shapeType);
      }
      else if (shapeType == ShapeType.PolygonM) {
         let xmin: number = buffer.readDoubleLE(byteRead);
         byteRead = byteRead + 8;
         let ymin: number = buffer.readDoubleLE(byteRead);
         byteRead = byteRead + 8;
         let xmax: number = buffer.readDoubleLE(byteRead);
         byteRead = byteRead + 8;
         let ymax: number = buffer.readDoubleLE(byteRead);
         byteRead = byteRead + 8;
         let box: Array<number> = new Array<number>();
         box.push(xmin);
         box.push(ymin);
         box.push(xmax);
         box.push(ymax);
         let noOfParts: number = buffer.readIntLE(byteRead, 4);
         byteRead = byteRead + 4;
         let noOfPoints: number = buffer.readIntLE(byteRead, 4);
         byteRead = byteRead + 4;


         let partStartingIndexList: Array<Number> = new Array<Number>();
         for (var i = 0; i < noOfParts; i++) {
            let partStartingIndex: number = buffer.readIntLE(byteRead, 4);
            byteRead = byteRead + 4;
            partStartingIndexList.push(partStartingIndex);
         }

         let points: Array<Coordinate> = new Array<Coordinate>();
         for (var i = 0; i < noOfPoints; i++) {
            let x: number = buffer.readDoubleLE(byteRead);
            byteRead = byteRead + 8;
            let y: number = buffer.readDoubleLE(byteRead);
            byteRead = byteRead + 8;
            points.push(new Coordinate(x, y));
         }

         let mMin: number | null = buffer.readDoubleLE(byteRead);
         byteRead = byteRead + 8;
         let mMax: number | null = buffer.readDoubleLE(byteRead);
         byteRead = byteRead + 8;
         if (mMin < -10) { mMin = null; }
         if (mMax < -10) { mMax = null; }
         let pointsM: Array<number> = new Array<number>();
         for (var i = 0; i < noOfPoints; i++) {
            let m: number = buffer.readDoubleLE(byteRead);
            byteRead = byteRead + 8;
            pointsM.push(m);
         }
         let polygon: PolygonM = new PolygonM(recordNumber, contentLength, shapeType, noOfParts, noOfPoints, box, mMin, mMax);

         let ring: PartM = new PartM();
         for (var i = 0, j = 1; i < points.length; i++) {
            if (i == partStartingIndexList[j]) {
               polygon.parts.push(ring);
               ring = new PartM();
               j += 1;
            }
            ring.coordinatesM.push(new CoordinateM(points[i].x, points[i].y, pointsM[i]));
         }
         if (ring) {
            polygon.parts.push(ring);
         }
         return polygon;
      } else {
         throw new SyntaxError("Invalid shape file");
      }
   }
   private static getPointZShapes(shapeFile: ShapeFile, buffer: Buffer, byteRead: number, fileSize: number) {
      try {
         while (byteRead < fileSize) {
            let point: PointZ | NullShape = ShapeFileHelpers.readNextPointZShape(shapeFile, buffer, byteRead, fileSize);
            shapeFile.ShapeRecords.push(point);
            byteRead = byteRead + point.contentLength + ShapeFileHelpers.recordHeaderSize;
         }
      }
      catch (error) {
         throw error;
      }
   }
   private static readNextPointZShape(shapeFile: ShapeFile, buffer: Buffer, byteRead: number, fileSize: number): PointZ | NullShape {
      let recordNumber: number = buffer.readIntBE(byteRead, 4);
      byteRead = byteRead + 4;
      let contentLength: number = buffer.readIntBE(byteRead, 4);
      byteRead = byteRead + 4;
      let shapeType: number = buffer.readIntLE(byteRead, 4);
      byteRead = byteRead + 4;
      if (shapeType == ShapeType.NullShape) {
         return new NullShape(recordNumber, contentLength, shapeType);
      } else if (shapeType == ShapeType.PointZ) {
         let x: number = buffer.readDoubleLE(byteRead);
         byteRead = byteRead + 8;
         let y: number = buffer.readDoubleLE(byteRead);
         byteRead = byteRead + 8;
         let z: number = buffer.readDoubleLE(byteRead);
         byteRead = byteRead + 8;
         let m: number | null = buffer.readDoubleLE(byteRead);
         byteRead = byteRead + 8;
         if (m < -10) {
            m = null;
         }
         return new PointZ(recordNumber, contentLength, shapeType, x, y, z, m);
      }
      else {
         throw new SyntaxError("Invalid shape file");
      }
   }
   private static getShapeFileHeader(buffer: Buffer): ShapeFileHeader {
      let fileCode: number = buffer.readIntBE(0, 4);
      let fileLength: number = buffer.readIntBE(24, 4);
      let version: number = buffer.readIntLE(28, 4);
      let shapeType: number = buffer.readIntLE(32, 4);
      let xMin: number = buffer.readDoubleLE(36);
      let yMin: number = buffer.readDoubleLE(44);
      let xMax: number = buffer.readDoubleLE(52);
      let yMax: number = buffer.readDoubleLE(60);
      let zMin: number = buffer.readDoubleLE(68);
      let zMax: number = buffer.readDoubleLE(76);
      let mMin: number = buffer.readDoubleLE(84);
      let mMax: number = buffer.readDoubleLE(92); mMin
      return new ShapeFileHeader(fileCode, fileLength, version, shapeType, xMin, yMin, xMax, yMax, zMin, zMax, mMin, mMax);
   }
   protected static parse(shpFileBuffer: Buffer): any {
      {
         try {
            let byteRead: number = 0;
            let fileSize: number = shpFileBuffer.byteLength;
            let fileHeader: ShapeFileHeader = ShapeFileHelpers.getShapeFileHeader(shpFileBuffer);

            byteRead = fileHeader.headerSize;
            let shapeFile: ShapeFile = new ShapeFile(fileHeader);
            switch (fileHeader.shapeType) {
               case ShapeType.NullShape:
                  ShapeFileHelpers.getNullShapes(shapeFile, shpFileBuffer, byteRead, fileSize);
                  break;
               case ShapeType.Point:
                  ShapeFileHelpers.getPointShapes(shapeFile, shpFileBuffer, byteRead, fileSize);
                  break;
               case ShapeType.MultiPoint:
                  ShapeFileHelpers.getMultiPointShapes(shapeFile, shpFileBuffer, byteRead, fileSize)
                  break;
               case ShapeType.PolyLine:
                  ShapeFileHelpers.getPolyLineShapes(shapeFile, shpFileBuffer, byteRead, fileSize)
                  break;
               case ShapeType.Polygon:
                  ShapeFileHelpers.getPolygonShapes(shapeFile, shpFileBuffer, byteRead, fileSize)
                  break;
               case ShapeType.PointM:
                  ShapeFileHelpers.getPointMShapes(shapeFile, shpFileBuffer, byteRead, fileSize);
                  break;
               case ShapeType.MultiPointM:
                     ShapeFileHelpers.getMultiPointMShapes(shapeFile, shpFileBuffer, byteRead, fileSize);
                     break;
               case ShapeType.PolyLineM:
                  ShapeFileHelpers.getPolyLineMShapes(shapeFile, shpFileBuffer, byteRead, fileSize);
                  break;
               case ShapeType.PolygonM:
                  ShapeFileHelpers.getPolygonMShapes(shapeFile, shpFileBuffer, byteRead, fileSize);
                  break;
               case ShapeType.PointZ:
                  ShapeFileHelpers.getPointZShapes(shapeFile, shpFileBuffer, byteRead, fileSize);
                  break;
               default:
                  throw new SyntaxError("This shape file contains unsupported geometries.");
            }
            // console.log(shapeFile);
            return shapeFile;
         } catch (error) {
            throw error;
         }
      }
   }
}

