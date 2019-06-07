export declare enum ShapeType {
    NullShape = 0,
    Point = 1,
    Polyline = 3,
    Polygon = 5,
    MultiPoint = 8,
    PointZ = 11,
    PolylineZ = 13,
    PolygonZ = 15,
    MultiPointZ = 18,
    PointM = 21,
    PolylineM = 23,
    PolygonM = 25,
    MultiPointM = 28,
    MultiPatch = 31
}
export declare class ShapeFile {
    readonly shapeFileHeader: ShapeFileHeader;
    readonly ShapeRecords: Array<ShapeRecord>;
    constructor(shapeFileHeader: ShapeFileHeader);
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
    constructor(fileCode: number, fileLength: number, version: number, shapeType: number, xMin: number, yMin: number, xMax: number, yMax: number, zMin: number, zMax: number, mMin: number, mMax: number);
}
export declare abstract class ShapeRecord {
    readonly recordNumber: number;
    readonly contentLength: number;
    shapeType: ShapeType;
    constructor(recordNumber: number, contentLength: number, shapeType: number);
}
export declare class Point extends ShapeRecord {
    x: number;
    y: number;
    constructor(recordNumber: number, contentLength: number, shapeType: number, x: number, y: number);
}
