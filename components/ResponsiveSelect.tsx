"use client";
import { useEffect, useState } from "react";
import { isMobile } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Option = { value: string; label: string };

export function ResponsiveSelect({
  value,
  onChange,
  options,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  className?: string;
}) {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    setMobile(isMobile());
  }, []);

  if (mobile) {
    return (
      <div className={`relative w-full sm:w-48 ${className}`}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-input rounded-md bg-white px-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none transition h-9"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={`w-full sm:w-48 ${className}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
