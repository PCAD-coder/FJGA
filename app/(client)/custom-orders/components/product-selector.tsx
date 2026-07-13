import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ProductOption } from "../types/customization";

interface Props {
  products: ProductOption[];
  value: string;
}

export default function ProductSelector({
  products,
  value,
}: Props) {
  return (
    <div className="space-y-2">

      <label className="text-sm font-medium">
        Product Type
      </label>

      <Select defaultValue={value}>

        <SelectTrigger>

          <SelectValue />

        </SelectTrigger>

        <SelectContent>

          {products.map((product) => (
            <SelectItem
              key={product.id}
              value={product.id}
            >
              {product.name}
            </SelectItem>
          ))}

        </SelectContent>

      </Select>

    </div>
  );
}