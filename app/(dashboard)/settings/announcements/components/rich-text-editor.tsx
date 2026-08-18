"use client";

import { useEffect, useRef } from "react";
import {
  Bold,
  Image as ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
  Video,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

const tools = [
  { label: "Tebal", icon: Bold, command: "bold" },
  { label: "Miring", icon: Italic, command: "italic" },
  { label: "Garis bawah", icon: Underline, command: "underline" },
  { label: "Coret", icon: Strikethrough, command: "strikeThrough" },
  { label: "Daftar poin", icon: List, command: "insertUnorderedList" },
  { label: "Daftar angka", icon: ListOrdered, command: "insertOrderedList" },
  { label: "Kutipan", icon: Quote, command: "formatBlock", value: "blockquote" },
  { label: "Urungkan", icon: Undo2, command: "undo" },
  { label: "Ulangi", icon: Redo2, command: "redo" },
];

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const syncValue = () => onChange(editorRef.current?.innerHTML || "");
  const execute = (command: string, commandValue?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, commandValue);
    syncValue();
  };

  const insertLink = () => {
    const url = window.prompt("Masukkan alamat tautan (https://...)");
    if (url?.trim()) execute("createLink", url.trim());
  };

  const insertImage = () => {
    const url = window.prompt("Masukkan URL gambar (https://...)");
    if (url?.trim()) execute("insertImage", url.trim());
  };

  const insertVideo = () => {
    const url = window.prompt("Masukkan URL file video (https://...)");
    if (!url?.trim()) return;
    const safeUrl = url.trim().replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
    execute("insertHTML", `<video controls src="${safeUrl}"></video><p><br></p>`);
  };

  return (
    <div className="overflow-hidden rounded-lg border border-slate-300 bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 p-2">
        {tools.map(({ label, icon: Icon, command, value: commandValue }) => (
          <Button
            key={label}
            type="button"
            variant="ghost"
            size="icon"
            title={label}
            aria-label={label}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => execute(command, commandValue)}
            className="size-8 text-slate-600 hover:bg-blue-50 hover:text-blue-700"
          >
            <Icon className="size-4" />
          </Button>
        ))}
        <span className="mx-1 h-5 w-px bg-slate-300" />
        <Button type="button" variant="ghost" size="icon" title="Tautan" aria-label="Tautan" onMouseDown={(event) => event.preventDefault()} onClick={insertLink} className="size-8 text-slate-600 hover:bg-blue-50 hover:text-blue-700"><Link2 className="size-4" /></Button>
        <Button type="button" variant="ghost" size="icon" title="Gambar" aria-label="Gambar" onMouseDown={(event) => event.preventDefault()} onClick={insertImage} className="size-8 text-slate-600 hover:bg-blue-50 hover:text-blue-700"><ImageIcon className="size-4" /></Button>
        <Button type="button" variant="ghost" size="icon" title="Video" aria-label="Video" onMouseDown={(event) => event.preventDefault()} onClick={insertVideo} className="size-8 text-slate-600 hover:bg-blue-50 hover:text-blue-700"><Video className="size-4" /></Button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        data-placeholder="Tulis isi pengumuman di sini..."
        onInput={syncValue}
        onBlur={syncValue}
        className="min-h-52 px-4 py-3 text-sm leading-6 text-slate-800 outline-none empty:before:pointer-events-none empty:before:text-slate-400 empty:before:content-[attr(data-placeholder)] [&_a]:text-blue-600 [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-blue-200 [&_blockquote]:pl-3 [&_img]:my-3 [&_img]:max-h-80 [&_img]:max-w-full [&_img]:rounded-lg [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_video]:my-3 [&_video]:max-h-80 [&_video]:max-w-full [&_video]:rounded-lg"
      />
    </div>
  );
}
