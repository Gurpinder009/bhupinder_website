"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type ContactFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  description: string;
};

const inputFields = [
  { label: "First Name", id: "firstName", type: "text", autoComplete: "given-name" },
  { label: "Last Name", id: "lastName", type: "text", autoComplete: "family-name" },
  { label: "Email Address", id: "email", type: "email", autoComplete: "email" },
  { label: "Subject", id: "subject", type: "text", autoComplete: "off" },
] as const;

export default function ContactMe() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>();

  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const onSubmit: SubmitHandler<ContactFormValues> = async (data) => {
    setStatus("idle");
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_FORM_ENDPOINT!, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <main>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <h2>Get in touch</h2>

        {inputFields.map((field) => (
          <div key={field.id}>
            <label htmlFor={field.id}>{field.label}</label>
            <input
              id={field.id}
              type={field.type}
              autoComplete={field.autoComplete}
              aria-invalid={!!errors[field.id]}
              {...register(field.id, {
                required: `${field.label} is required`,
                ...(field.type === "email" && {
                  pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email address" },
                }),
              })}
            />
            {errors[field.id] && <p role="alert">{errors[field.id]?.message}</p>}
          </div>
        ))}

        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            rows={5}
            aria-invalid={!!errors.description}
            {...register("description", { required: "Please add a message" })}
          />
          {errors.description && <p role="alert">{errors.description.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Submit"}
        </button>

        {status === "success" && <p role="status">Thanks, your message was sent.</p>}
        {status === "error" && <p role="alert">Something went wrong. Please try again.</p>}
      </form>
    </main>
  );
}