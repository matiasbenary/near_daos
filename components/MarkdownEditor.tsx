import React, { forwardRef } from "react";
import MDEditor from "@uiw/react-md-editor";
import { clsx } from "clsx";

interface MarkdownEditorProps {
  value?: string;
  onChange?: (value?: string) => void;
  placeholder?: string;
  height?: number;
  preview?: "live" | "edit" | "preview";
  className?: string;
  isInvalid?: boolean;
  errorMessage?: string;
  label?: string;
  isRequired?: boolean;
}

const MarkdownEditor = forwardRef<HTMLDivElement, MarkdownEditorProps>(
  (
    {
      value = "",
      onChange,
      placeholder = "Write your markdown here...",
      height = 200,
      preview = "live",
      className,
      isInvalid = false,
      errorMessage,
      label,
      isRequired = false,
      ...props
    },
    ref,
  ) => {
    const handleChange = (val?: string) => {
      onChange?.(val || "");
    };

    return (
      <div ref={ref} className={clsx("w-full", className)}>
        {label && (
          <label className="block text-sm font-medium mb-2 text-foreground">
            {label}
            {isRequired && <span className="text-danger ml-1">*</span>}
          </label>
        )}

        <div
          className={clsx(
            "border rounded-lg overflow-hidden transition-colors",
            isInvalid
              ? "border-danger-500 bg-danger-50/50"
              : "border-foreground/20 hover:border-foreground/40 focus-within:border-primary",
          )}
          data-color-mode="light"
        >
          <MDEditor
            height={height}
            preview={preview}
            previewOptions={{
              style: {
                fontSize: "14px",
                lineHeight: "1.5",
                padding: "12px",
              },
            }}
            textareaProps={{
              placeholder,
              style: {
                fontSize: "14px",
                lineHeight: "1.5",
                fontFamily: "inherit",
                padding: "12px",
              },
              "aria-label": label || "Markdown editor",
              "aria-invalid": isInvalid,
              "aria-describedby":
                isInvalid && errorMessage ? `${label}-error` : undefined,
            }}
            value={value}
            visibleDragbar={false}
            onChange={handleChange}
            {...props}
          />
        </div>

        {isInvalid && errorMessage && (
          <p
            className="text-danger-500 text-sm mt-1"
            id={`${label}-error`}
            role="alert"
          >
            {errorMessage}
          </p>
        )}
      </div>
    );
  },
);

MarkdownEditor.displayName = "MarkdownEditor";

export default MarkdownEditor;
