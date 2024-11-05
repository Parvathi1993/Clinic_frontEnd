import { format } from "date-fns";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const TokenBillPdfView = (data, printingdata) => {
    const { uhid, token_no, fee,
        patient_name, patient_address, patient_pincode, patient_district,
        patient_mobile, patient_dob, patient_age, doctor_name } = data[0]
    const { clinic_name, clinic_address, clinic_mobile, clinic_landno } = printingdata[0]
    const dob = format(new Date(patient_dob), "dd-MM-yyyy")
    const xx = format(new Date(), "dd-MM-yyyy")
    var doc = {
        background: function (currentPage, pageSize) {
            return {
                table: {
                    widths: [pageSize.width - 70],
                    heights: [pageSize.height - 70],
                    bold: true,
                    body: [['']]
                },
                margin: 30,
                layout: 'noBorders'
            };
        },
        pageMargins: [50, 80, 130, 40],
        pageSize: 'A5',
        pageOrientation: 'landscape',
        // header: {
        //     columns: [

        //         {
        //             margin: [20, 15, 0, 0],
        //             style: 'tableExample',
        //             table: {
        //                 widths: [100, 250],
        //                 body: [
        //                     [{

        //                         image: 'snow', fit: [150, 150],
        //                         // margin: [25, 15, 0, 0],
        //                     },
        //                     ],


        //                 ]
        //             },
        //             layout: 'noBorders'
        //         },

        //     ],
        // },

        footer: function (currentPage, pageCount) {
            return {
                margin: 5,
                columns: [
                    {
                        fontSize: 9,
                        text: [
                            {
                                text: currentPage.toString() + ' of ' + pageCount,
                            }
                        ],
                        alignment: 'center'
                    }
                ]
            };

        },


        content: [

            {
                fontSize: 15,
                margin: [80, -55, 0, 0],
                text: clinic_name,
                style: 'header', bold: true,
                alignment: 'center',
            },
            {
                fontSize: 13,
                margin: [100, 0, 0, 0],
                text: clinic_address,
                style: 'header',
                alignment: 'center',
            },
            {
                margin: [160, 0, 0, 0],
                style: 'tableExample',
                table: {
                    widths: [20, 67.5, 0, 100],
                    body: [

                        [{ text: "Ph:", fontSize: 12, font: 'Roboto' },
                        { text: clinic_mobile, fontSize: 12, font: 'Roboto' },
                        { text: "|", fontSize: 12, font: 'Roboto' },
                        { text: clinic_landno, fontSize: 12, font: 'Roboto' }],

                    ]
                },
                layout: 'noBorders'
            },
            {
                fontSize: 17,
                margin: [60, 5, 0, 0],
                text: 'Visit Bill',
                style: 'header', bold: true,
                alignment: 'center',
            },

            {
                margin: [15, 25, 0, 0],
                style: 'tableExample',
                table: {
                    widths: [100, 150, 100, 150],
                    body: [
                        [{ text: 'UHID', fontSize: 12, font: 'Roboto' },
                        { text: uhid, fontSize: 12, font: 'Roboto' },
                        { text: 'Date', fontSize: 12, font: 'Roboto' },
                        { text: xx, fontSize: 12, font: 'Roboto' }
                        ],
                        [{ text: 'Patient Name', fontSize: 12, font: 'Roboto' },
                        {
                            text: patient_name, fontSize: 12, font: 'Roboto',
                            WrapText: "true", textTransform: "capitalize",
                        },
                        { text: 'Age', fontSize: 12, font: 'Roboto' },
                        { text: patient_age, fontSize: 12, font: 'Roboto' },
                        ],
                        [{ text: 'Address', fontSize: 12, font: 'Roboto' },
                        {
                            text: patient_address, fontSize: 12, font: 'Roboto',
                            WrapText: "true", textTransform: "capitalize",
                        },
                        { text: 'Mobile', fontSize: 12, font: 'Roboto' },
                        { text: patient_mobile, fontSize: 12, font: 'Roboto' }
                        ],
                        [{ text: 'Pin Code', fontSize: 12, font: 'Roboto' },
                        { text: patient_pincode, fontSize: 12, font: 'Roboto' },
                        { text: 'Doctor Name', fontSize: 12, font: 'Roboto' },
                        {
                            text: doctor_name, fontSize: 12, font: 'Roboto',
                            WrapText: "true", textTransform: "capitalize",
                        },
                        ],
                        [{ text: 'District', fontSize: 12, font: 'Roboto' },
                        { text: patient_district, fontSize: 12, font: 'Roboto' },
                        { text: 'Token No', fontSize: 12, font: 'Roboto' },
                        { text: token_no, fontSize: 12, font: 'Roboto' }
                        ],

                    ]
                },
                layout: 'noBorders'
            },

            {
                margin: [0, 10, 0, 0],
                style: 'tableExample',
                table: {
                    widths: [60, 330, 70],
                    body: [
                        [{ text: 'Sl No', fontSize: 12, font: 'Roboto' },
                        { text: 'Description', fontSize: 12, font: 'Roboto' },
                        { text: 'Amount', fontSize: 12, font: 'Roboto' }],
                        [{ text: '1', fontSize: 12, font: 'Roboto' },
                        { text: 'Consultation Charge', fontSize: 12, font: 'Roboto' },
                        { text: fee, fontSize: 12, font: 'Roboto' }],

                    ]
                },

            },


            {
                margin: [250, 20, 0, 0],
                style: 'tableExample',
                table: {
                    widths: [155, 60],
                    body: [

                        [{ text: 'Total Amount', fontSize: 12, font: 'Roboto' },
                        { text: fee, fontSize: 12, font: 'Roboto' }],

                    ]
                },
                layout: 'noBorders'
            },
        ],


        //     images: {
        //         snow: 'http://localhost/NAS/ahanex.png',
        //        // snow: ahanex
        //    }
    }
    pdfMake.createPdf(doc).open();
}