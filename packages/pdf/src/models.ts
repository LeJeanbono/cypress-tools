import PdfParse from "pdf-parse";

export interface ParsedResult extends PdfParse.Result {
    textArray: string[]
}