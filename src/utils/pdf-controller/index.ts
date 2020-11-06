import { PDFDocument, PageSizes } from 'pdf-lib';
import sharp from 'sharp';
import fs from 'fs';
import { extname } from 'path';

const { readFile } = fs.promises;

class PDFController {
  private static instance: PDFController;

  private constructor() {
    // I have to type something here for some reason.
  }

  public static get Instance(): PDFController {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new this();

    return this.instance;
  }

  // PDF Dimensions 595, 842 - 794,1123 - 1240,1754 -	2480,3508
  private insertImageIntoPdfFile = async (
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

  private prepareDocuments = async (
    filePaths: string[]
  ): Promise<PDFDocument[] | Error> => {
    const pdfBytesArray: Buffer[] = [];

    const pdfPaths = filePaths.filter((path) => extname(path) === '.pdf');
    const imgPaths = filePaths.filter(
      (path) =>
        extname(path) === '.jpg' ||
        extname(path) === '.jpeg' ||
        extname(path) === '.png'
    );

    try {
      const pdfFilesBytes = await Promise.all(
        pdfPaths.map((pdfPath) => readFile(pdfPath))
      );
      pdfFilesBytes.forEach((pdfBytes) => pdfBytesArray.push(pdfBytes));

      const imgFilesBytes = await Promise.all(
        imgPaths.map((imgPath) => this.insertImageIntoPdfFile(imgPath))
      );
      imgFilesBytes.forEach((imgBytes) =>
        pdfBytesArray.push(Buffer.from(imgBytes))
      );

      const pdfDocumentsArray = await Promise.all(
        pdfBytesArray.map((pdfBytes) =>
          PDFDocument.load(pdfBytes, { ignoreEncryption: true })
        )
      );

      return pdfDocumentsArray;
    } catch (error) {
      if (error instanceof Error) {
        return error;
      }
      return new Error('Unknown Error');
    }
  };

  public mergePDF = async (filePaths: string[]): Promise<Buffer | Error> => {
    const mergedPDF = await PDFDocument.create();

    const pdfDocumentsArray = await this.prepareDocuments(filePaths);

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

    // for (const pdfDoc of pdfDocumentsArray) {
    //   const copiedPages = await mergedPDF.copyPages(
    //     pdfDoc,
    //     pdfDoc.getPageIndices()
    //   );
    //   copiedPages.forEach((page) => mergedPDF.addPage(page));
    // }

    return Buffer.from(await mergedPDF.save());
  };
}

export default PDFController;
