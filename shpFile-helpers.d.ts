/// <reference types="node" />
import { ShapeFile } from "./models/shapefile";
export declare abstract class ShapeFileHelpers {
    private static readonly recordHeaderSize;
    private static getNullShapes;
    private static readNextNullShape;
    private static getPointShapes;
    private static readNextPointShape;
    private static getMultiPointShapes;
    private static readNextMultiPointShape;
    private static getPolyLineShapes;
    private static readNextPolyLineShape;
    private static getPolygonShapes;
    private static readNextPolygonShape;
    private static getPointMShapes;
    private static readNextPointMShape;
    private static getMultiPointMShapes;
    private static readNextMultiMPointShape;
    private static getPolyLineMShapes;
    private static readNextPolyLineMShape;
    private static getPolygonMShapes;
    private static readNextPolygonMShape;
    private static getPointZShapes;
    private static readNextPointZShape;
    private static getShapeFileHeader;
    protected static parseShpAndDbf(shpFileBuffer: Buffer, dbfFileBuffer: Buffer): ShapeFile;
    protected static parse(shpFileBuffer: Buffer): any;
}
