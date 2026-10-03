"use client";

import React, { useState } from "react";
import JSZip from "jszip";
import {
  Download,
  CheckCircle2,
  FileCode,
  Package,
  Database,
  ShieldCheck,
  Sparkles,
  X,
  Loader2,
  ExternalLink,
  Copy,
  Check,
  Info,
  Folder,
  File,
  Code2,
} from "lucide-react";

interface ZipDownloadModalProps {
  onClose: () => void;
}

export function ZipDownloadModal({ onClose }: ZipDownloadModalProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");
  const [activeTab, setActiveTab] = useState<"download" | "explorer" | "setup">("download");

  // Code Explorer State
  const [loadedFiles, setLoadedFiles] = useState<Record<string, string> | null>(null);
  const [selectedFile, setSelectedFile] = useState<string>("src/db/schema.ts");
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [copiedFile, setCopiedFile] = useState(false);

  // 100% In-Browser Client-Side Zip Generation
  const handleClientSideDownload = async () => {
    setDownloading(true);
    setProgressMsg("প্রজেক্টের সোর্স ফাইলগুলো প্রস্তুত হচ্ছে...");

    try {
      // 1. Fetch JSON with all source files from the API inside current Arena session
      const res = await fetch("/api/export-project");
      if (!res.ok) {
        throw new Error("Failed to load project files");
      }
      const data = await res.json();
      if (!data.files) {
        throw new Error("No files received");
      }

      setLoadedFiles(data.files);
      setProgressMsg(`${Object.keys(data.files).length}টি ফাইল জিপ কম্প্রেস করা হচ্ছে...`);

      // 2. Build ZIP in client memory using JSZip
      const zip = new JSZip();
      for (const [filePath, content] of Object.entries(data.files)) {
        zip.file(filePath, content as string);
      }

      // 3. Generate Blob
      const blob = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 6 },
      });

      // 4. Trigger download via Blob URL
      setProgressMsg("ডাউনলোড শুরু হচ্ছে...");
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `rajshahi-tours-and-travels-${new Date().toISOString().split("T")[0]}.zip`;
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
        setDownloading(false);
        setDownloaded(true);
        setProgressMsg("");
      }, 800);
    } catch (err) {
      console.error("Client zip download error:", err);
      alert("ডাউনলোড করতে সমস্যা হয়েছে: " + String(err));
      setDownloading(false);
      setProgressMsg("");
    }
  };

  const loadExplorer = async () => {
    setActiveTab("explorer");
    if (!loadedFiles) {
      setLoadingFiles(true);
      try {
        const res = await fetch("/api/export-project");
        const data = await res.json();
        if (data.files) {
          setLoadedFiles(data.files);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingFiles(false);
      }
    }
  };

  const handleCopyCurrentFile = () => {
    if (loadedFiles && loadedFiles[selectedFile]) {
      navigator.clipboard.writeText(loadedFiles[selectedFile]);
      setCopiedFile(true);
      setTimeout(() => setCopiedFile(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-5 border border-slate-200 relative shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Top Header */}
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center mx-auto border border-teal-200 shadow-xs">
            <Download className="w-6 h-6 text-teal-700 animate-bounce" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            সম্পূর্ণ প্রজেক্ট সোর্স কোড ডাউনলোড (.ZIP)
          </h3>
          <p className="text-xs text-slate-500">
            Next.js 15, React 19, Tailwind CSS, PostgreSQL ও Drizzle ORM
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab("download")}
            className={`py-2 px-4 border-b-2 transition-colors ${
              activeTab === "download"
                ? "border-teal-700 text-teal-900 bg-teal-50/50 rounded-t-lg"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            ১-ক্লিক জিপ ডাউনলোড
          </button>
          <button
            onClick={loadExplorer}
            className={`py-2 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === "explorer"
                ? "border-teal-700 text-teal-900 bg-teal-50/50 rounded-t-lg"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>সোর্স কোড ফাইল এক্সপ্লোরার</span>
          </button>
          <button
            onClick={() => setActiveTab("setup")}
            className={`py-2 px-4 border-b-2 transition-colors ${
              activeTab === "setup"
                ? "border-teal-700 text-teal-900 bg-teal-50/50 rounded-t-lg"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            সেটআপ গাইড
          </button>
        </div>

        {/* TAB 1: DOWNLOAD */}
        {activeTab === "download" && (
          <div className="space-y-4">
            {/* Arena info notice */}
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <b>কেন নতুন ব্রাউজার ট্যাবে "Preview Unavailable" দেখায়?</b> অ্যারেনা (Arena) সিকিউরিটি পলিসির কারণে আলাদা ট্যাবে সরাসরি লিংক খুলতে দেয় না। 
                নিচের বাটনটি চাপলে <b>কোনো নতুন ট্যাব খোলা ছাড়াই আপনার ব্রাউজারের মেমরিতে সরাসরি জিপ ফাইল তৈরি হয়ে পিসিতে নামবে।</b>
              </div>
            </div>

            {/* Checklist */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
              <div className="font-bold text-slate-900">জিপ ফাইলের ভেতর যা যা থাকবে:</div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>পাবলিক ল্যান্ডিং ওয়েবসাইট</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>স্টাফ ও গাইড ড্যাশবোর্ড</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>ইন-ট্যুর SMS ও লাইভ iPhone ফ্রেম</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>লিড ইনকোয়ারি কানবান বোর্ড</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>কাস্টমার CRM ও ফিল্টার</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>মাসিক হিসাব ও P&L রসিদ</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>গ্রাউন্ড কন্টাক্টস ডিরেক্টরি</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>PostgreSQL স্কিমা ও ডেমো ডাটা</span>
                </div>
              </div>
            </div>

            {/* Main Action Button */}
            <button
              onClick={handleClientSideDownload}
              disabled={downloading}
              className="w-full py-3.5 bg-gradient-to-r from-teal-800 to-teal-950 hover:from-teal-900 hover:to-black text-white font-bold text-sm rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-75 hover:scale-[1.01] active:scale-[0.99]"
            >
              {downloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                  <span>{progressMsg || "ডাউনলোড তৈরি হচ্ছে..."}</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-amber-300" />
                  <span>{downloaded ? "পুনরায় ডাউনলোড করুন (.ZIP)" : "এখনই ডাউনলোড করুন (Download .ZIP)"}</span>
                </>
              )}
            </button>

            {/* Success message */}
            {downloaded && (
              <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <b>সফলভাবে ডাউনলোড শুরু হয়েছে!</b> আপনার কম্পিউটারের <b>Downloads</b> ফোল্ডার চেক করুন।
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: IN-BROWSER CODE EXPLORER & COPY */}
        {activeTab === "explorer" && (
          <div className="space-y-3">
            {loadingFiles ? (
              <div className="py-12 text-center text-xs text-slate-500">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-teal-700 mb-2" />
                <span>ফাইলগুলো লোড হচ্ছে...</span>
              </div>
            ) : loadedFiles ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">ফাইল নির্বাচন করুন ({Object.keys(loadedFiles).length}টি ফাইল):</span>
                  <button
                    onClick={handleCopyCurrentFile}
                    className="flex items-center gap-1 text-teal-800 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-lg border border-teal-200 font-bold"
                  >
                    {copiedFile ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedFile ? "কোড কপি হয়েছে!" : "এই ফাইলের কোড কপি করুন"}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  {/* File List */}
                  <div className="sm:col-span-5 max-h-56 overflow-y-auto p-1.5 border border-slate-200 rounded-xl bg-slate-50 space-y-1 text-[11px]">
                    {Object.keys(loadedFiles).map((f) => (
                      <button
                        key={f}
                        onClick={() => setSelectedFile(f)}
                        className={`w-full text-left p-1.5 rounded-lg truncate flex items-center gap-1.5 font-mono ${
                          selectedFile === f
                            ? "bg-teal-800 text-white font-bold"
                            : "hover:bg-slate-200/70 text-slate-700"
                        }`}
                      >
                        <File className="w-3 h-3 shrink-0" />
                        <span className="truncate">{f}</span>
                      </button>
                    ))}
                  </div>

                  {/* Code Viewer */}
                  <div className="sm:col-span-7 max-h-56 overflow-y-auto p-2 bg-slate-950 text-slate-200 rounded-xl font-mono text-[10px] leading-relaxed">
                    <pre>{loadedFiles[selectedFile] || "// খালি ফাইল"}</pre>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* TAB 3: SETUP INSTRUCTIONS */}
        {activeTab === "setup" && (
          <div className="space-y-3 text-xs text-slate-700">
            <div className="p-3 bg-slate-50 rounded-2xl border space-y-2">
              <div className="font-bold text-slate-900">পিসিতে চালু করার ৩টি সহজ ধাপ:</div>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-600 font-medium leading-relaxed">
                <li>ডাউনলোড করা <code>.zip</code> ফাইলটি আনজিপ করুন।</li>
                <li>টার্মিনালে কমান্ড দিন: <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-900 font-mono">npm install</code></li>
                <li>এনভায়রনমেন্ট ফাইলে <code>DATABASE_URL</code> দিন এবং রান করুন: <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-900 font-mono">npm run dev</code></li>
                <li>ব্রাউজারে <code>http://localhost:3000</code> এ ঢুকলেই সম্পূর্ণ সাইট ও ড্যাশবোর্ড চালু হয়ে যাবে।</li>
              </ol>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
