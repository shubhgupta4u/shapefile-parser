export declare enum ShapeType {
    NullShape = 0,
    Point = 1,
    PolyLine = 3,
    Polygon = 5,
    MultiPoint = 8,
    PointZ = 11,
    PolyLineZ = 13,
    PolygonZ = 15,
    MultiPointZ = 18,
    PointM = 21,
    PolyLineM = 23,
    PolygonM = 25,
    MultiPointM = 28,
    MultiPatch = 31
}
export declare class ShapeFile {
    readonly shapeFileHeader: ShapeFileHeader;
    readonly ShapeRecords: Array<ShapeRecord>;
    constructor(shapeFileHeader: ShapeFileHeader);
    isValid(): boolean;
}
export declare class ShapeFileHeader {
    readonly fileCode: number;
    readonly fileLength: number;
    readonly version: number;
    readonly shapeType: ShapeType;
    readonly xMin: number;
    readonly yMin: number;
    readonly xMax: number;
    readonly yMax: number;
    readonly zMin: number;
    readonly zMax: number;
    readonly mMin: number;
    readonly mMax: number;
    readonly headerSize: number;
    constructor(fileCode: number, fileLength: number, version: number, shapeType: number, xMin: number, yMin: number, xMax: number, yMax: number, zMin: number, zMax: number, mMin: number, mMax: number);
}
export declare abstract class ShapeRecord {
    readonly recordNumber: number;
    readonly contentLength: number;
    readonly attributes: Array<Attribute>;
    readonly shapeType: ShapeType;
    constructor(recordNumber: number, contentLength: number, shapeType: number);
    getRecordSize(): number;
    abstract getContentSize(): number;
    abstract isValidShape(): boolean;
}
export declare class NullShape extends ShapeRecord {
    constructor(recordNumber: number, contentLength: number, shapeType: number);
    getContentSize(): number;
    isValidShape(): boolean;
}
export declare class Point extends ShapeRecord {
    readonly coordinate: Coordinate;
    constructor(recordNumber: number, contentLength: number, shapeType: number, x: number, y: number);
    getContentSize(): number;
    isValidShape(): boolean;
}
export declare class MultiPoint extends ShapeRecord {
    readonly boundingBox: BoundingBox | null;
    readonly numberOfPoints: number;
    readonly coordinates: Array<Coordinate>;
    constructor(recordNumber: number, contentLength: number, shapeType: number, numberOfPoints: number, boundingBox: number[]);
    getContentSize(): number;
    isValidShape(): boolean;
}
export declare class PolyLine extends ShapeRecord {
    readonly boundingBox: BoundingBox | null;
    readonly numberOfParts: number;
    readonly numberOfPoints: number;
    readonly parts: Array<Part>;
    constructor(recordNumber: number, contentLength: number, shapeType: number, numberOfParts: number, numberOfPoints: number, boundingBox: number[]);
    getContentSize(): number;
    isValidShape(): boolean;
}
export declare class Polygon extends ShapeRecord {
    readonly boundingBox: BoundingBox | null;
    readonly numberOfParts: number;
    readonly numberOfPoints: number;
    readonly parts: Array<Part>;
    constructor(recordNumber: number, contentLength: number, shapeType: number, numberOfParts: number, numberOfPoints: number, boundingBox: number[]);
    getContentSize(): number;
    isValidShape(): boolean;
}
export declare class PointM extends ShapeRecord {
    readonly coordinateM: CoordinateM;
    constructor(recordNumber: number, contentLength: number, shapeType: number, x: number, y: number, m: number | null);
    getContentSize(): number;
    isValidShape(): boolean;
}
export declare class MultiPointM extends ShapeRecord {
    readonly boundingBox: BoundingBox | null;
    readonly numberOfPoints: number;
    readonly coordinatesM: Array<CoordinateM>;
    readonly mMin: number | null;
    readonly mMax: number | null;
    constructor(recordNumber: number, contentLength: number, shapeType: number, numberOfPoints: number, boundingBox: number[], mMin: number | null, mMax: number | null);
    getContentSize(): number;
    isValidShape(): boolean;
}
export declare class PolyLineM extends ShapeRecord {
    readonly boundingBox: BoundingBox | null;
    readonly numberOfParts: number;
    readonly numberOfPoints: number;
    readonly mMin: number | null;
    readonly mMax: number | null;
    readonly parts: Array<PartM>;
    constructor(recordNumber: number, contentLength: number, shapeType: number, numberOfParts: number, numberOfPoints: number, boundingBox: number[], mMin: number | null, mMax: number | null);
    getContentSize(): number;
    isValidShape(): boolean;
}
export declare class PolygonM extends ShapeRecord {
    readonly boundingBox: BoundingBox | null;
    readonly numberOfParts: number;
    readonly numberOfPoints: number;
    readonly mMin: number | null;
    readonly mMax: number | null;
    readonly parts: Array<PartM>;
    constructor(recordNumber: number, contentLength: number, shapeType: number, numberOfParts: number, numberOfPoints: number, boundingBox: number[], mMin: number | null, mMax: number | null);
    getContentSize(): number;
    isValidShape(): boolean;
}
export declare class PointZ extends ShapeRecord {
    readonly coordinateZ: CoordinateZ;
    constructor(recordNumber: number, contentLength: number, shapeType: number, x: number, y: number, z: number, m: number | null);
    getContentSize(): number;
    isValidShape(): boolean;
}
export declare class Part {
    readonly coordinates: Array<Coordinate>;
    constructor();
}
export declare class PartM {
    readonly coordinatesM: Array<CoordinateM>;
    constructor();
}
export declare class BoundingBox {
    southwest: Coordinate;
    northeast: Coordinate;
    constructor(southwest: Coordinate, northeast: Coordinate);
}
export declare class Coordinate {
    /**
    * Latitude Value
    */
    readonly x: number;
    /**
    * Longitude Value
    */
    readonly y: number;
    constructor(x: number, y: number);
}
export declare class CoordinateM extends Coordinate {
    /**
    * Routing/Offset  Value
    */
    readonly m: number | null;
    constructor(x: number, y: number, m: number | null);
}
export declare class CoordinateZ extends CoordinateM {
    /**
    * Elevation/GPS Height   Value
    */
    readonly z: number;
    constructor(x: number, y: number, z: number, m: number | null);
}
export declare class Attribute {
    readonly key: string;
    readonly value: string;
    constructor(key: string, value: string);
}
export declare abstract class ShapeFileFieldSize {
    static readonly boundingBox: number;
    static readonly shapeType: number;
    static readonly NumOfPart: number;
    static readonly NumOfPoint: number;
    static readonly point: number;
    static readonly pointM: number;
    static readonly pointZ: number;
    static readonly rangeM: number;
    static readonly part: number;
}
