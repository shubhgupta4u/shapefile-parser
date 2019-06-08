export enum ShapeType {
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
    MultiPatch = 31,
}
export class ShapeFile {
    readonly shapeFileHeader: ShapeFileHeader;
    readonly ShapeRecords: Array<ShapeRecord>;

    constructor(shapeFileHeader: ShapeFileHeader) {
        this.shapeFileHeader = shapeFileHeader;
        this.ShapeRecords = new Array<ShapeRecord>();
    }

    isValid(): boolean {
        let contentSize: number = 0;
        let isAllShapeRecordValid: boolean = true;
        this.ShapeRecords.forEach((record) => {
            contentSize = contentSize + record.getRecordSize();
            if (!record.isValidShape()) {
                isAllShapeRecordValid = false;
            }
        });
        return isAllShapeRecordValid && this.shapeFileHeader && this.shapeFileHeader.fileLength == (contentSize + this.shapeFileHeader.headerSize);
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
    readonly headerSize: number = 100;
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
    readonly attributes: Array<Attribute>;
    readonly shapeType: ShapeType;
    constructor(recordNumber: number, contentLength: number, shapeType: number) {
        this.recordNumber = recordNumber;
        this.contentLength = contentLength * 2;
        this.shapeType = shapeType;
        this.attributes = new Array<Attribute>();
    }
    getRecordSize(): number {
        return 8 + this.getContentSize();
    }
    abstract getContentSize(): number;
    abstract isValidShape(): boolean;
}
export class NullShape extends ShapeRecord {
    constructor(recordNumber: number, contentLength: number, shapeType: number) {
        super(recordNumber, contentLength, shapeType);
    }
    getContentSize(): number {
        return ShapeFileFieldSize.shapeType;
    }
    isValidShape() {
        return this.contentLength == this.getContentSize();
    }
}
export class Point extends ShapeRecord {
    readonly coordinate: Coordinate;
    constructor(recordNumber: number, contentLength: number, shapeType: number, x: number, y: number) {
        super(recordNumber, contentLength, shapeType);
        this.coordinate = new Coordinate(x, y);
    }
    getContentSize(): number {
        return ShapeFileFieldSize.shapeType + ShapeFileFieldSize.point;
    }
    isValidShape(): boolean {
        return this.contentLength == this.getContentSize();
    }
}
export class MultiPoint extends ShapeRecord {
    readonly boundingBox: BoundingBox | null;
    readonly numberOfPoints: number;
    readonly coordinates: Array<Coordinate>;

    constructor(recordNumber: number, contentLength: number, shapeType: number, numberOfPoints: number, boundingBox: number[]) {
        super(recordNumber, contentLength, shapeType);
        this.coordinates = new Array<Coordinate>();
        this.numberOfPoints = numberOfPoints;
        if (boundingBox && boundingBox.length == 4) {
            this.boundingBox = new BoundingBox(new Coordinate(boundingBox[0], boundingBox[1]), new Coordinate(boundingBox[2], boundingBox[3]));
        }
        else {
            this.boundingBox = null;
        }
    }
    getContentSize(): number {
        return ShapeFileFieldSize.shapeType + ShapeFileFieldSize.boundingBox + ShapeFileFieldSize.NumOfPoint + (this.numberOfPoints * ShapeFileFieldSize.point);
    }
    isValidShape(): boolean {
        return this.contentLength == this.getContentSize() && this.boundingBox instanceof BoundingBox && (this.numberOfPoints == this.coordinates.length);
    }
}
export class PolyLine extends ShapeRecord {
    readonly boundingBox: BoundingBox | null;
    readonly numberOfParts: number;
    readonly numberOfPoints: number;
    readonly parts: Array<Part>;

