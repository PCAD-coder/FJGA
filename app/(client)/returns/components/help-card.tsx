import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Phone,
  Mail,
  Clock3,
  MessageCircle,
} from "lucide-react";

export default function HelpCard() {
  return (
    <Card>

      <CardHeader>

        <CardTitle>
          Need Help?
        </CardTitle>

      </CardHeader>

      <CardContent className="space-y-5">

        <div className="flex items-center gap-3">

          <Phone className="h-5 w-5 text-primary" />

          <div>

            <p className="font-medium">
              Contact Number
            </p>

            <p className="text-sm text-muted-foreground">
              +63 917 123 4567
            </p>

          </div>

        </div>

        <div className="flex items-center gap-3">

          <Mail className="h-5 w-5 text-primary" />

          <div>

            <p className="font-medium">
              Email
            </p>

            <p className="text-sm text-muted-foreground">
              support@fjglass.com
            </p>

          </div>

        </div>

        <div className="flex items-center gap-3">

          <Clock3 className="h-5 w-5 text-primary" />

          <div>

            <p className="font-medium">
              Business Hours
            </p>

            <p className="text-sm text-muted-foreground">
              Monday - Saturday
            </p>

            <p className="text-sm text-muted-foreground">
              8:00 AM - 5:00 PM
            </p>

          </div>

        </div>

        <div className="rounded-lg bg-primary/5 border p-4 flex gap-3">

          <MessageCircle className="h-5 w-5 text-primary shrink-0 mt-1" />

          <p className="text-sm">
            Our customer support team usually responds to return inquiries
            within <span className="font-semibold">24 hours.</span>
          </p>

        </div>

      </CardContent>

    </Card>
  );
}