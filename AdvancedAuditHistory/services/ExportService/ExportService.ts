// AdvancedAuditHistory\services\ExportService\ExportService.ts
import { Audit } from "../../interfaces";
import * as ExcelJS from 'exceljs';
import jsPDF from 'jspdf';

/**
 * Configuration options for export operations
 */
export interface ExportOptions {
    /** Callback to report export progress (current, total) */
    onProgress?: (current: number, total: number) => void;
    /** Maximum number of rows to export (default: 10000) */
    maxRows?: number;
    /** Include metadata in export (title, author, etc.) */
    includeMetadata?: boolean;
    /** Custom date format for timestamps */
    dateFormat?: Intl.DateTimeFormatOptions;
}

/**
 * Metadata to include in exports
 */
export interface ExportMetadata {
    /** Number of records being exported */
    recordCount: number;
    /** Timestamp when export was generated */
    exportedAt: Date;
    /** Optional user who generated the export */
    exportedBy?: string;
    /** Optional title for the export */
    title?: string;
}

/**
 * Transformed audit data for export
 */
interface TransformedAuditData {
    timestamp: string;
    user: string;
    operation: string;
    fields: string;
    count: number;
}

/**
 * Service for exporting audit history data to various file formats.
 * 
 * @remarks
 * Provides methods to export audit records to Excel, CSV, and PDF formats.
 * CSV export is implemented natively. Excel and PDF exports require additional
 * libraries to be installed (ExcelJS and jsPDF respectively).
 * 
 * All export methods support:
 * - Maximum row limits to prevent browser crashes
 * - Progress callbacks for long-running operations
 * - Metadata inclusion
 * - Consistent error handling
 * 
 * @example
 * ```typescript
 * const audits = [...]; // Array of audit records
 * 
 * // Export to CSV (works immediately)
 * ExportService.exportToCSV(audits, 'audit-history.csv');
 * 
 * // Export to Excel with options
 * await ExportService.exportToExcel(audits, 'audit-history.xlsx', {
 *   maxRows: 5000,
 *   onProgress: (current, total) => console.log(`${current}/${total}`)
 * });
 * 
 * // Export to PDF
 * ExportService.exportToPDF(audits, 'audit-history.pdf');
 * ```
 */
export class ExportService {
    // ===========================
    // CONSTANTS
    // ===========================

    /** Default maximum rows for any export */
    private static readonly DEFAULT_MAX_ROWS = 10000;

    /** Excel-specific constants */
    private static readonly EXCEL_CONFIG = {
        HEADER_BG_COLOR: 'FF2980B9',
        HEADER_TEXT_COLOR: 'FFFFFFFF',
        HEADER_HEIGHT: 20,
        COLUMNS: [
            { header: 'Timestamp', key: 'timestamp', width: 22 },
            { header: 'User', key: 'user', width: 30 },
            { header: 'Operation', key: 'operation', width: 15 },
            { header: 'Changed Fields', key: 'fields', width: 50 },
            { header: 'Number of Changes', key: 'count', width: 18 }
        ],
        MIME_TYPE: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    } as const;

    /** PDF-specific constants */
    private static readonly PDF_CONFIG = {
        ORIENTATION: 'landscape' as const,
        HEADER_BG_COLOR: [41, 128, 185] as const,
        HEADER_TEXT_COLOR: [255, 255, 255] as const,
        ROW_TEXT_COLOR: [0, 0, 0] as const,
        ROW_ALT_BG_COLOR: [240, 240, 240] as const,
        COLUMN_WIDTHS: [50, 45, 30, 120, 25] as const,
        HEADERS: ['Timestamp', 'User', 'Operation', 'Changed Fields', 'Changes'] as const,
        MARGIN: 10,
        ROW_HEIGHT: 6,
        HEADER_HEIGHT: 8,
        PAGE_FOOTER_OFFSET: 5,
        FONT_SIZES: {
            TITLE: 16,
            METADATA: 10,
            HEADER: 9,
            ROW: 8,
            FOOTER: 8
        }
    } as const;

