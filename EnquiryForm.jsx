import { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { sendEnquiry } from "../lib/api";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EnquiryForm({ presetType = "general", presetReference = "" }) {
  const { t, lang } = useLanguage();
  const f = t.contact.form;
  const [form, setForm] = useState({
    name: "", email: "", phone: "", company: "",
    type: presetType, reference: presetReference, message: "",
    privacy: false, website: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  const set = (k) => (e) => {
    const v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: undefined }));
  };

  const validate = () => {
    const errs = {};
    if (form.name.trim().length < 2) errs.name = f.err_required;
    if (!EMAIL_RE.test(form.email)) errs.email = f.err_email;
    if (form.message.trim().length < 10) errs.message = f.err_message;
    if (!form.privacy) errs.privacy = f.err_privacy;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate() || status === "sending") return;
    setStatus("sending");
    try {
      await sendEnquiry({ ...form, lang });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div data-testid="enquiry-success" className="border border-line bg-stone px-8 py-12">
        <p className="font-serif text-2xl text-ink">{f.success_title}</p>
        <p className="mt-3 text-sm font-light leading-relaxed text-mute">{f.success_body}</p>
      </div>
    );
  }

  const fieldCls = "w-full border border-line bg-transparent px-4 py-3 text-sm font-light text-ink placeholder:text-mute/70 transition-colors focus:border-ink focus:outline-none";
  const labelCls = "mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-mute";
  const errCls = "mt-1.5 text-xs text-[#8c3b2e]";

  return (
    <form onSubmit={submit} noValidate data-testid="enquiry-form" className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="eq-name" className={labelCls}>{f.name} *</label>
          <input id="eq-name" data-testid="enquiry-name" className={fieldCls} value={form.name} onChange={set("name")} autoComplete="name" />
          {errors.name && <p className={errCls} role="alert">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="eq-email" className={labelCls}>{f.email} *</label>
          <input id="eq-email" type="email" data-testid="enquiry-email" className={fieldCls} value={form.email} onChange={set("email")} autoComplete="email" />
          {errors.email && <p className={errCls} role="alert">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="eq-phone" className={labelCls}>{f.phone}</label>
          <input id="eq-phone" type="tel" data-testid="enquiry-phone" className={fieldCls} value={form.phone} onChange={set("phone")} autoComplete="tel" />
        </div>
        <div>
          <label htmlFor="eq-company" className={labelCls}>{f.company}</label>
          <input id="eq-company" data-testid="enquiry-company" className={fieldCls} value={form.company} onChange={set("company")} autoComplete="organization" />
        </div>
        <div>
          <label htmlFor="eq-type" className={labelCls}>{f.type} *</label>
          <select id="eq-type" data-testid="enquiry-type" className={fieldCls} value={form.type} onChange={set("type")}>
            {Object.entries(f.types).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="eq-ref" className={labelCls}>{f.reference}</label>
          <input id="eq-ref" data-testid="enquiry-reference" className={fieldCls} value={form.reference} onChange={set("reference")} />
        </div>
      </div>
      <div>
        <label htmlFor="eq-message" className={labelCls}>{f.message} *</label>
        <textarea id="eq-message" rows={5} data-testid="enquiry-message" className={`${fieldCls} resize-y`} value={form.message} onChange={set("message")} />
        {errors.message && <p className={errCls} role="alert">{errors.message}</p>}
      </div>
      <input
        type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0" value={form.website} onChange={set("website")}
      />
      <div>
        <label className="flex cursor-pointer items-start gap-3" htmlFor="eq-privacy">
          <input id="eq-privacy" type="checkbox" data-testid="enquiry-privacy" checked={form.privacy} onChange={set("privacy")} className="mt-0.5 h-4 w-4 shrink-0 accent-ink" />
          <span className="text-xs font-light leading-relaxed text-mute">{f.privacy} *</span>
        </label>
        {errors.privacy && <p className={errCls} role="alert">{errors.privacy}</p>}
      </div>
      {status === "error" && (
        <p data-testid="enquiry-error" className="border border-[#8c3b2e]/30 bg-[#8c3b2e]/5 px-4 py-3 text-sm text-[#8c3b2e]" role="alert">{f.error_body}</p>
      )}
      <button
        type="submit"
        data-testid="enquiry-submit-button"
        disabled={status === "sending"}
        className="group relative overflow-hidden bg-night px-10 py-4 font-mono text-[11px] uppercase tracking-[0.25em] text-paper transition-opacity disabled:opacity-50"
      >
        <span className="relative z-10">{status === "sending" ? f.sending : f.submit}</span>
        <span className="absolute inset-0 -translate-x-full bg-ink transition-transform duration-500 group-hover:translate-x-0" aria-hidden="true" />
      </button>
    </form>
  );
}
