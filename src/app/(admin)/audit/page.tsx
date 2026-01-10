import AuditForm from "./auditForm";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <section className="w-full">
      <div className="mb-4">
        <h1 className="text-xl font-semibold">Audit Log</h1>
        <p className="text-sm text-muted-foreground">
          System activity and security events
        </p>
      </div>

      <AuditForm />
    </section>
  );
}
