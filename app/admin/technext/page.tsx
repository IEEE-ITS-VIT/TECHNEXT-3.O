import Link from "next/link";
import { all, parseJson } from "@/lib/db";
import { formatInr, getSettings } from "@/lib/settings";
import { fmtIst } from "@/lib/portal/actions";
import { PAYMENT_STATUSES } from "@/lib/payments";
import { processRefundAction, updateTechnextBookingAction } from "@/app/actions/admin-records";
import ScopeTools from "@/components/admin/ScopeTools";
import SubmitButton from "@/components/portal/SubmitButton";
import { Card, Empty, Field, Flash, PortalPage, Stat, StatusBadge, inputCls } from "@/components/portal/ui";

interface Booking {
  id: string;
  organization_name: string;
  organization_type: string;
  sector: string;
  contact_name: string;
  designation: string | null;
  email: string;
  phone: string;
  city: string;
  state: string | null;
  website: string | null;
  stall_type: string;
  representatives: string;
  exhibit_description: string;
  power_required: number;
  special_requirements: string | null;
  gst_number: string | null;
  status: string;
  admin_notes: string | null;
  payment_status: string;
  payment_amount: number;
  payment_ref: string | null;
  payment_link: string | null;
  created_at: string;
}

const small = `${inputCls} !py-1.5 !text-sm`;

