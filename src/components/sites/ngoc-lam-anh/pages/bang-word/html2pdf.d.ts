// Khai báo kiểu tối thiểu cho html2pdf.js@0.10 (gói không kèm types). Chỉ dùng trong /bang-word.
declare module "html2pdf.js" {
  interface Html2PdfJsPdf {
    internal: { getNumberOfPages(): number; pageSize: { getWidth(): number; getHeight(): number } };
    setPage(n: number): void;
    setFontSize(n: number): void;
    setTextColor(n: number): void;
    text(t: string, x: number, y: number, o?: { align?: string }): void;
  }
  interface Html2PdfWorker {
    set(opt: Record<string, unknown>): Html2PdfWorker;
    from(el: HTMLElement): Html2PdfWorker;
    toPdf(): Html2PdfWorker;
    get(k: "pdf"): Promise<Html2PdfJsPdf> & Html2PdfWorker;
    save(): Promise<void>;
  }
  function html2pdf(): Html2PdfWorker;
  export default html2pdf;
}
