import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Product {
  name: string;
  quantity: number;
  price: number;
}

interface Props {
  products: Product[];
}

export default function OrderProductsTable({
  products,
}: Props) {
  return (
    <div>

      <h3 className="mb-4 font-semibold">
        Ordered Products
      </h3>

      <Table>

        <TableHeader>

          <TableRow>

            <TableHead>Product</TableHead>

            <TableHead>Quantity</TableHead>

            <TableHead className="text-right">
              Price
            </TableHead>

          </TableRow>

        </TableHeader>

        <TableBody>

          {products.map((product) => (

            <TableRow key={product.name}>

              <TableCell>

                {product.name}

              </TableCell>

              <TableCell>

                {product.quantity}

              </TableCell>

              <TableCell className="text-right">

                ₱{product.price.toLocaleString()}

              </TableCell>

            </TableRow>

          ))}

        </TableBody>

      </Table>

    </div>
  );
}