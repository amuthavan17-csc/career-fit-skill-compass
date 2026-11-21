import { unzipSync, strFromU8 } from "fflate";

export type ResumeFileType = "pdf" | "docx";

export function detectFileType(filename: string, bytes: Uint8Array): ResumeFileType | null {
  const ext = filename.toLowerCase().split(".").pop();
  const isPdf = bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46; // %PDF
  const isZip = bytes[0] === 0x50 && bytes[1] === 0x4b; // PK
  if (ext === "pdf" && isPdf) return "pdf";
  if (ext === "docx" && isZip) return "docx";
  return null;
}

export async function sha256Hex(bytes: Uint8Array): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new Uint8Array(bytes));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function extractPdf(bytes: Uint8Array): Promise<string> {
  const { getDocumentProxy, extractText } = await import("unpdf");
  const pdf = await getDocumentProxy(new Uint8Array(bytes));
  const { text } = await extractText(pdf, { mergePages: false });
  return (Array.isArray(text) ? text : [text]).join("\n");
}

function decodeXmlEntities(s: string) {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&amp;/g, "&");
}

function extractDocx(bytes: Uint8Array): string {
  const files = unzipSync(bytes, {
    filter: (f) => f.name === "word/document.xml" || /^word\/(header|footer)\d*\.xml$/.test(f.name),
  });
  const order = Object.keys(files).sort((a) => (a === "word/document.xml" ? -1 : 1));
  return order
    .map((name) => {
      const xml = strFromU8(files[name]!);
      return decodeXmlEntities(
        xml
          .replace(/<w:tab\/>/g, "\t")
          .replace(/<w:br[^>]*\/>/g, "\n")
          .replace(/<\/w:p>/g, "\n")
          .replace(/<[^>]+>/g, ""),
      );
    })
    .join("\n");
}

/** Readable text from a text-based PDF or a DOCX file. Scanned/image-only PDFs return little or no text. */
export async function extractResumeText(type: ResumeFileType, bytes: Uint8Array): Promise<string> {
  const raw = type === "pdf" ? await extractPdf(bytes) : extractDocx(bytes);
  return raw.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}
