import { Button } from "@/components/ui/button";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
} from "@/components/ui/table";
import CreateSeason from "@/feature/adminDashboard/CreateSeason";

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
];

export default function SeasonDashboard() {
  return (
    <div className=" flex-1">
        <div className=" w-full flex flex-row justify-between px-3">
        <h1 className=" text-neutral-100 text-xl font-[700]">Season Dashboard</h1>
        <CreateSeason/>
        </div>
      
      <Table className="  mt-3 text-neutral-100 border-separate border-spacing-y-3">
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader className=" text-neutral-100 bg-neutral-900">
          <TableRow className=" text-neutral-100 bg-neutral-950">
            <TableHead className=" text-neutral-100">Invoice</TableHead>
            <TableHead className="text-neutral-100">Status</TableHead>
            <TableHead className="text-neutral-100">Method</TableHead>
            <TableHead className="text-right text-neutral-100">
              Amount
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className=" mt-3">
          {invoices.map((invoice, index) => {
            const isEven = index % 2;

            const background = isEven ? "bg-neutral-950" : "bg-neutral-800";
            return (
              <TableRow className={` ${background}`} key={invoice.invoice}>
                <TableCell className=" py-3">{invoice.invoice}</TableCell>
                <TableCell className=" py-3">{invoice.paymentStatus}</TableCell>
                <TableCell className=" py-3">{invoice.paymentMethod}</TableCell>
                <TableCell className="text-right py-3">
                  {invoice.totalAmount}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
