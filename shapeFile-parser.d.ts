/// <reference types="node" />
import { ShapeFileHelpers } from "./shpFile-helpers";
import { ShapeFile } from "./models/shapefile";
export declare abstract class ShapeFileParser extends ShapeFileHelpers {
    /**
    * @Method: Parse geometries from the Shape (.shp) File.
    * @Param {Buffer}
    * @Return {ShapeFile}
    */
    static parse(shpFileBuffer: Buffer): ShapeFile;
    /**
    * @Method: Parse geometries from the Shape (.shp) & dBase (.dbf) Files.
    * @Param {.shp File Buffer}
    * @Param {.dbf File Buffer}
    * @Return {ShapeFile}
    */
    static parseShpAndDbf(shpFileBuffer: Buffer, dbfFileBuffer: Buffer): ShapeFile;
}