    /** CSV-specific constants */
    private static readonly CSV_CONFIG = {
        HEADERS: ['Timestamp', 'User', 'Operation', 'Changed Fields', 'Number of Changes'] as const,
        FIELD_SEPARATOR: '; ',
        MIME_TYPE: 'text/csv;charset=utf-8;'
    } as const;

    // ===========================
    // PUBLIC EXPORT METHODS
    // ===========================
    // ===========================
    // PUBLIC EXPORT METHODS
    // ===========================

    /**
     * Exports audit history data to CSV format.
     * 
     * @param audits - Array of audit records to export
     * @param filename - Name of the file to download (default: 'audit-history.csv')
     * @param options - Optional export configuration
     * 
     * @remarks
     * Creates a CSV file with the following columns:
     * - Timestamp
     * - User
     * - Operation
     * - Changed Fields
     * - Number of Changes
     * 
     * The file is automatically downloaded to the user's browser.
     * 
     * @throws {Error} If no audit records provided or export fails
     */
    static exportToCSV(audits: Audit[], filename = 'audit-history.csv', options?: ExportOptions): void {
        try {
            // Validate input
            this.validateExportData(audits, options?.maxRows);

            // Transform data
            const transformedData = audits.map((audit, index) => {
                options?.onProgress?.(index + 1, audits.length);
                return this.transformAuditToExportData(audit);
            });

            // Build CSV content
            const csvRows = transformedData.map(data => [
                this.escapeCSVValue(data.timestamp),
                this.escapeCSVValue(data.user),
                this.escapeCSVValue(data.operation),
                this.escapeCSVValue(data.fields),
                data.count.toString()
            ]);

            // Combine headers and rows
            const csvContent = [
                this.CSV_CONFIG.HEADERS.join(','),
                ...csvRows.map(row => row.join(','))
            ].join('\n');

            // Download file
            this.downloadFile(csvContent, filename, this.CSV_CONFIG.MIME_TYPE);

            console.log(`[ExportService] Successfully exported ${audits.length} audit records to CSV`);
        } catch (error) {
            this.handleExportError('CSV', error);
        }
    }

    /**
     * Exports audit history data to Excel format (.xlsx).
     * 
     * @param audits - Array of audit records to export
     * @param filename - Name of the file to download (default: 'audit-history.xlsx')
     * @param options - Optional export configuration
     * 
     * @remarks
     * Uses ExcelJS library to create a formatted Excel workbook with:
     * - Header row with bold styling and background color
     * - Auto-filtered columns
     * - Formatted date/time values
     * - Automatic column widths
     * - Frozen header row
     * 
     * Supports progress reporting for large datasets.
     * 
     * @throws {Error} If export fails or exceeds maximum row limit
     */
    static async exportToExcel(audits: Audit[], filename = 'audit-history.xlsx', options?: ExportOptions): Promise<void> {
        try {
            // Validate input
            this.validateExportData(audits, options?.maxRows);

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Audit History');

            // Set workbook metadata if requested
            if (options?.includeMetadata) {
                const metadata = this.createExportMetadata(audits.length);
                workbook.creator = metadata.exportedBy ?? 'Advanced Audit History';
                workbook.created = metadata.exportedAt;
                workbook.modified = metadata.exportedAt;
            }

            // Configure columns (spread to create mutable copy)
            worksheet.columns = [...this.EXCEL_CONFIG.COLUMNS];

            // Style header row
            this.styleExcelHeader(worksheet.getRow(1));

            // Add data rows with progress reporting
            audits.forEach((audit, index) => {
                options?.onProgress?.(index + 1, audits.length);
                const data = this.transformAuditToExportData(audit);
                worksheet.addRow(data);
            });

            // Add auto-filter
            worksheet.autoFilter = {
                from: { row: 1, column: 1 },
                to: { row: audits.length + 1, column: this.EXCEL_CONFIG.COLUMNS.length }
            };

            // Freeze header row
            worksheet.views = [{ state: 'frozen', ySplit: 1 }];

            // Generate buffer and download
            const buffer = await workbook.xlsx.writeBuffer();
            this.downloadFile(buffer, filename, this.EXCEL_CONFIG.MIME_TYPE);

            console.log(`[ExportService] Successfully exported ${audits.length} audit records to Excel`);
        } catch (error) {
            this.handleExportError('Excel', error);
        }
    }

