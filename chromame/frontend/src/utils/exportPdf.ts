import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function exportElementToPdf(
  element: HTMLElement,
  filename = "chromame-profile.pdf",
): Promise<void> {
  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: "#faf7f5",
    useCORS: true,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pageWidth - 40;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let remaining = imgHeight;
  let position = 20;

  if (imgHeight <= pageHeight - 40) {
    pdf.addImage(imgData, "PNG", 20, position, imgWidth, imgHeight);
  } else {
    let pageY = 0;
    while (remaining > 0) {
      pdf.addImage(imgData, "PNG", 20, position - pageY, imgWidth, imgHeight);
      remaining -= pageHeight - 40;
      pageY += pageHeight - 40;
      if (remaining > 0) {
        pdf.addPage();
        position = 20;
      }
    }
  }

  pdf.save(filename);
}
