
import { format } from "date-fns";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const DuplicateOpBillPrint = (printingdata, patient_name, patient_address, patient_district,
    patient_mobile, patient_age, billdate, billAmount, uhid, TableData, billNo) => {

    const { clinic_name, clinic_address, clinic_mobile, clinic_landno } = printingdata[0]

    const xx = format(new Date(billdate), "dd-MM-yyyy")


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
        header: {
            columns: [

                {
                    margin: [20, 15, 0, 0],
                    style: 'tableExample',
                    table: {
                        widths: [100, 250],
                        body: [
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


                        ]
                    },
                    layout: 'noBorders'
                },

            ],
        },

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
            // {
            //     fontSize: 15,
            //     margin: [80, -55, 0, 0],
            //     text: clinic_name,
            //     style: 'header', bold: true,
            //     alignment: 'center',
            // },
            // {
            //     fontSize: 13,
            //     margin: [100, 0, 0, 0],
            //     text: clinic_address,
            //     style: 'header',
            //     alignment: 'center',
            // },
            // {
            //     margin: [160, 0, 0, 0],
            //     style: 'tableExample',
            //     table: {
            //         widths: [20, 67.5, 0, 100],
            //         body: [

            //             [{ text: "Ph:", fontSize: 12, font: 'Roboto' },
            //             { text: clinic_mobile, fontSize: 12, font: 'Roboto' },
            //             { text: "|", fontSize: 12, font: 'Roboto' },
            //             { text: clinic_landno, fontSize: 12, font: 'Roboto' }],

            //         ]
            //     },
            //     layout: 'noBorders'
            // },
            {
                margin: [15, 25, 0, 0],
                style: 'tableExample',
                table: {
                    widths: [100, 150, 100, 150],
                    body: [
                        [{ text: 'UHID', fontSize: 12, font: 'Roboto' },
                        { text: uhid, fontSize: 12, font: 'Roboto' },
                        { text: 'Bill No', fontSize: 12, font: 'Roboto' },
                        { text: billNo, fontSize: 12, font: 'Roboto' },
                        ],
                        [{ text: 'Patient Name', fontSize: 12, font: 'Roboto' },
                        { text: patient_name, fontSize: 12, font: 'Roboto' },
                        { text: 'Bill Date', fontSize: 12, font: 'Roboto' },
                        { text: xx, fontSize: 12, font: 'Roboto' }

                        ],
                        [{ text: 'Address', fontSize: 12, font: 'Roboto' },
                        { text: patient_address, fontSize: 12, font: 'Roboto' },
                        { text: 'Age', fontSize: 12, font: 'Roboto' },
                        { text: patient_age, fontSize: 12, font: 'Roboto' },

                        ],
                        [{ text: 'District', fontSize: 12, font: 'Roboto' },
                        { text: patient_district, fontSize: 12, font: 'Roboto' },
                        { text: 'Mobile', fontSize: 12, font: 'Roboto' },
                        { text: patient_mobile, fontSize: 12, font: 'Roboto' }
                        ],


                    ]
                },
                layout: 'noBorders'
            },



            {
                margin: [0, 3, 0, 0,],
                style: 'tableExample',
                table: {
                    widths: [60, 330, 70],
                    body: [
                        [{ text: 'Sl no', fontSize: 12, bold: true, },
                        { text: ' Description', fontSize: 12, bold: true },
                        { text: 'Rate', fontSize: 12, bold: true },
                        ]
                    ]
                        .concat(TableData && TableData.map((val) => [
                            { text: val.bill_proc_slno, fontSize: 12 },
                            { text: val.procedure_name, fontSize: 12 },
                            { text: val.procedure_rate, fontSize: 12 }
                        ]))
                }
            },


            {
                margin: [325, 20, 0, 0],
                style: 'tableExample',
                table: {
                    widths: [80, 60],
                    body: [

                        [{ text: 'Total Amount', fontSize: 12, font: 'Roboto', bold: true },
                        { text: billAmount, fontSize: 15, font: 'Roboto', bold: true }],

                    ]
                },
                layout: 'noBorders'
            },


            {
                margin: [0, 45, 0, 0],
                style: 'tableExample',
                table: {
                    widths: [350, 130],
                    body: [

                        [{},
                        { text: 'Seal & Signature', fontSize: 12, font: 'Roboto' }],
                        [
                            {
                                table: {
                                    widths: [350, 130],
                                    body: [

                                        [{}, {}],
                                        [{}, {}],
                                        [{}, {}],

                                    ]
                                }, layout: 'noBorders'
                            },
                            {
                                table: {
                                    widths: [350, 130],
                                    body: [

                                        [{}, {}],
                                        [{}, {}],
                                        [{}, {}],



                                    ]
                                },
                                layout: 'noBorders'
                            }
                        ]

                    ]
                },
                layout: 'noBorders'
            },



        ],
        // images: {
        //      snow: 'http://localhost/NAS/ahanex.png',
        //     // snow: ahanex
        // }





    }
    pdfMake.createPdf(doc).open();





}