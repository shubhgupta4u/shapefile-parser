import {ShapeFileHelpers} from "./shpFile-helpers"
import { ShapeFile } from "./models/shapefile";

export abstract class ShapeFileParser extends ShapeFileHelpers {
   
    /**
    * @Method: Parse geometries from the Shape File.
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
}

