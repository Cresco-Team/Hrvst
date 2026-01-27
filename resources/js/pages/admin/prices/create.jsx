import { Link, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import AppLayout from "@/layouts/app-layout";

const CreatePrice = ({ crop }) => {
  const { data, setData, post, processing, errors } = useForm({
    price_min: "",
    price_max: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route("admin.crops.prices.store", crop.id), {
      preserveScroll: true,
    });
  };

  return (
    <AppLayout title={`Update Price — ${crop.name}`}>
      <form onSubmit={handleSubmit} className="container mx-auto p-6">
        <FieldSet>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-4">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="price_min">Minimum Price</FieldLabel>
                  <Input
                    id="price_min"
                    value={data.price_min}
                    onChange={(e) => setData("price_min", e.target.value)}
                    placeholder="00.00"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="price_max">Maximum Price</FieldLabel>
                  <Input
                    id="price_max"
                    value={data.price_max}
                    onChange={(e) => setData("price_max", e.target.value)}
                    placeholder="00.00"
                  />
                </Field>
              </FieldGroup>
            </Card>

            <Card className="p-4">
              <div className="space-y-2">
                <div className="text-sm">Crop</div>
                <div className="text-lg font-medium">{crop.name}</div>
                {crop.latest_price && (
                  <div className="text-sm">
                    Latest: ₱{crop.latest_price.price_min} — ₱{crop.latest_price.price_max} (
                    {crop.latest_price.recorded_at})
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Link href={route("admin.crops.show", crop.id)}>
              <Button type="button" variant="destructive">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={processing}>
              <Plus />
              Save New Price
            </Button>
          </div>
        </FieldSet>
      </form>
    </AppLayout>
  );
}
export default CreatePrice
