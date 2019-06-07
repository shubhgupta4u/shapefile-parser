/// <reference types="node" />
export declare abstract class ShapeFileHelpers {
    private static getPointShapes;
    private static getShapeFileHeader;
    private static readNextPointShape;
    protected static parse(shpFileBuffer: Buffer): any;
}