    /**
     * Exports audit history data to PDF format.
     * 
     * @param audits - Array of audit records to export
     * @param filename - Name of the file to download (default: 'audit-history.pdf')
     * @param options - Optional export configuration
     * 
     * @remarks
     * Uses jsPDF library to create a formatted PDF document with:
     * - Report header with generation timestamp
     * - Summary information
     * - Tabular audit data with alternating row colors
     * - Automatic pagination
     * - Page numbers in footer
     * 
     * Note: For large datasets (>1000 records), consider using Excel export for better performance.
     * 
     * @throws {Error} If export fails or exceeds maximum row limit
     */
    static exportToPDF(audits: Audit[], filename = 'audit-history.pdf', options?: ExportOptions): void {
        try {
            // Validate input
            this.validateExportData(audits, options?.maxRows);

            const doc = new jsPDF({ orientation: this.PDF_CONFIG.ORIENTATION });
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            let yPosition: number = this.PDF_CONFIG.MARGIN;

            // Render title and metadata
            yPosition = this.renderPDFHeader(doc, audits.length, yPosition);

            // Render table header
            yPosition = this.renderPDFTableHeader(doc, pageWidth, yPosition);

            // Render data rows with progress reporting
            yPosition = this.renderPDFTableRows(doc, audits, pageWidth, pageHeight, yPosition, options);

            // Add page footers
            this.addPDFPageFooters(doc, pageWidth, pageHeight);

            // Save the PDF
            doc.save(filename);

            console.log(`[ExportService] Successfully exported ${audits.length} audit records to PDF`);
        } catch (error) {
            this.handleExportError('PDF', error);
        }
    }

    // ===========================
    // PRIVATE HELPER METHODS
    // ===========================

    /**
     * Transforms a single audit record into export-ready data.
     * 
     * @param audit - Audit record to transform
     * @param dateFormat - Optional custom date format
     * @returns Transformed data object
     */
    private static transformAuditToExportData(
        audit: Audit,
        dateFormat?: Intl.DateTimeFormatOptions
    ): TransformedAuditData {
        const timestamp = audit.timestamp instanceof Date
            ? audit.timestamp.toLocaleString(undefined, dateFormat)
            : new Date(audit.timestamp).toLocaleString(undefined, dateFormat);

        const user = audit.user?.name ?? 'Unknown User';
        const operation = audit.operation ?? 'Unknown';
        const fields = audit.attributes?.map(a => a.displayName ?? a.logicalName).join(', ') ?? '';
        const count = audit.attributes?.length ?? 0;

        return { timestamp, user, operation, fields, count };
    }

    /**
     * Validates export data before processing.
     * 
     * @param audits - Array of audit records to validate
     * @param maxRows - Optional maximum row limit
     * @throws {Error} If validation fails
     */
    private static validateExportData(audits: Audit[], maxRows?: number): void {
        if (!audits || audits.length === 0) {
            throw new Error('No audit records to export');
        }

        const limit = maxRows ?? this.DEFAULT_MAX_ROWS;
        if (audits.length > limit) {
            throw new Error(
                `Export exceeds maximum limit of ${limit} records. Current: ${audits.length}. ` +
                `Please apply filters to reduce the dataset size.`
            );
        }
    }

