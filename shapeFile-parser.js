"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shpFile_helpers_1 = require("./shpFile-helpers");
class ShapeFileParser extends shpFile_helpers_1.ShapeFileHelpers {
    /**
    * @Method: Parse geometries from the Shape (.shp) File.
    * @Param {Buffer}
    * @Return {ShapeFile}
    */
    static parse(shpFileBuffer) {
        try {
            if (!shpFileBuffer || shpFileBuffer.byteLength == 0) {
                throw new SyntaxError("shpFile can't be null or empty.");
            }
            else {
                return shpFile_helpers_1.ShapeFileHelpers.parse(shpFileBuffer);
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
    static parseShpAndDbf(shpFileBuffer, dbfFileBuffer) {
        try {
            if (!shpFileBuffer || shpFileBuffer.byteLength == 0) {
                throw new SyntaxError("shpFile can't be null or empty.");
            }
            else {
                return shpFile_helpers_1.ShapeFileHelpers.parseShpAndDbf(shpFileBuffer, dbfFileBuffer);
            }
        }
        catch (error) {
            throw error;
        }
    }
}
exports.ShapeFileParser = ShapeFileParser;
