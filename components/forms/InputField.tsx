import React from "react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

const InputField = ({
  name,
  label,
  placeholder,
  type = "text",
  register,
  error,
  value,
  disabled,
  validation,
}: FormInputProps) => {
  return (
    <div className="space-y-2">
      <label htmlFor="name" className="form-label">
        {label}
      </label>
      <Input
        type={type}
        id={name}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        className={cn("form-input", {
          "opacity-50 cursor-not-allowed": disabled,
        })}
        {...register(name, validation)}
      />
      {error && <p className="text-sm text-red-500 ">{error.message}</p>}
    </div>
  );
};

export default InputField;
