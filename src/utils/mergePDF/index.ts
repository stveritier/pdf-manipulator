import { PDFDocument, PageSizes } from 'pdf-lib';
import sharp from 'sharp';
import fs from 'fs';
import { extname } from 'path';

const { readFile } = fs.promises;

// PDF Dimensions 595, 842 - 794,1123 - 1240,1754 -	2480,3508
const insertImageIntoPdfFile = async (
  filePath: string
): Promise<Uint8Array | Error> => {
  const pdfDoc = await PDFDocument.create();
  const imgData = await readFile(filePath);
  const imgBuffer = await sharp(imgData)
    .resize(1240, 1754, { fit: 'inside' })
    .toBuffer();

  switch (extname(filePath)) {
    case '.jpg' || '.jpeg': {
      const jpgImage = await pdfDoc.embedJpg(imgBuffer);
      const page = pdfDoc.addPage(PageSizes.A4);

      const jpgDims = jpgImage.scale(0.47);
      page.drawImage(jpgImage, {
        x: page.getWidth() / 2 - jpgDims.width / 2,
        y: page.getHeight() / 2 - jpgDims.height / 2,
        width: jpgDims.width,
        height: jpgDims.height,
      });

      const pdfBytes = await pdfDoc.save();
      return pdfBytes;
    }
    case '.png': {
      const pngImage = await pdfDoc.embedPng(imgBuffer);
      const page = pdfDoc.addPage(PageSizes.A4);

      const pngDims = pngImage.scale(0.47);
      page.drawImage(pngImage, {
        x: page.getWidth() / 2 - pngDims.width / 2,
        y: page.getHeight() / 2 - pngDims.height / 2,
        width: pngDims.width,
        height: pngDims.height,
      });

      const pdfBytes = await pdfDoc.save();
      return pdfBytes;
    }
    default:
      return new Error(
        'Please provide a file with a valid extension (jpg, jpeg or png)'
      );
  }
};

const prepareDocuments = async (
  filePaths: string[]
): Promise<PDFDocument[] | Error> => {

  try {
    const pdfDocumentsArray = await Promise.all(
      filePaths.map(async (path) => {
        if (extname(path) === '.pdf') {
          const pdfFileBytes = await readFile(path);
          const pdfDoc = await PDFDocument.load(pdfFileBytes);
          return pdfDoc;
        }
        if (
          extname(path) === '.jpg' ||
          extname(path) === '.jpeg' ||
          extname(path) === '.png'
        ) {
          const imgFileBytes = await insertImageIntoPdfFile(path);

          if (imgFileBytes instanceof Error) {
            throw new Error('There was an error processing the images');
          }

          const pdfDoc = await PDFDocument.load(imgFileBytes);
          return pdfDoc;
        }
        throw new Error('Please provide a .jpg/.jpeg/.png/.pdf file');
      })
    );
    return pdfDocumentsArray;
  } catch (error) {
    if (error instanceof Error) {
      return error;
    }
    return new Error('Unknown Error');
  }
};

const mergePDF = async (filePaths: string[]): Promise<Buffer | Error> => {
  const mergedPDF = await PDFDocument.create();

  const pdfDocumentsArray = await prepareDocuments(filePaths);

  if (pdfDocumentsArray instanceof Error) {
    return pdfDocumentsArray;
  }

  const copiedPages = await Promise.all(
    pdfDocumentsArray.map((pdfDoc) => {
      return mergedPDF.copyPages(pdfDoc, pdfDoc.getPageIndices());
    })
  );

  copiedPages.forEach((pages) =>
    pages.forEach((page) => mergedPDF.addPage(page))
  );
  return Buffer.from(await mergedPDF.save());
};

export { mergePDF };
