import {ShapeFileHeader, ShapeType, ShapeFile, Point} from "./models/shapefile";

export abstract class ShapeFileHelpers {
   //Start of methods for converting Shp binaryArray into the geojson object
   private static getPointShapes(shapeFile:ShapeFile, buffer:Buffer, byteRead: number, fileSize:number){
      while(byteRead<fileSize){         
         let point:Point = ShapeFileHelpers.readNextPointShape(shapeFile, buffer,byteRead,fileSize); 
         shapeFile.ShapeRecords.push(point);  
         byteRead=byteRead+point.contentLength;
      }
   }
   private static getShapeFileHeader(buffer:Buffer) :ShapeFileHeader{
      let fileCode:number=buffer.readIntBE(0,4);
      let fileLength:number=buffer.readIntBE(24,4);
      let version:number=buffer.readIntLE(28,4);
      let shapeType:number=buffer.readIntLE(32,4);
      let xMin:number=buffer.readDoubleLE(36);
      let yMin:number=buffer.readDoubleLE(44);
      let xMax:number=buffer.readDoubleLE(52);
      let yMax:number=buffer.readDoubleLE(60);
      let zMin:number=buffer.readDoubleLE(68);
      let zMax:number=buffer.readDoubleLE(76);
      let mMin:number=buffer.readDoubleLE(84);
      let mMax:number=buffer.readDoubleLE(92);mMin
      return new ShapeFileHeader(fileCode, fileLength, version,shapeType, xMin, yMin, xMax,yMax,zMin,zMax, mMin,mMax);
   }
   private static readNextPointShape(shapeFile:ShapeFile, buffer:Buffer, byteRead: number, fileSize:number):Point{
    
         let recordNumber:number=buffer.readIntBE(byteRead,4);
         byteRead=byteRead+4;
         let contentLength:number=buffer.readIntBE(byteRead,4);
         byteRead=byteRead+4;
         let shapeType:number=buffer.readIntLE(byteRead,4);
         byteRead=byteRead+4;
         let x:number=buffer.readDoubleLE(byteRead);
         byteRead=byteRead+8;
         let y:number=buffer.readDoubleLE(byteRead);
         byteRead=byteRead+8;
         return new Point(recordNumber,contentLength,shapeType,x,y);  
   }
   protected static parse(shpFileBuffer: Buffer): any {
      {
         try {
            let byteRead: number = 0;
            let fileSize: number = shpFileBuffer.byteLength;
            let fileHeader: ShapeFileHeader = ShapeFileHelpers.getShapeFileHeader(shpFileBuffer);
            
            byteRead = 100;
            let shapeFile:ShapeFile=new ShapeFile(fileHeader);
            switch (fileHeader.shapeType) {
               case ShapeType.Point:
                     ShapeFileHelpers.getPointShapes(shapeFile, shpFileBuffer,byteRead,fileSize);  
                  break;
               case ShapeType.Polyline:
                  break;
               case ShapeType.Polygon:
                  break;
               case ShapeType.MultiPoint:
                  break;
               default:
                  throw new SyntaxError("This shape file contains unsupported geometries.");
            }
            console.log(shapeFile);
            return shapeFile;
         } catch (error) {
            throw error;
         }
      }
   }
   //End of methods for converting Shp binaryArray into the geojson object  
}

