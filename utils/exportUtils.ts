/**
 * Generates and triggers a download for a CSV file from an array of objects.
 * @param filename The desired filename for the downloaded file (e.g., 'report.csv').
 * @param rows An array of objects to be converted into CSV rows.
 */
export const exportToCsv = (filename: string, rows: object[]) => {
    if (!rows || !rows.length) {
        console.warn("Export called with no data.");
        return;
    }

    const separator = ',';
    // Use the keys from the first object as headers
    const keys = Object.keys(rows[0]);
    
    // Create CSV header row
    const csvHeader = keys.join(separator);

    // Create CSV data rows
    const csvRows = rows.map(row => {
        return keys.map(k => {
            let cell = (row as any)[k] === null || (row as any)[k] === undefined ? '' : (row as any)[k];
            
            // Handle potential date objects
            cell = cell instanceof Date
                ? cell.toLocaleString('pt-BR')
                : cell.toString();

            // Sanitize cell content: escape double quotes by doubling them
            let sanitizedCell = cell.replace(/"/g, '""');

            // If the cell contains commas, quotes, or newlines, wrap it in double quotes
            if (sanitizedCell.search(/("|,|\n)/g) >= 0) {
                sanitizedCell = `"${sanitizedCell}"`;
            }
            return sanitizedCell;
        }).join(separator);
    }).join('\n');

    const csvContent = `${csvHeader}\n${csvRows}`;
    
    // Create a Blob and trigger the download
    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' }); // \uFEFF for BOM to handle UTF-8 in Excel
    const link = document.createElement('a');

    if (link.download !== undefined) { // Feature detection
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
};