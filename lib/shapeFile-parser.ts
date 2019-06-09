import {ShapeFileHelpers} from "./shpFile-helpers"
import { ShapeFile } from "./models/shapefile";

export abstract class ShapeFileParser extends ShapeFileHelpers {
   
    /**
    * @Method: Parse geometries from the Shape (.shp) File.
    * @Param {Buffer}
    * @Return {ShapeFile}
    */
    public static parse(shpFileBuffer: Buffer): ShapeFile {
        try {

            if (!shpFileBuffer || shpFileBuffer.byteLength == 0) {
                throw new SyntaxError("shpFile can't be null or empty.");
            }
            else {
                return ShapeFileHelpers.parse(shpFileBuffer)
            }
        }
        catch (error) {
            throw error;
        }
    }
    /**
    * @Method: Parse geometries from the Shape (.shp) & dBase (.dbf) Files.
    * @Param {.shp File Buffer}
    * @Param {.dbf File Buffer}
    * @Return {ShapeFile}
    */
   public static parseShpAndDbf(shpFileBuffer: Buffer, dbfFileBuffer: Buffer): ShapeFile {
    try {

        if (!shpFileBuffer || shpFileBuffer.byteLength == 0) {
            throw new SyntaxError("shpFile can't be null or empty.");
        }
        else {
            return ShapeFileHelpers.parseShpAndDbf(shpFileBuffer, dbfFileBuffer);           
        }
    }
    catch (error) {
        throw error;
    }
}
}

