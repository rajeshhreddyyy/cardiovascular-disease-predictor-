import React from "react";
import { useNavigate } from "react-router-dom";

type PageBackButtonProps = {
  fallbackPath: string;
};

export default function PageBackButton({ fallbackPath }: PageBackButtonProps) {
  const nav = useNavigate();

  function onBack() {
    if (window.history.length > 1) {
      nav(-1);
      return;
    }
    nav(fallbackPath);
  }

  return (
    <button
      type="button"
      onClick={onBack}
      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-x-0.5 hover:bg-slate-50 hover:text-slate-900"
    >
      <span aria-hidden>←</span>
      <span>Back</span>
    </button>
  );
}

