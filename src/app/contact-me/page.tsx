"use client";

import Image from "next/image";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

// ============================================================
// * CONFIG: replace these with the photographer's real details
// ============================================================

// TODO: real studio address (the map is built from this text)
const ADDRESS = "123 Example Street, Vancouver, BC";
const EMAIL = "hello@example.com";
const PHONE = "+1 (604) 555-0123";
const Insta = "https://www.instagram.com/bsaurav_"

// ? Free embed URL, no API key needed
const MAP_SRC = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11807.98116420635!2d-122.82519116072514!3d49.164543804535064!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5485d9e4b24a853b%3A0x87bba2256d9df31!2s14485%2088a%20Ave%2C%20Surrey%2C%20BC%20V3R%201A2!5e1!3m2!1sen!2sca!4v1792256212010!5m2!1sen!2sca"


// ============================================================
// * TYPES AND FORM CONFIG
// ============================================================

type ContactFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  description: string;
};

type Status = "idle" | "success" | "error";

// ? `half` fields sit side by side on tablets and up
const inputFields = [
  { label: "First Name", id: "firstName", type: "text", autoComplete: "given-name", half: true },
  { label: "Last Name", id: "lastName", type: "text", autoComplete: "family-name", half: true },
  { label: "Email Address", id: "email", type: "email", autoComplete: "email", half: false },
  { label: "Subject", id: "subject", type: "text", autoComplete: "off", half: false },
] as const;

// * Shared look for every input and the textarea
const controlClass =
  "w-full rounded border border-border bg-surface px-4 py-3 text-foreground " +
  "placeholder:text-muted/60 transition focus:border-primary focus:outline-none " +
  "focus:ring-2 focus:ring-primary/30 aria-[invalid=true]:border-accent";

// ============================================================
// * COMPONENT: ContactHero
// * Static banner photo with the page title. No autoplay, no controls.
// ============================================================

function ContactHero() {
  return (
    <section className="relative h-[45svh] min-h-[400px] max-h-[560px] w-full overflow-hidden bg-ink">
      <Image
        // TODO: replace with the photographer's real banner photo
        src="/images/photos/satwinder-image9.jpeg"
        alt="Camera and film equipment on a table"
        fill
        sizes="100vw"
        className="object-cover"
        priority
      />

      {/* ? Gradient keeps the white text readable on bright photos */}
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-black/20" />

      <div className="absolute inset-0 flex items-end">
        <div className="mx-auto w-full max-w-6xl px-6 pb-10 md:px-8 md:pb-14">
          {/* ! This is the page's only h1 */}
          <h1 className="font-serif text-4xl font-semibold text-white md:text-6xl">Get in touch</h1>
          <p className="mt-3 max-w-xl text-base text-white/90 md:text-lg">
            Tell me about your day, your film, or your idea. I usually reply within two days.
          </p>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// * COMPONENT: MapEmbed
// * Google Maps in an iframe, with an "Open in Maps" link on top.
// ============================================================

function MapEmbed() {
  return (
    <div className="relative overflow-hidden rounded-card border border-border shadow-card">
      <iframe
        title="Map showing the studio location"
        src={MAP_SRC}
        className="block h-72 w-full md:h-72"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}

// ============================================================
// * COMPONENT: ContactRow
// * Icon + small label + value, used inside the details card.
// ============================================================

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <li className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-card bg-primary/10 text-primary">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
        {href ? (
          <a href={href} className="break-words text-foreground transition-colors hover:text-primary">
            {value}
          </a>
        ) : (
          <p className="break-words text-foreground">{value}</p>
        )}
      </div>
    </li>
  );
}

// ============================================================
// * COMPONENT: ContactDetails
// * Card under the map with email, phone and address.
// ============================================================

function ContactDetails() {
  const iconProps = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  return (
    <ul className="divide-y divide-border rounded-card border border-border bg-surface p-5 shadow-card">
      <ContactRow
        label="Email"
        value={EMAIL}
        href={`mailto:${EMAIL}`}
        icon={
          <svg {...iconProps}>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3 7l9 6 9-6" />
          </svg>
        }
      />
      <ContactRow
        label="Phone"
        value={PHONE}
        href={`tel:${PHONE.replace(/[^+\d]/g, "")}`}
        icon={
          <svg {...iconProps}>
            <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />
          </svg>
        }
      />
      <ContactRow
        label="Studio"
        value={ADDRESS}
        icon={
          <svg {...iconProps}>
            <path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
        }
      />

      <ContactRow
        label="Instagram"
        value={"@bsaurav_"}
        href={Insta}
      
        icon={
          <svg {...iconProps}>
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <path d="M17.5 6.5h.01" />
          </svg>
        }
      />
    </ul>
  );
}

// ============================================================
// * COMPONENT: Field
// * Label + control + error message, so each field stays tidy.
// ============================================================

function Field({
  id,
  label,
  error,
  className = "",
  children,
}: {
  id: string;
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1.5 text-sm font-medium text-accent">
          {error}
        </p>
      )}
    </div>
  );
}

