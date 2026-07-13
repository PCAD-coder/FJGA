"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";



import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import OrderSelector from "./order-selector";
import PhotoUpload from "./photo-upload";
import SelectedOrderCard from "./selected-order-card";

import { CustomerOrder } from "../types/return";

interface Props {
    orders: CustomerOrder[];
}

export default function ReturnRequestForm({
    orders,
}: Props) {

    const [selectedOrder, setSelectedOrder] = useState("");

    const [issueType, setIssueType] = useState("");
    const selected = orders.find(
  (order) => order.id === selectedOrder
);

    return (

        <div className="rounded-xl border bg-card p-6 space-y-6">

            <h2 className="text-xl font-semibold">
                Report an Issue
            </h2>

            <OrderSelector
                orders={orders}
                value={selectedOrder}
                onChange={setSelectedOrder}
            />
            {selected && (
  <SelectedOrderCard
    order={selected}
  />
)}

            <div className="space-y-2">

                <Label>
                    2. Issue Type
                </Label>

                <Select
                    value={issueType}
                    onValueChange={setIssueType}
                >

                    <SelectTrigger>

                        <SelectValue placeholder="Select issue type" />

                    </SelectTrigger>

                    <SelectContent>

                        <SelectItem value="Damaged">
                            Damaged Product
                        </SelectItem>

                        <SelectItem value="Wrong Item">
                            Wrong Item Delivered
                        </SelectItem>

                        <SelectItem value="Missing Parts">
                            Missing Parts
                        </SelectItem>

                        <SelectItem value="Wrong Dimensions">
                            Wrong Dimensions
                        </SelectItem>

                        <SelectItem value="Glass Defect">
                            Glass Defect
                        </SelectItem>

                        <SelectItem value="Others">
                            Others
                        </SelectItem>

                    </SelectContent>

                </Select>

            </div>

            <div className="space-y-2">

                <Label>
                    3. Detailed Description
                </Label>

                <Textarea
                    rows={5}
                    placeholder="Please describe the issue in detail. Include information about when you discovered the problem, what specifically is wrong, and any other relevant details..."
                />

                <p className="text-xs text-muted-foreground">
                    Minimum 50 characters. Be as specific as possible.
                </p>

            </div>

            <PhotoUpload />

            <div className="space-y-2">

                <Label>
                    5. Contact Number (Optional)
                </Label>

                <Input placeholder="0917-XXX-XXXX" />

                <p className="text-xs text-muted-foreground">
                    For faster resolution, we may need to contact you.
                </p>

            </div>

            <Button
                className="w-full"
                size="lg"
            >
                Submit Return Request
            </Button>

        </div>

    );

}   