import { createClient } from "@/lib/supabase/client";

import type {
  CustomerOrder,
  ReturnRequest,
  ReturnStatus,
  TimelineEvent,
} from "../types/return";

function formatDate(date: string | null): string {
  if (!date) {
    return "—";
  }

  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function calculateWarrantyUntil(deliveredAt: string): string {
  const date = new Date(deliveredAt);

  date.setDate(date.getDate() + 7);

  return formatDate(date.toISOString());
}

function isReturnEligible(deliveredAt: string): boolean {
  const deliveredDate = new Date(deliveredAt);

  const warrantyDate = new Date(deliveredDate);

  warrantyDate.setDate(warrantyDate.getDate() + 7);

  return new Date() <= warrantyDate;
}

export async function getReturnPageData(): Promise<{
  orders: CustomerOrder[];
  requests: ReturnRequest[];
}> {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw new Error(authError.message);
  }

  if (!user) {
    throw new Error("Authentication required");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (profileError || !profile) {
    throw new Error("Customer profile not found");
  }

  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select(`
      id,
      order_number,
      created_at,
      order_items (
        product_id,
        product_name_snapshot
      ),
      deliveries (
        delivery_status,
        delivered_at
      )
    `)
    .eq("customer_id", profile.id)
    .order("created_at", { ascending: false });

  if (ordersError) {
    throw new Error(ordersError.message);
  }

  const { data: returnRequests, error: requestsError } = await supabase
    .from("return_requests")
    .select(`
      id,
      return_number,
      order_id,
      issue_type,
      description,
      submitted_at,
      status,
      return_request_timeline (
        status,
        created_at
      ),
      orders (
        order_number,
        order_items (
          product_id,
          product_name_snapshot
        )
      )
    `)
    .eq("customer_id", profile.id)
    .order("submitted_at", { ascending: false });

  if (requestsError) {
    throw new Error(requestsError.message);
  }

  const customerOrders: CustomerOrder[] = [];

for (const order of orders ?? []) {
  const delivery = Array.isArray(order.deliveries)
    ? order.deliveries[0]
    : order.deliveries;

  if (
    !delivery ||
    delivery.delivery_status !== "delivered" ||
    !delivery.delivered_at
  ) {
    continue;
  }

  const firstItem = Array.isArray(order.order_items)
    ? order.order_items[0]
    : null;

  if (!firstItem) {
    continue;
  }

  let image = "/placeholder.jpg";

  if (firstItem.product_id) {
    const { data: productImage } = await supabase
      .from("product_images")
      .select("image_url")
      .eq("product_id", firstItem.product_id)
      .order("display_order", {
        ascending: true,
      })
      .limit(1)
      .maybeSingle();

    if (productImage?.image_url) {
      image = productImage.image_url;
    }
  }

  const deliveredAt = delivery.delivered_at;

  customerOrders.push({
    id: order.id,
    orderNumber: order.order_number,
    productName:
      firstItem.product_name_snapshot ?? "Furniture Order",
    orderDate: formatDate(order.created_at),
    deliveredDate: formatDate(deliveredAt),
    warrantyUntil: calculateWarrantyUntil(deliveredAt),
    image,
    eligible: isReturnEligible(deliveredAt),
  });
}

  const customerRequests: ReturnRequest[] = (returnRequests ?? []).map(
    (request) => {
      const order = Array.isArray(request.orders)
        ? request.orders[0]
        : request.orders;

      const firstItem =
        order && Array.isArray(order.order_items)
          ? order.order_items[0]
          : null;

      const timeline: TimelineEvent[] = (
        request.return_request_timeline ?? []
      ).map((event) => ({
        status: event.status as ReturnStatus,
        date: formatDate(event.created_at),
      }));

      return {
        id: request.id,
        returnNumber: request.return_number,
        orderNumber: order?.order_number ?? "—",
        productName:
          firstItem?.product_name_snapshot ?? "Furniture Order",
        issueType: request.issue_type,
        description: request.description,
        submittedAt: formatDate(request.submitted_at),
        currentStatus: request.status as ReturnStatus,
        timeline,
      };
    }
  );

  return {
    orders: customerOrders,
    requests: customerRequests,
  };
}
export async function createReturnRequest(input: {
  orderId: string;
  issueType: string;
  description: string;
  contactNumber?: string;
}) {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw new Error(authError.message);
  }

  if (!user) {
    throw new Error("Authentication required");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (profileError || !profile) {
    throw new Error("Customer profile not found");
  }

  const description = input.description.trim();
  const issueType = input.issueType.trim();
  const contactNumber = input.contactNumber?.trim() || null;

  if (!input.orderId) {
    throw new Error("Please select an order");
  }

  if (!issueType) {
    throw new Error("Please select an issue type");
  }

  if (description.length < 50) {
    throw new Error(
      "Please provide at least 50 characters in the description"
    );
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select(`
      id,
      customer_id,
      deliveries (
        delivery_status,
        delivered_at
      )
    `)
    .eq("id", input.orderId)
    .eq("customer_id", profile.id)
    .single();

  if (orderError || !order) {
    throw new Error("Order not found");
  }

  const delivery = Array.isArray(order.deliveries)
    ? order.deliveries[0]
    : order.deliveries;

  if (
    !delivery ||
    delivery.delivery_status !== "delivered" ||
    !delivery.delivered_at
  ) {
    throw new Error(
      "This order is not eligible for a return"
    );
  }

  const deliveredDate = new Date(delivery.delivered_at);

  const returnDeadline = new Date(deliveredDate);

  returnDeadline.setDate(returnDeadline.getDate() + 7);

  if (new Date() > returnDeadline) {
    throw new Error(
      "The 7-day return period for this order has expired"
    );
  }

  const { data: returnRequest, error: insertError } = await supabase
    .from("return_requests")
    .insert({
      order_id: input.orderId,
      customer_id: profile.id,
      issue_type: issueType,
      description,
      contact_number: contactNumber,
    })
    .select(`
      id,
      return_number,
      status,
      submitted_at
    `)
    .single();

  if (insertError) {
    if (insertError.code === "23505") {
      throw new Error(
        "This order already has an active return request"
      );
    }

    throw new Error(insertError.message);
  }

  return returnRequest;
}export async function uploadReturnPhotos(
  returnRequestId: string,
  files: FileList | File[]
) {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw new Error(authError.message);
  }

  if (!user) {
    throw new Error("Authentication required");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (profileError || !profile) {
    throw new Error("Customer profile not found");
  }

  const selectedFiles = Array.from(files);

  if (selectedFiles.length > 5) {
    throw new Error("You can upload a maximum of 5 photos.");
  }

  if (selectedFiles.length === 0) {
    return [];
  }

  for (const file of selectedFiles) {
    if (!file.type.startsWith("image/")) {
      throw new Error(
        `"${file.name}" is not a supported image file.`
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      throw new Error(
        `"${file.name}" exceeds the 10 MB file size limit.`
      );
    }
  }

  const { data: returnRequest, error: requestError } =
    await supabase
      .from("return_requests")
      .select("id, customer_id")
      .eq("id", returnRequestId)
      .eq("customer_id", profile.id)
      .single();

  if (requestError || !returnRequest) {
    throw new Error("Return request not found.");
  }

  const uploadedPaths: string[] = [];
  const photoRows: {
    return_request_id: string;
    image_url: string;
    storage_path: string;
    display_order: number;
  }[] = [];

  try {
    for (let index = 0; index < selectedFiles.length; index++) {
      const file = selectedFiles[index];

      const extension =
        file.name.split(".").pop()?.toLowerCase() || "jpg";

      const fileName = `${crypto.randomUUID()}.${extension}`;

      const storagePath = [
        profile.id,
        returnRequestId,
        fileName,
      ].join("/");

      const { error: uploadError } = await supabase.storage
        .from("return-photos")
        .upload(storagePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) {
        throw new Error(
          `Failed to upload "${file.name}": ${uploadError.message}`
        );
      }

      uploadedPaths.push(storagePath);

      photoRows.push({
        return_request_id: returnRequestId,
        image_url: storagePath,
        storage_path: storagePath,
        display_order: index,
      });
    }

    const { data: photos, error: photoInsertError } =
      await supabase
        .from("return_request_photos")
        .insert(photoRows)
        .select(
          "id, return_request_id, image_url, storage_path, display_order"
        );

    if (photoInsertError) {
      throw new Error(photoInsertError.message);
    }

    return photos ?? [];
  } catch (error) {
    if (uploadedPaths.length > 0) {
      await supabase.storage
        .from("return-photos")
        .remove(uploadedPaths);
    }

    throw error;
  }
}