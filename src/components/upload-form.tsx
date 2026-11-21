import { useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useSuspenseQuery } from "@tanstack/react-query";
import { FileText, Loader2, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { analyzeResume } from "@/lib/skillmatch.functions";
import { jobsQuery } from "@/lib/queries";

const ACCEPT = ".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

function isAllowed(file: File) {
  return /\.(pdf|docx)$/i.test(file.name);
}

export function UploadForm() {
  const { data: jobs } = useSuspenseQuery(jobsQuery);
  const analyze = useServerFn(analyzeResume);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [jobId, setJobId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function pick(f: File | undefined | null) {
    setError(null);
    if (!f) return;
    if (!isAllowed(f)) {
      setFile(null);
      setError("Only PDF and DOCX files are supported.");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setFile(null);
      setError("That file is larger than 5 MB.");
      return;
    }
    setFile(f);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return setError("Please enter your name.");
    if (!jobId) return setError("Please choose a preferred job role.");
    if (!file) return setError("Please choose a resume file.");

    const fd = new FormData();
    fd.set("name", name.trim());
    fd.set("jobId", jobId);
    fd.set("file", file);
    setBusy(true);
    try {
      const res = await analyze({ data: fd });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      if (res.duplicate) toast.warning(res.message);
      else toast.success(res.message);
      navigate({
        to: "/report/$id",
        params: { id: res.reportId },
        search: res.duplicate ? { duplicate: true } : {},
      });
    } catch (err) {
      console.error(err);
      setError("Something went wrong while analysing your resume. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="paper-card space-y-5 p-5 sm:p-6" noValidate>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Analyze your resume</h2>
        <span className="eyebrow">PDF · DOCX</span>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="name">Your name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Priya Sharma" maxLength={100} autoComplete="name" className="h-11 bg-paper" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="job">Preferred job role</Label>
        <Select value={jobId} onValueChange={setJobId}>
          <SelectTrigger id="job" className="h-11 bg-paper">
            <SelectValue placeholder="Choose a role" />
          </SelectTrigger>
          <SelectContent>
            {jobs.map((j) => (
              <SelectItem key={j.id} value={j.id}>
                {j.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="file">Resume</Label>
        {file ? (
          <div className="flex items-center gap-3 rounded-lg border border-border bg-success-soft px-3 py-3">
            <FileText className="size-5 shrink-0 text-success" aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{file.name}</p>
              <p className="font-mono text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB · ready</p>
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={() => { setFile(null); if (inputRef.current) inputRef.current.value = ""; }} aria-label="Remove file">
              <X />
            </Button>
          </div>
        ) : (
          <label
            htmlFor="file"
            data-active={drag}
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files[0]); }}
            className="dropzone flex cursor-pointer flex-col items-center gap-2 px-4 py-8 text-center"
          >
            <UploadCloud className="size-7 text-primary" aria-hidden />
            <span className="text-sm font-medium">Tap to choose a file</span>
            <span className="text-xs text-muted-foreground">or drop it here · text-based PDF or DOCX, up to 5 MB</span>
          </label>
        )}
        <input ref={inputRef} id="file" type="file" accept={ACCEPT} className="sr-only" onChange={(e) => pick(e.target.files?.[0])} />
      </div>

      {error && (
        <p role="alert" className="rounded-md bg-gap-soft px-3 py-2 text-sm text-gap">
          {error}
        </p>
      )}

      <Button type="submit" variant="ink" size="xl" className="w-full" disabled={busy}>
        {busy ? (<><Loader2 className="animate-spin" /> Analysing resume…</>) : "Upload & analyze"}
      </Button>
      <p className="text-center text-xs text-muted-foreground">Identical files are detected and not stored twice.</p>
    </form>
  );
}
