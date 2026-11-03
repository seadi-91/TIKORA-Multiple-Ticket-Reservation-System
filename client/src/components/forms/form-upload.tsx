import React from "react";
import { UploadCloud } from "lucide-react";

interface FormUploadProps {
  label: string;
  accept?: string;
  helperText?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FormUpload({ label, accept = "image/*", helperText, onChange }: FormUploadProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-[#0F172A] dark:text-slate-200">{label}</label>
      <div className="relative border-2 border-dashed border-[#E2E8F0] dark:border-slate-800 hover:border-[#F59E0B] dark:hover:border-indigo-500 rounded-xl p-6 text-center bg-white dark:bg-[#161922] transition-colors cursor-pointer group">
        <input
          type="file"
          accept={accept}
          onChange={onChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        <div className="w-10 h-10 mx-auto rounded-full bg-[#FFFBEB] dark:bg-amber-950/60 text-[#F59E0B] dark:text-amber-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
          <UploadCloud className="w-5 h-5" />
        </div>
        <p className="text-xs font-semibold text-[#0F172A] dark:text-slate-300">
          Click to upload or drag & drop
        </p>
        {helperText && (
          <p className="text-[11px] text-[#64748B] dark:text-amber-400/60 mt-1">{helperText}</p>
        )}
      </div>
    </div>
  );
}

export default FormUpload;