    constructor(recordNumber: number, contentLength: number, shapeType: number, numberOfParts: number, numberOfPoints: number, boundingBox: number[]) {
        super(recordNumber, contentLength, shapeType);
        this.parts = new Array<Part>();
        this.numberOfParts = numberOfParts;
        this.numberOfPoints = numberOfPoints;
        if (boundingBox && boundingBox.length == 4) {
            this.boundingBox = new BoundingBox(new Coordinate(boundingBox[0], boundingBox[1]), new Coordinate(boundingBox[2], boundingBox[3]));
        }
        else {
            this.boundingBox = null;
        }
    }
    getContentSize(): number {
        return ShapeFileFieldSize.shapeType + ShapeFileFieldSize.boundingBox + ShapeFileFieldSize.NumOfPart + ShapeFileFieldSize.NumOfPoint + (this.numberOfParts * ShapeFileFieldSize.part) + (this.numberOfPoints * ShapeFileFieldSize.point);
    }
    isValidShape(): boolean {
        let pointsCount: number = 0;
        this.parts.forEach((line) => {
            pointsCount = pointsCount + line.coordinates.length;
        })
        return this.contentLength == this.getContentSize() && this.boundingBox instanceof BoundingBox && (this.numberOfParts == this.parts.length) && (this.numberOfPoints == pointsCount);
    }
}
export class Polygon extends ShapeRecord {
    readonly boundingBox: BoundingBox | null;
    readonly numberOfParts: number;
    readonly numberOfPoints: number;
    readonly parts: Array<Part>;

    constructor(recordNumber: number, contentLength: number, shapeType: number, numberOfParts: number, numberOfPoints: number, boundingBox: number[]) {
        super(recordNumber, contentLength, shapeType);
        this.parts = new Array<Part>();
        this.numberOfParts = numberOfParts;
        this.numberOfPoints = numberOfPoints;
        if (boundingBox && boundingBox.length == 4) {
            this.boundingBox = new BoundingBox(new Coordinate(boundingBox[0], boundingBox[1]), new Coordinate(boundingBox[2], boundingBox[3]));
        }
        else {
            this.boundingBox = null;
        }
    }
    getContentSize(): number {
        return ShapeFileFieldSize.shapeType + ShapeFileFieldSize.boundingBox + ShapeFileFieldSize.NumOfPart + ShapeFileFieldSize.NumOfPoint + (this.numberOfParts * ShapeFileFieldSize.part) + (this.numberOfPoints * ShapeFileFieldSize.point);
    }
    isValidShape(): boolean {
        let pointsCount: number = 0;
        this.parts.forEach((line) => {
            pointsCount = pointsCount + line.coordinates.length;
        })
        return this.contentLength == this.getContentSize() && this.boundingBox instanceof BoundingBox && (this.numberOfParts == this.parts.length) && (this.numberOfPoints == pointsCount);
    }
}
export class PointM extends ShapeRecord {
    readonly coordinateM: CoordinateM;
    constructor(recordNumber: number, contentLength: number, shapeType: number, x: number, y: number, m: number | null) {
        super(recordNumber, contentLength, shapeType);
        this.coordinateM = new CoordinateM(x, y, m);
    }
    getContentSize(): number {
        return ShapeFileFieldSize.shapeType + ShapeFileFieldSize.pointM;
    }
    isValidShape(): boolean {
        return this.contentLength == this.getContentSize();
    }
}
export class MultiPointM extends ShapeRecord {
    readonly boundingBox: BoundingBox | null;
    readonly numberOfPoints: number;
    readonly coordinatesM: Array<CoordinateM>;
    readonly mMin: number | null;
    readonly mMax: number | null;

    constructor(recordNumber: number, contentLength: number, shapeType: number, numberOfPoints: number, boundingBox: number[], mMin: number | null, mMax: number | null) {
        super(recordNumber, contentLength, shapeType);
        this.coordinatesM = new Array<CoordinateM>();
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
    getContentSize(): number {
        return ShapeFileFieldSize.shapeType + ShapeFileFieldSize.boundingBox + ShapeFileFieldSize.NumOfPoint + (this.numberOfPoints * ShapeFileFieldSize.pointM) + ShapeFileFieldSize.rangeM;
    }
    isValidShape(): boolean {
        return this.contentLength == this.getContentSize() && this.boundingBox instanceof BoundingBox && (this.numberOfPoints == this.coordinatesM.length);
    }
}
export class PolyLineM extends ShapeRecord {
    readonly boundingBox: BoundingBox | null;
    readonly numberOfParts: number;
    readonly numberOfPoints: number;
    readonly mMin: number | null;
    readonly mMax: number | null;
    readonly parts: Array<PartM>;

