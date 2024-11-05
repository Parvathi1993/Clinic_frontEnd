
import React from 'react';
import * as XLSX from 'xlsx';

const ExportToExcel = () => {
    // Sample table data
    const tableData = [
        { name: 'John Doe', age: 30, email: 'john@example.com' },
        { name: 'Jane Smith', age: 25, email: 'jane@example.com' },
        { name: 'Bob Johnson', age: 45, email: 'bob@example.com' },
    ];

    // Function to handle export
    const exportToExcel = () => {
        // Create a new workbook
        const workbook = XLSX.utils.book_new();

        // Convert the table data to worksheet
        const worksheet = XLSX.utils.json_to_sheet(tableData);

        // Append the worksheet to the workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        // Generate and download the Excel file
        XLSX.writeFile(workbook, 'TableData.xlsx');
    };
    return (
        <div>
            <h1>Export Table Data to Excel</h1>
            <table border="1">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((row, index) => (
                        <tr key={index}>
                            <td>{row.name}</td>
                            <td>{row.age}</td>
                            <td>{row.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={exportToExcel}>Export to Excel</button>
        </div>
    )
}

export default ExportToExcel


