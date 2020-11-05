import { PDFDocument, PageSizes } from 'pdf-lib';
import sharp from 'sharp';
import fs from 'fs';
import { extname } from 'path';

const { readFile } = fs.promises;

// PDF Dimensions 595, 842 - 794,1123 - 1240,1754 -	2480,3508
const prepareImage = async (filePath: string) => {
  const imgData = await readFile(filePath);
  const imgBuffer = await sharp(imgData)
    .resize(1240, 1754, { fit: 'inside' })
    .toBuffer();
  return imgBuffer;
};

const insertJPG = async (imgData: Buffer) => {
  const pdfDoc = await PDFDocument.create();
  const jpgImage = await pdfDoc.embedJpg(imgData);
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
};

const insertPNG = async (imgData: Buffer) => {
  const pdfDoc = await PDFDocument.create();
  const pngImage = await pdfDoc.embedPng(imgData);
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
};

const prepareDocuments = async (filePaths: string[]) => {
  const pdfDocumentsArray = [];

  try {
    for (const filePath of filePaths) {
      if (extname(filePath) === '.png') {
        const imgData = await prepareImage(filePath);
        const pdfBytes = await insertPNG(imgData);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        pdfDocumentsArray.push(pdfDoc);
      } else if (
        extname(filePath) === '.jpg' ||
        extname(filePath) === '.jpeg'
      ) {
        const imgData = await prepareImage(filePath);
        const pdfBytes = await insertJPG(imgData);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        pdfDocumentsArray.push(pdfDoc);
      } else {
        const pdfBytes = await PDFDocument.load(await readFile(filePath));
        pdfDocumentsArray.push(pdfBytes);
      }
    }
  } catch (error) {
    console.log(error);
  }

  return pdfDocumentsArray;
};

const mergePDF = async (filePaths: string[]): Promise<Uint8Array> => {
  const mergedPDF = await PDFDocument.create();

  const pdfDocumentsArray = await prepareDocuments(filePaths);

  for (const pdfDoc of pdfDocumentsArray) {
    const copiedPages = await mergedPDF.copyPages(
      pdfDoc,
      pdfDoc.getPageIndices()
    );
    copiedPages.forEach((page) => mergedPDF.addPage(page));
  }

  return mergedPDF.save();
};

export { mergePDF as default };
