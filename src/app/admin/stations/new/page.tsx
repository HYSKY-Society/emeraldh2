import { PageHeader, Card, Field, Input, Select, Textarea, Button, LinkButton } from "@/components/ui";
import { createStation } from "@/app/actions/stations";
import { Plus } from "lucide-react";

export default function NewStationPage() {
  return (
    <>
      <PageHeader title="Add Station" breadcrumb={["Home", "Stations", "Add"]} />
      <Card className="max-w-2xl">
        <form action={createStation} className="flex flex-col gap-4 p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Station code" hint="e.g. 10KFS0004SOH"><Input name="code" required placeholder="10KFS0010DOH" /></Field>
            <Field label="Title"><Input name="title" required placeholder="Downtown Station" /></Field>
            <Field label="Address" ><Input name="address" required placeholder="123 Main St, Dayton, OH" /></Field>
            <Field label="Price per kg (USD)"><Input name="pricePerKg" type="number" step="0.5" defaultValue="15" /></Field>
            <Field label="Capacity (kg)"><Input name="capacityKg" type="number" step="0.5" defaultValue="10" /></Field>
            <Field label="Status">
              <Select name="status" defaultValue="active">
                <option value="active">Active (green)</option>
                <option value="maintenance">Coming soon (amber)</option>
                <option value="offline">Offline (red)</option>
              </Select>
            </Field>
            <Field label="Latitude"><Input name="latitude" type="number" step="0.0001" placeholder="39.7808" /></Field>
            <Field label="Longitude"><Input name="longitude" type="number" step="0.0001" placeholder="-84.1916" /></Field>
          </div>
          <Field label="Description"><Textarea name="description" placeholder="5,000 / 10,000 PSI hydrogen fueling appliance." /></Field>
          <div className="flex gap-2">
            <Button type="submit"><Plus size={16} /> Create Station</Button>
            <LinkButton href="/admin/stations" variant="outline">Cancel</LinkButton>
          </div>
        </form>
      </Card>
    </>
  );
}