    /**
     * Centralized error handling for export operations.
     * 
     * @param operation - Name of the export operation (CSV, Excel, PDF)
     * @param error - The error that occurred
     * @throws {Error} Always throws with formatted error message
     */
    private static handleExportError(operation: string, error: unknown): never {
        console.error(`[ExportService] ${operation} export failed:`, error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Failed to export audit history to ${operation}: ${message}`);
    }

    /**
     * Creates export metadata object.
     * 
     * @param recordCount - Number of records being exported
     * @returns Export metadata
     */
    private static createExportMetadata(recordCount: number): ExportMetadata {
        return {
            recordCount,
            exportedAt: new Date(),
            title: 'Audit History Export'
        };
    }

    /**
     * Styles the Excel header row.
     * 
     * @param headerRow - ExcelJS Row object to style
     */
    private static styleExcelHeader(headerRow: ExcelJS.Row): void {
        headerRow.font = {
            bold: true,
            color: { argb: this.EXCEL_CONFIG.HEADER_TEXT_COLOR }
        };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: this.EXCEL_CONFIG.HEADER_BG_COLOR }
        };
        headerRow.alignment = { vertical: 'middle', horizontal: 'left' };
        headerRow.height = this.EXCEL_CONFIG.HEADER_HEIGHT;
    }

    /**
     * Renders the PDF document header with title and metadata.
     * 
     * @param doc - jsPDF document instance
     * @param recordCount - Number of records being exported
     * @param startY - Starting Y position
     * @returns New Y position after rendering
     */
    private static renderPDFHeader(doc: jsPDF, recordCount: number, startY: number): number {
        let yPos = startY;

        // Title
        doc.setFontSize(this.PDF_CONFIG.FONT_SIZES.TITLE);
        doc.setFont('helvetica', 'bold');
        doc.text('Audit History Report', this.PDF_CONFIG.MARGIN, yPos);
        yPos += 10;

        // Metadata
        doc.setFontSize(this.PDF_CONFIG.FONT_SIZES.METADATA);
        doc.setFont('helvetica', 'normal');
        doc.text(`Generated: ${new Date().toLocaleString()}`, this.PDF_CONFIG.MARGIN, yPos);
        yPos += 6;
        doc.text(`Total Records: ${recordCount}`, this.PDF_CONFIG.MARGIN, yPos);
        yPos += 10;

        return yPos;
    }

    /**
     * Renders the PDF table header row.
     * 
     * @param doc - jsPDF document instance
     * @param pageWidth - Page width
     * @param startY - Starting Y position
     * @returns New Y position after rendering
     */
    private static renderPDFTableHeader(doc: jsPDF, pageWidth: number, startY: number): number {
        let yPos = startY;
        let xPos = this.PDF_CONFIG.MARGIN;

        doc.setFontSize(this.PDF_CONFIG.FONT_SIZES.HEADER);
        doc.setFont('helvetica', 'bold');

        // Draw header background
        doc.setFillColor(...this.PDF_CONFIG.HEADER_BG_COLOR);
        doc.rect(
            this.PDF_CONFIG.MARGIN,
            yPos - 5,
            pageWidth - 2 * this.PDF_CONFIG.MARGIN,
            this.PDF_CONFIG.HEADER_HEIGHT,
            'F'
        );

        // Draw header text
        doc.setTextColor(...this.PDF_CONFIG.HEADER_TEXT_COLOR);
        this.PDF_CONFIG.HEADERS.forEach((header, i) => {
            doc.text(header, xPos, yPos);
            xPos += this.PDF_CONFIG.COLUMN_WIDTHS[i];
        });
        yPos += this.PDF_CONFIG.HEADER_HEIGHT;

        // Reset text color
        doc.setTextColor(...this.PDF_CONFIG.ROW_TEXT_COLOR);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(this.PDF_CONFIG.FONT_SIZES.ROW);

        return yPos;
    }

    /**
     * Renders PDF table data rows with pagination.
     * 
     * @param doc - jsPDF document instance
     * @param audits - Array of audit records
     * @param pageWidth - Page width
     * @param pageHeight - Page height
     * @param startY - Starting Y position
     * @param options - Export options with progress callback
     * @returns Final Y position
     */
    private static renderPDFTableRows(
        doc: jsPDF,
        audits: Audit[],
        pageWidth: number,
        pageHeight: number,
        startY: number,
        options?: ExportOptions
    ): number {
        let yPos = startY;

        audits.forEach((audit, index) => {
            // Report progress
            options?.onProgress?.(index + 1, audits.length);

            // Check if we need a new page
            if (yPos > pageHeight - 20) {
                doc.addPage();
                yPos = this.PDF_CONFIG.MARGIN;
            }

            let xPos = this.PDF_CONFIG.MARGIN;
            const data = this.transformAuditToExportData(audit);
            const rowData = [
                data.timestamp,
                data.user,
                data.operation,
                data.fields,
                data.count.toString()
            ];

            // Alternate row background
            if (index % 2 === 0) {
                doc.setFillColor(...this.PDF_CONFIG.ROW_ALT_BG_COLOR);
                doc.rect(
                    this.PDF_CONFIG.MARGIN,
                    yPos - 4,
                    pageWidth - 2 * this.PDF_CONFIG.MARGIN,
                    this.PDF_CONFIG.ROW_HEIGHT,
                    'F'
                );
            }

            // Render row data
            rowData.forEach((cellData, i) => {
                const maxWidth = this.PDF_CONFIG.COLUMN_WIDTHS[i] - 2;
                const truncatedText = doc.splitTextToSize(cellData, maxWidth)[0] ?? '';
                doc.text(truncatedText, xPos, yPos);
                xPos += this.PDF_CONFIG.COLUMN_WIDTHS[i];
            });

            yPos += this.PDF_CONFIG.ROW_HEIGHT;
        });

        return yPos;
    }

    /**
     * Adds page numbers to all pages in the PDF.
     * 
     * @param doc - jsPDF document instance
     * @param pageWidth - Page width
     * @param pageHeight - Page height
     */
    private static addPDFPageFooters(doc: jsPDF, pageWidth: number, pageHeight: number): void {
        const totalPages = doc.internal.pages.length - 1;
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(this.PDF_CONFIG.FONT_SIZES.FOOTER);
            doc.setFont('helvetica', 'italic');
            doc.text(
                `Page ${i} of ${totalPages}`,
                pageWidth / 2,
                pageHeight - this.PDF_CONFIG.PAGE_FOOTER_OFFSET,
                { align: 'center' }
            );
        }
    }

    /**
     * Escapes a value for safe use in CSV format.
     * 
     * @param value - The value to escape
     * @returns Escaped value safe for CSV
     * 
     * @remarks
     * - Wraps values containing commas, quotes, or newlines in double quotes
     * - Escapes double quotes by doubling them
     */
    private static escapeCSVValue(value: string): string {
        if (value === null || value === undefined) {
            return '';
        }

        const stringValue = value.toString();

        // Check if value needs to be quoted
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n') || stringValue.includes('\r')) {
            // Escape double quotes by doubling them
            const escaped = stringValue.replace(/"/g, '""');
            return `"${escaped}"`;
        }

        return stringValue;
    }

    /**
     * Downloads a file to the user's browser.
     * 
     * @param content - File content (string or Blob)
     * @param filename - Name of the file to download
     * @param mimeType - MIME type of the file
     * 
     * @remarks
     * Creates a temporary anchor element to trigger the download,
     * then removes it from the DOM.
     */
    private static downloadFile(content: string | Blob | ArrayBuffer, filename: string, mimeType: string): void {
        let blob: Blob;

        if (content instanceof Blob) {
            blob = content;
        } else if (content instanceof ArrayBuffer) {
            blob = new Blob([content], { type: mimeType });
        } else {
            blob = new Blob([content], { type: mimeType });
        }

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';

        // Trigger download
        document.body.appendChild(link);
        link.click();

        // Cleanup
        setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        }, 100);
    }
}
