-- Add composite indexes for the most common dashboard, queue, and lookup filters.

CREATE INDEX "Customer_archivedAt_updatedAt_idx" ON "Customer"("archivedAt", "updatedAt");
CREATE INDEX "Product_status_name_idx" ON "Product"("status", "name");
CREATE INDEX "Quotation_status_createdAt_idx" ON "Quotation"("status", "createdAt");
CREATE INDEX "Quotation_status_updatedAt_idx" ON "Quotation"("status", "updatedAt");
CREATE INDEX "Order_status_createdAt_idx" ON "Order"("status", "createdAt");
CREATE INDEX "Order_paymentStatus_createdAt_idx" ON "Order"("paymentStatus", "createdAt");
CREATE INDEX "Order_deliveryStatus_createdAt_idx" ON "Order"("deliveryStatus", "createdAt");
CREATE INDEX "Payment_status_paymentDate_idx" ON "Payment"("status", "paymentDate");
CREATE INDEX "Delivery_status_scheduledDate_idx" ON "Delivery"("status", "scheduledDate");
CREATE INDEX "Delivery_assignedStaffId_scheduledDate_idx" ON "Delivery"("assignedStaffId", "scheduledDate");
