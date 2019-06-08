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
export declare class Part {
    readonly coordinates: Array<Coordinate>;
    constructor();
}
export declare class BoundingBox {
    southwest: Coordinate;
    northeast: Coordinate;
    constructor(southwest: Coordinate, northeast: Coordinate);
}
export declare class Coordinate {
    readonly lat: number;
    readonly lng: number;
    constructor(lng: number, lat: number);
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
    static readonly part: number;
}