    constructor(recordNumber: number, contentLength: number, shapeType: number, numberOfParts: number, numberOfPoints: number, boundingBox: number[], mMin: number | null, mMax: number | null) {
        super(recordNumber, contentLength, shapeType);
        this.parts = new Array<PartM>();
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
    getContentSize(): number {
        return ShapeFileFieldSize.shapeType + ShapeFileFieldSize.boundingBox + ShapeFileFieldSize.NumOfPart + ShapeFileFieldSize.NumOfPoint + (this.numberOfParts * ShapeFileFieldSize.part) + (this.numberOfPoints * ShapeFileFieldSize.pointM) + ShapeFileFieldSize.rangeM;
    }
    isValidShape(): boolean {
        let pointsCount: number = 0;
        this.parts.forEach((line) => {
            pointsCount = pointsCount + line.coordinatesM.length;
        })
        return this.contentLength == this.getContentSize() && this.boundingBox instanceof BoundingBox && (this.numberOfParts == this.parts.length) && (this.numberOfPoints == pointsCount);
    }
}
export class PolygonM extends ShapeRecord {
    readonly boundingBox: BoundingBox | null;
    readonly numberOfParts: number;
    readonly numberOfPoints: number;
    readonly mMin: number | null;
    readonly mMax: number | null;
    readonly parts: Array<PartM>;

    constructor(recordNumber: number, contentLength: number, shapeType: number, numberOfParts: number, numberOfPoints: number, boundingBox: number[], mMin: number | null, mMax: number | null) {
        super(recordNumber, contentLength, shapeType);
        this.parts = new Array<PartM>();
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
    getContentSize(): number {
        return ShapeFileFieldSize.shapeType + ShapeFileFieldSize.boundingBox + ShapeFileFieldSize.NumOfPart + ShapeFileFieldSize.NumOfPoint + (this.numberOfParts * ShapeFileFieldSize.part) + (this.numberOfPoints * ShapeFileFieldSize.pointM) + ShapeFileFieldSize.rangeM;
    }
    isValidShape(): boolean {
        let pointsCount: number = 0;
        this.parts.forEach((line) => {
            pointsCount = pointsCount + line.coordinatesM.length;
        })
        return this.contentLength == this.getContentSize() && this.boundingBox instanceof BoundingBox && (this.numberOfParts == this.parts.length) && (this.numberOfPoints == pointsCount);
    }
}
export class PointZ extends ShapeRecord {
    readonly coordinateZ: CoordinateZ;
    constructor(recordNumber: number, contentLength: number, shapeType: number, x: number, y: number, z: number, m: number | null) {
        super(recordNumber, contentLength, shapeType);
        this.coordinateZ = new CoordinateZ(x, y, z, m);
    }
    getContentSize(): number {
        return ShapeFileFieldSize.shapeType + ShapeFileFieldSize.pointZ;
    }
    isValidShape(): boolean {
        return this.contentLength == this.getContentSize();
    }
}
export class Part {
    readonly coordinates: Array<Coordinate>;
    constructor() {
        this.coordinates = new Array<Coordinate>();
    }
}
export class PartM {
    readonly coordinatesM: Array<CoordinateM>;
    constructor() {
        this.coordinatesM = new Array<CoordinateM>();
    }
}
export class BoundingBox {
    southwest: Coordinate;
    northeast: Coordinate;
    constructor(southwest: Coordinate, northeast: Coordinate) {
        this.southwest = southwest;
        this.northeast = northeast;
    }
}
export class Coordinate {
    /**
    * Latitude Value
    */
    public readonly x: number;
    /**
    * Longitude Value
    */
    public readonly y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}
export class CoordinateM extends Coordinate {
    /**
    * Routing/Offset  Value
    */
    public readonly m: number | null;
    constructor(x: number, y: number, m: number | null) {
        super(x, y);
        this.m = m;
    }
}
export class CoordinateZ extends CoordinateM {
    /**
    * Elevation/GPS Height   Value
    */
    public readonly z: number;
    constructor(x: number, y: number, z: number, m: number | null) {
        super(x, y, m);
        this.z = z;
    }
}
export class Attribute {
    public readonly key: string;
    public readonly value: string;
    constructor(key: string, value: string) {
        this.key = key;
        this.value = value;
    }
}
export abstract class ShapeFileFieldSize {
    public static readonly boundingBox: number = 32;
    public static readonly shapeType: number = 4;
    public static readonly NumOfPart: number = 4;
    public static readonly NumOfPoint: number = 4;
    public static readonly point: number = 16;
    public static readonly pointM: number = 24;
    public static readonly pointZ: number = 32;
    public static readonly rangeM: number = 16;
    public static readonly part: number = 4;
}