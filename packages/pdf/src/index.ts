/// <reference types="cypress" />
/// <reference types="pdf-parse" />

import fs from 'fs';
import { Logger } from './logger';
import { ParsedResult } from './models';
import PdfParse = require("pdf-parse")

let logger: Logger;

export const pdfTasks = () => {
    logger = new Logger(true);
    return {
        pdfParse: parsePdf,
    }
}

export function parsePdf(pdfPath: string): Promise<ParsedResult> {
    return new Promise((resolve, reject) => {
        fs.readFile(pdfPath, (errP, dataBuffer) => {
            if (errP) {
                reject(errP);
            }
            logger.log('PARSE')
            PdfParse(dataBuffer).then((data) => {
                let textArray = data.text.split('\n').map(t => t.trim()).filter(Boolean)
                return resolve({ ...data, textArray });
            }).catch((error) => {
                return reject(error);
            });
        });

    })
}
