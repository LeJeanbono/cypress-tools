import { PDFTask } from '@cypress-tools/pdf/tasks';
import { ParsedResult } from '@cypress-tools/pdf/models';

describe('PDF Tasks', () => {

    it('Task parsePDF', () => {
        cy.task<ParsedResult>(PDFTask.PDF_PARSE, 'cypress/fixtures/pdf/text.pdf').then(data => {
            expect(data.textArray).to.deep.equal([
                "Test File"
                , "New Ligne"
                , "etc"
                , "But it's ok"
            ])
            expect(data.numpages).equal(1)
            expect(data.numrender).equal(1)
            expect(data.text).equal("\n\nTest File  \nNew Ligne  \n etc  \n  \n  \n  \n  \n  \n  \nBut it's ok")
            expect(data.version).equal("1.10.100")
            expect(data.info).to.deep.equal({
                Author: "Soda PDF Online",
                Creator: "Soda PDF Online",
                IsAcroFormPresent: false,
                IsXFAPresent: false,
                ModDate: "D:20211122195111-05'00'",
                PDFFormatVersion: "2.0",
                Producer: "Soda PDF Online",
                Title: "a7230baa-0047-4e59-86a1-2dce60ff9175/69a8ec99-b217-4378-924b-39adad8d81b3"
            })
            expect(data.metadata._metadata).to.deep.equal({
                'dc:creator': "Soda PDF Online",
                'dc:format': "application/pdf",
                'dc:title': "a7230baa-0047-4e59-86a1-2dce60ff9175/69a8ec99-b217-4378-924b-39adad8d81b3",
                'pdf:producer': "Soda PDF Online",
                'xmp:creatortool': "Soda PDF Online",
                'xmp:modifydate': "2021-11-22T19:51:11-05:00"
            });
        });
    });
});