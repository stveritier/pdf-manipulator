import path from 'path';
import moment from 'moment';
import regularFs from 'fs';

const fs = regularFs.promises;

abstract class DataController {
  static saveFileToDisk = async (
    filePath: string,
    fileName: string,
    data: Buffer
  ): Promise<boolean> => {
    const now = moment(new Date()).format('YYYY-MM-DD HH-mm-ss').toString();

    const finalFileName = `${now} - ${fileName}`;
    const fullPath = path.join(filePath, finalFileName);
    try {
      await fs.writeFile(fullPath, data);
      return true;
    } catch (e) {
      return false;
    }
  };
}

export default DataController;
