export enum ShapeType {
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
    MultiPatch = 31,
}
export class ShapeFile {
    readonly shapeFileHeader: ShapeFileHeader;
    readonly ShapeRecords: Array<ShapeRecord>;

    constructor(shapeFileHeader: ShapeFileHeader) {
        this.shapeFileHeader = shapeFileHeader;
        this.ShapeRecords = new Array<ShapeRecord>();
    }
}
export class ShapeFileHeader {
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

    constructor(fileCode: number, fileLength: number, version: number, shapeType: number, xMin: number, yMin: number, xMax: number, yMax: number, zMin: number, zMax: number, mMin: number, mMax: number) {
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
export abstract class ShapeRecord {
    readonly recordNumber: number;
    readonly contentLength: number;
    shapeType: ShapeType;
    constructor(recordNumber: number, contentLength: number, shapeType: number) {
        this.recordNumber = recordNumber;
        this.contentLength = contentLength * 2 + 8;
        this.shapeType = shapeType;
    }
}
export class Point extends ShapeRecord {
    x: number;
    y: number;
    constructor(recordNumber: number, contentLength: number, shapeType: number, x: number, y: number) {
        super(recordNumber, contentLength, shapeType);
        this.x = x;
        this.y = y;
    }
}
