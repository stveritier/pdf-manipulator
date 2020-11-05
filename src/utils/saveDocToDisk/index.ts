import path from 'path';
import moment from 'moment';
import regularFs from 'fs';

const fs = regularFs.promises;

const saveDocToDisk = async (
  filePath: string,
  fileName: string,
  docBuffer: Buffer
): Promise<boolean> => {
  const now = moment(new Date()).format('YYYY-MM-DD HH-mm-ss').toString();

  const finalFileName = `${now} - ${fileName}`;
  const fullPath = path.join(filePath, finalFileName);
  try {
    await fs.writeFile(fullPath, docBuffer);
    return true;
  } catch (error: unknown) {
    return false;
  }
};

export { saveDocToDisk };