// ============================================================
// * COMPONENT: ContactForm
// * All form state and submission live here.
// ============================================================

function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>();

  const [status, setStatus] = useState<Status>("idle");

  const onSubmit: SubmitHandler<ContactFormValues> = async (data) => {
    setStatus("idle");

    // ! Fails loudly in dev if you forgot the env variable
    const endpoint = process.env.NEXT_PUBLIC_FORM_ENDPOINT;
    if (!endpoint) {
      console.error("NEXT_PUBLIC_FORM_ENDPOINT is not set");
      setStatus("error");
      return;
    }

    try {
      const res = await fetch(endpoint, {
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
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full">
      <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">Send a message</h2>
      <p className="mt-2 text-muted">Fill in the form and I&apos;ll get back to you by email.</p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {inputFields.map((field) => (
          <Field
            key={field.id}
            id={field.id}
            label={field.label}
            error={errors[field.id]?.message}
            className={field.half ? "" : "sm:col-span-2"}
          >
            <input
              id={field.id}
              type={field.type}
              autoComplete={field.autoComplete}
              aria-invalid={!!errors[field.id]}
              className={controlClass}
              {...register(field.id, {
                required: `${field.label} is required`,
                ...(field.type === "email" && {
                  pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email address" },
                }),
              })}
            />
          </Field>
        ))}

        <Field id="description" label="Message" error={errors.description?.message} className="sm:col-span-2">
          <textarea
            id="description"
            rows={4}
            aria-invalid={!!errors.description}
            className={`${controlClass} resize-y`}
            {...register("description", { required: "Please add a message" })}
          />
        </Field>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 w-full rounded bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-leaf disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isSubmitting ? "Sending..." : "Book Meeting"}
      </button>

      {/* * role="status" / "alert" makes screen readers announce the result */}
      {status === "success" && (
        <p role="status" className="mt-4 rounded-card bg-surface px-4 py-3 text-sm text-primary">
          Thanks, your message was sent.
        </p>
      )}
      {status === "error" && (
        <p role="alert" className="mt-4 rounded-card bg-surface px-4 py-3 text-sm font-medium text-accent">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}

// ============================================================
// * MAIN COMPONENT: ContactMe
// * Hero on top. Below it: map and details on the left, form on the right.
// * Stacks on phones, with the form first so it is easy to reach.
// ============================================================

export default function ContactMe() {
  return (
    <main>
      <ContactHero />

      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:px-8 md:py-16 lg:grid-cols-2 lg:gap-14">
        {/* ? order-2 on phones puts the form above the map; lg restores left/right */}
        <div className="order-2 space-y-6 lg:order-1">
          <MapEmbed />
          <ContactDetails />
        </div>

        <div className="order-1 lg:order-2">
          <ContactForm />
        </div>
      </div>
    </main>
  );
}

// TODO: turn on spam protection in the form service (honeypot or captcha)
// TODO: add a booking option only if the client picks a scheduling tool