export default async function AdminTechnextPage({ searchParams }: { searchParams: Promise<{ ok?: string; error?: string; status?: string }> }) {
  const { ok, error, status = "all" } = await searchParams;
  const settings = await getSettings();
  const stallLabel = new Map(settings.technext.stallTypes.map((s) => [s.key, s.label]));
  const bookings = await all<Booking>(`SELECT * FROM technext_bookings ${status !== "all" ? "WHERE status = ?" : ""} ORDER BY created_at DESC`, status !== "all" ? [status] : []);
  const stats = await all<{ status: string; n: number }>("SELECT status, COUNT(*) AS n FROM technext_bookings GROUP BY status");
  const count = (s: string) => stats.find((x) => x.status === s)?.n ?? 0;

  return (
    <PortalPage title="TechNext '28 stalls" subtitle="Review stall bookings, confirm payments and send updates to exhibitors." width="max-w-7xl">
      <Flash ok={ok} error={error} />
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Pending review" value={count("pending")} />
        <Stat label="Approved" value={count("approved")} />
        <Stat label="Rejected" value={count("rejected")} />
        <Stat label="Cancelled" value={count("cancelled")} />
      </div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {["all", "pending", "approved", "rejected", "cancelled"].map((s) => (
            <Link key={s} href={`/admin/technext?status=${s}`} className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize ${s === status ? "bg-brand-primary text-white" : "border border-slate-300 bg-white text-slate-700"}`}>
              {s}
            </Link>
          ))}
        </div>
        <a
          href="/api/admin/export?scope=technext&format=xlsx"
          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export Stalls (Excel .xlsx)
        </a>
      </div>
      {bookings.length === 0 ? (
        <Empty>No bookings{status !== "all" ? ` with status ${status}` : " yet"}.</Empty>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <details key={b.id} id={`b-${b.id}`} className="scroll-mt-28 rounded-2xl border border-slate-200 bg-white shadow-sm">
              <summary className="flex cursor-pointer flex-wrap items-center gap-3 px-5 py-4">
                <span className="font-bold text-brand-primary">{b.organization_name}</span>
                <span className="text-sm text-slate-500">
                  {stallLabel.get(b.stall_type) ?? b.stall_type} · {b.organization_type} · {b.city}
                </span>
                <StatusBadge status={b.status} />
                <StatusBadge status={b.payment_status} />
                <span className="ml-auto text-xs text-slate-400">{fmtIst(b.created_at)}</span>
              </summary>
              <div className="grid gap-6 border-t border-slate-100 px-5 py-5 lg:grid-cols-2">
                <dl className="grid grid-cols-[140px_1fr] gap-x-3 gap-y-1.5 text-sm">
                  <dt className="text-slate-500">Contact</dt>
                  <dd>
                    {b.contact_name}
                    {b.designation && `, ${b.designation}`}
                  </dd>
                  <dt className="text-slate-500">Email / phone</dt>
                  <dd>
                    {b.email} · {b.phone}
                  </dd>
                  <dt className="text-slate-500">Sector</dt>
                  <dd>{b.sector}</dd>
                  <dt className="text-slate-500">Location</dt>
                  <dd>
                    {b.city}
                    {b.state && `, ${b.state}`}
                  </dd>
                  {b.website && (
                    <>
                      <dt className="text-slate-500">Website</dt>
                      <dd>
                        <a href={b.website} target="_blank" rel="noopener noreferrer" className="text-brand-secondary underline">
                          {b.website}
                        </a>
                      </dd>
                    </>
                  )}
                  <dt className="text-slate-500">Representatives</dt>
                  <dd>{parseJson<string[]>(b.representatives, []).join(", ")}</dd>
                  <dt className="text-slate-500">Power</dt>
                  <dd>{b.power_required ? "Required" : "Not required"}</dd>
                  {b.gst_number && (
                    <>
                      <dt className="text-slate-500">GSTIN</dt>
                      <dd>{b.gst_number}</dd>
                    </>
                  )}
                  <dt className="text-slate-500">Exhibit</dt>
                  <dd className="whitespace-pre-line">{b.exhibit_description}</dd>
                  {b.special_requirements && (
                    <>
                      <dt className="text-slate-500">Requirements</dt>
                      <dd className="whitespace-pre-line">{b.special_requirements}</dd>
                    </>
                  )}
                </dl>
                <form action={updateTechnextBookingAction} className="grid gap-3 sm:grid-cols-2">
                  <input type="hidden" name="id" value={b.id} />
                  <input type="hidden" name="filter" value={status} />
                  <Field label="Booking status" hint="Approving or rejecting emails the exhibitor.">
                    <select name="status" defaultValue={b.status} className={small}>
                      {["pending", "approved", "rejected", "cancelled"].map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label={`Amount (${formatInr(b.payment_amount)})`}>
                    <input name="payment_amount" type="number" min={0} defaultValue={b.payment_amount} className={small} />
                  </Field>
                  <Field label="Payment status">
                    {b.payment_status === "paid" ? (
                      <div className="flex flex-col gap-1.5 pt-1">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-green-100 text-green-800 border border-green-200 shadow-xs">
                          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                          PAID (CONFIRMED &amp; LOCKED)
                        </span>
                        <input type="hidden" name="payment_status" value="paid" />
                        <span className="text-[11px] text-slate-500">Confirmed via payment gateway. Status is locked and cannot be edited manually.</span>
                      </div>
                    ) : b.payment_status === "refunded" ? (
                      <div className="flex flex-col gap-1.5 pt-1">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200 shadow-xs">
                          REFUNDED
                        </span>
                        <input type="hidden" name="payment_status" value="refunded" />
                      </div>
                    ) : (
                      <select name="payment_status" defaultValue={b.payment_status} className={small}>
                        {PAYMENT_STATUSES.filter((s) => s !== "paid" || settings.payments.provider !== "vit").map((s) => (
                          <option key={s} value={s}>
                            {s.replace("_", " ")}
                          </option>
                        ))}
                      </select>
                    )}
                  </Field>
                  <Field label="Payment reference / UTR">
                    <input name="payment_ref" defaultValue={b.payment_ref ?? ""} className={small} />
                  </Field>
                  <Field label="Payment link for this booking" className="sm:col-span-2" hint="Overrides the global TechNext payment link.">
                    <input name="payment_link" type="url" defaultValue={b.payment_link ?? ""} placeholder="https://" className={small} />
                  </Field>
                  <Field label="Note to exhibitor (shown on their booking page)" className="sm:col-span-2">
                    <textarea name="admin_notes" rows={2} defaultValue={b.admin_notes ?? ""} className={small} />
                  </Field>
                  <div className="sm:col-span-2">
                    <SubmitButton pendingText="Saving…">Save</SubmitButton>
                  </div>
                </form>

                {b.payment_status === "paid" && (
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <details className="rounded-xl border border-rose-200 bg-rose-50/50 p-4">
                      <summary className="cursor-pointer text-xs font-bold text-rose-700 hover:text-rose-800 flex items-center justify-between">
                        <span>Issue Refund for this Booking</span>
                        <span className="text-[11px] font-normal text-rose-600">Requires ieeeitsvitscore@gmail.com Password</span>
                      </summary>
                      <form action={processRefundAction} className="mt-3 space-y-3 pt-3 border-t border-rose-200/80">
                        <input type="hidden" name="purpose" value="technext" />
                        <input type="hidden" name="id" value={b.id} />
                        <input type="hidden" name="back" value={`/admin/technext?status=${status}#b-${b.id}`} />
                        <Field label="Refund Authorization Password" hint="Required. Set in ieeeitsvitscore@gmail.com profile.">
                          <input name="refund_password" type="password" required className={small} placeholder="Enter refund authorization password" />
                        </Field>
                        <Field label="Refund Reason / Notes">
                          <input name="refund_reason" type="text" className={small} placeholder="e.g. Delegate cancellation, requested refund" />
                        </Field>
                        <SubmitButton
                          className="!bg-rose-600 hover:!bg-rose-700 text-white !py-2 !px-4 !text-xs font-bold rounded-lg shadow-sm"
                          pendingText="Processing refund…"
                          confirm={`Are you sure you want to refund ${formatInr(b.payment_amount)} to ${b.organization_name}? This will cancel the booking.`}
                        >
                          Confirm &amp; Authorize Refund
                        </SubmitButton>
                      </form>
                    </details>
                  </div>
                )}
              </div>
            </details>
          ))}
        </div>
      )}
      <ScopeTools scope="technext" back={`/admin/technext?status=${status}`} label="exhibitors" />
    </PortalPage>
  );
}
