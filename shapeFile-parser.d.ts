/// <reference types="node" />
import { ShapeFileHelpers } from "./shpFile-helpers";
import { ShapeFile } from "./models/shapefile";
export declare abstract class ShapeFileParser extends ShapeFileHelpers {
    /**
    * @Method: Parse geometries from the Shape File.
    * @Param {Buffer}
    * @Return {ShapeFile}
    */
    static parse(shpFileBuffer: Buffer): ShapeFile;
}
