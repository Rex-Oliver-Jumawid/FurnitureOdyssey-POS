import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

function hoursAgo(hours: number) {
  return new Date(Date.now() - hours * HOUR);
}

function daysAgo(days: number) {
  return new Date(Date.now() - days * DAY);
}

function daysFromNow(days: number) {
  return new Date(Date.now() + days * DAY);
}

type CustomerSeed = {
  id: string;
  customerType: "INDIVIDUAL" | "COMPANY";
  displayName: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  contactPersonName?: string;
  source:
    | "FACEBOOK_MARKETPLACE"
    | "FACEBOOK_PAGE"
    | "MESSENGER"
    | "VIBER"
    | "WALK_IN"
    | "PHONE"
    | "REFERRAL"
    | "OTHER";
  notes: string;
  contact: {
    id: string;
    type: "PHONE" | "VIBER" | "FACEBOOK_PROFILE" | "FACEBOOK_PAGE" | "EMAIL" | "OTHER";
    label: string;
    value: string;
  };
  address: {
    id: string;
    label: string;
    recipientName: string;
    phone: string;
    addressLine: string;
    city: string;
    province: string;
    postalCode: string;
  };
};

async function seedCustomer(seed: CustomerSeed, adminId: string) {
  const customer = await prisma.customer.upsert({
    where: { id: seed.id },
    update: {
      customerType: seed.customerType,
      displayName: seed.displayName,
      firstName: seed.firstName ?? null,
      lastName: seed.lastName ?? null,
      companyName: seed.companyName ?? null,
      contactPersonName: seed.contactPersonName ?? null,
      source: seed.source,
      notes: seed.notes,
      assignedStaffId: adminId,
      archivedAt: null,
      createdAt: daysAgo(14),
    },
    create: {
      id: seed.id,
      customerType: seed.customerType,
      displayName: seed.displayName,
      firstName: seed.firstName,
      lastName: seed.lastName,
      companyName: seed.companyName,
      contactPersonName: seed.contactPersonName,
      source: seed.source,
      notes: seed.notes,
      createdById: adminId,
      assignedStaffId: adminId,
      createdAt: daysAgo(14),
    },
  });

  await prisma.customerContact.upsert({
    where: { id: seed.contact.id },
    update: {
      customerId: customer.id,
      type: seed.contact.type,
      label: seed.contact.label,
      value: seed.contact.value,
      isPrimary: true,
    },
    create: {
      id: seed.contact.id,
      customerId: customer.id,
      type: seed.contact.type,
      label: seed.contact.label,
      value: seed.contact.value,
      isPrimary: true,
    },
  });

  await prisma.customerAddress.upsert({
    where: { id: seed.address.id },
    update: {
      customerId: customer.id,
      label: seed.address.label,
      recipientName: seed.address.recipientName,
      phone: seed.address.phone,
      addressLine: seed.address.addressLine,
      city: seed.address.city,
      province: seed.address.province,
      postalCode: seed.address.postalCode,
      isDefault: true,
    },
    create: {
      id: seed.address.id,
      customerId: customer.id,
      label: seed.address.label,
      recipientName: seed.address.recipientName,
      phone: seed.address.phone,
      addressLine: seed.address.addressLine,
      city: seed.address.city,
      province: seed.address.province,
      postalCode: seed.address.postalCode,
      isDefault: true,
    },
  });

  return customer;
}

async function seedQuotationItem(input: {
  id: string;
  quotationId: string;
  productId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  unitCost: number;
  sortOrder: number;
}) {
  const lineSubtotal = input.quantity * input.unitPrice;
  const lineCostTotal = input.quantity * input.unitCost;

  return prisma.quotationItem.upsert({
    where: { id: input.id },
    update: {
      quotationId: input.quotationId,
      productId: input.productId,
      itemType: "CATALOG_PRODUCT",
      sortOrder: input.sortOrder,
      itemName: input.itemName,
      quantity: input.quantity,
      unitPrice: input.unitPrice,
      lineSubtotal,
      lineTotal: lineSubtotal,
      unitCostSnapshot: input.unitCost,
      lineCostTotal,
      lineProfit: lineSubtotal - lineCostTotal,
    },
    create: {
      id: input.id,
      quotationId: input.quotationId,
      productId: input.productId,
      itemType: "CATALOG_PRODUCT",
      sortOrder: input.sortOrder,
      itemName: input.itemName,
      quantity: input.quantity,
      unitPrice: input.unitPrice,
      lineSubtotal,
      lineTotal: lineSubtotal,
      unitCostSnapshot: input.unitCost,
      lineCostTotal,
      lineProfit: lineSubtotal - lineCostTotal,
    },
  });
}

async function seedOrderItem(input: {
  id: string;
  orderId: string;
  productId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  unitCost: number;
  sortOrder: number;
}) {
  const lineSubtotal = input.quantity * input.unitPrice;
  const lineCostTotal = input.quantity * input.unitCost;

  return prisma.orderItem.upsert({
    where: { id: input.id },
    update: {
      orderId: input.orderId,
      productId: input.productId,
      itemType: "CATALOG_PRODUCT",
      sortOrder: input.sortOrder,
      itemName: input.itemName,
      quantity: input.quantity,
      unitPrice: input.unitPrice,
      lineSubtotal,
      lineTotal: lineSubtotal,
      unitCostSnapshot: input.unitCost,
      lineCostTotal,
      lineProfit: lineSubtotal - lineCostTotal,
    },
    create: {
      id: input.id,
      orderId: input.orderId,
      productId: input.productId,
      itemType: "CATALOG_PRODUCT",
      sortOrder: input.sortOrder,
      itemName: input.itemName,
      quantity: input.quantity,
      unitPrice: input.unitPrice,
      lineSubtotal,
      lineTotal: lineSubtotal,
      unitCostSnapshot: input.unitCost,
      lineCostTotal,
      lineProfit: lineSubtotal - lineCostTotal,
    },
  });
}

async function main() {
  const admin = await prisma.userProfile.findFirst({
    where: {
      role: "ADMIN",
      status: "ACTIVE",
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  if (!admin) {
    throw new Error("No active Admin profile found. Run npm run seed first.");
  }

  const chair = await prisma.product.findUnique({ where: { code: "TOLIX-CHAIR" } });
  const stool = await prisma.product.findUnique({ where: { code: "TOLIX-LSTOOL" } });

  if (!chair || !stool) {
    throw new Error("Demo products are missing. Run npm run seed first.");
  }

  const brightSpace = await seedCustomer(
    {
      id: "11111111-1111-4111-8111-111111111101",
      customerType: "COMPANY",
      displayName: "BrightSpace Interiors",
      companyName: "BrightSpace Interiors",
      contactPersonName: "Avery Cruz",
      source: "FACEBOOK_PAGE",
      notes: "Demo account for a commercial interior fit-out customer.",
      contact: {
        id: "21111111-1111-4111-8111-111111111101",
        type: "EMAIL",
        label: "Work email",
        value: "orders@brightspace.example",
      },
      address: {
        id: "31111111-1111-4111-8111-111111111101",
        label: "Showroom",
        recipientName: "Avery Cruz",
        phone: "0917 000 1001",
        addressLine: "120 Demo Avenue",
        city: "Taguig",
        province: "Metro Manila",
        postalCode: "1630",
      },
    },
    admin.id
  );

  const mika = await seedCustomer(
    {
      id: "11111111-1111-4111-8111-111111111102",
      customerType: "INDIVIDUAL",
      displayName: "Mika Santos",
      firstName: "Mika",
      lastName: "Santos",
      source: "FACEBOOK_MARKETPLACE",
      notes: "Demo residential customer furnishing a dining area.",
      contact: {
        id: "21111111-1111-4111-8111-111111111102",
        type: "PHONE",
        label: "Mobile",
        value: "0917 000 1002",
      },
      address: {
        id: "31111111-1111-4111-8111-111111111102",
        label: "Home",
        recipientName: "Mika Santos",
        phone: "0917 000 1002",
        addressLine: "42 Sample Street",
        city: "Mandaluyong",
        province: "Metro Manila",
        postalCode: "1550",
      },
    },
    admin.id
  );

  const northstar = await seedCustomer(
    {
      id: "11111111-1111-4111-8111-111111111103",
      customerType: "COMPANY",
      displayName: "Northstar Café",
      companyName: "Northstar Café",
      contactPersonName: "Jordan Lim",
      source: "REFERRAL",
      notes: "Demo hospitality customer preparing a new café branch.",
      contact: {
        id: "21111111-1111-4111-8111-111111111103",
        type: "VIBER",
        label: "Operations",
        value: "0917 000 1003",
      },
      address: {
        id: "31111111-1111-4111-8111-111111111103",
        label: "Branch",
        recipientName: "Jordan Lim",
        phone: "0917 000 1003",
        addressLine: "18 Example Road",
        city: "Makati",
        province: "Metro Manila",
        postalCode: "1200",
      },
    },
    admin.id
  );

  const luna = await seedCustomer(
    {
      id: "11111111-1111-4111-8111-111111111104",
      customerType: "COMPANY",
      displayName: "Luna Events",
      companyName: "Luna Events",
      contactPersonName: "Sam Reyes",
      source: "MESSENGER",
      notes: "Demo events customer ordering stools for mobile setups.",
      contact: {
        id: "21111111-1111-4111-8111-111111111104",
        type: "FACEBOOK_PAGE",
        label: "Facebook",
        value: "Luna Events Demo",
      },
      address: {
        id: "31111111-1111-4111-8111-111111111104",
        label: "Warehouse",
        recipientName: "Sam Reyes",
        phone: "0917 000 1004",
        addressLine: "77 Portfolio Lane",
        city: "Pasig",
        province: "Metro Manila",
        postalCode: "1600",
      },
    },
    admin.id
  );

  const homeHaven = await seedCustomer(
    {
      id: "11111111-1111-4111-8111-111111111105",
      customerType: "COMPANY",
      displayName: "Home Haven PH",
      companyName: "Home Haven PH",
      contactPersonName: "Casey Tan",
      source: "PHONE",
      notes: "Demo reseller account with repeat furniture orders.",
      contact: {
        id: "21111111-1111-4111-8111-111111111105",
        type: "PHONE",
        label: "Purchasing",
        value: "0917 000 1005",
      },
      address: {
        id: "31111111-1111-4111-8111-111111111105",
        label: "Office",
        recipientName: "Casey Tan",
        phone: "0917 000 1005",
        addressLine: "5 Showcase Drive",
        city: "Manila",
        province: "Metro Manila",
        postalCode: "1000",
      },
    },
    admin.id
  );

  const studioOak = await seedCustomer(
    {
      id: "11111111-1111-4111-8111-111111111106",
      customerType: "COMPANY",
      displayName: "Studio Oak",
      companyName: "Studio Oak",
      contactPersonName: "Taylor Ong",
      source: "WALK_IN",
      notes: "Demo design studio evaluating furniture for client projects.",
      contact: {
        id: "21111111-1111-4111-8111-111111111106",
        type: "EMAIL",
        label: "Studio",
        value: "hello@studiooak.example",
      },
      address: {
        id: "31111111-1111-4111-8111-111111111106",
        label: "Studio",
        recipientName: "Taylor Ong",
        phone: "0917 000 1006",
        addressLine: "31 Concept Street",
        city: "Quezon City",
        province: "Metro Manila",
        postalCode: "1100",
      },
    },
    admin.id
  );

  const inquirySeeds = [
    {
      id: "41111111-1111-4111-8111-111111111101",
      customerId: brightSpace.id,
      source: "FACEBOOK_PAGE" as const,
      status: "QUOTED" as const,
      priority: "HIGH" as const,
      subject: "36 chairs for office pantry renovation",
      requestedItems: "36 Tolix Chairs",
      budgetRange: "₱50,000 - ₱60,000",
      deliveryLocation: "Taguig",
      createdAt: hoursAgo(30),
    },
    {
      id: "41111111-1111-4111-8111-111111111102",
      customerId: northstar.id,
      source: "REFERRAL" as const,
      status: "QUOTED" as const,
      priority: "HIGH" as const,
      subject: "Café seating package",
      requestedItems: "20 Tolix Chairs, 7 Tolix Long Stools",
      budgetRange: "₱35,000 - ₱45,000",
      deliveryLocation: "Makati",
      createdAt: hoursAgo(22),
    },
    {
      id: "41111111-1111-4111-8111-111111111103",
      customerId: luna.id,
      source: "MESSENGER" as const,
      status: "IN_PROGRESS" as const,
      priority: "NORMAL" as const,
      subject: "20 stools for event inventory",
      requestedItems: "20 Tolix Long Stools",
      budgetRange: "₱20,000 - ₱30,000",
      deliveryLocation: "Pasig",
      createdAt: hoursAgo(10),
    },
    {
      id: "41111111-1111-4111-8111-111111111104",
      customerId: homeHaven.id,
      source: "PHONE" as const,
      status: "WAITING_FOR_CUSTOMER" as const,
      priority: "NORMAL" as const,
      subject: "Restock request",
      requestedItems: "12 Tolix Chairs",
      budgetRange: "₱15,000 - ₱20,000",
      deliveryLocation: "Manila",
      createdAt: hoursAgo(8),
    },
    {
      id: "41111111-1111-4111-8111-111111111105",
      customerId: studioOak.id,
      source: "WALK_IN" as const,
      status: "NEW" as const,
      priority: "NORMAL" as const,
      subject: "Sample pieces for client presentation",
      requestedItems: "6 Tolix Chairs, 4 Tolix Long Stools",
      budgetRange: "₱12,000 - ₱18,000",
      deliveryLocation: "Quezon City",
      createdAt: hoursAgo(3),
    },
  ];

  for (const inquiry of inquirySeeds) {
    await prisma.inquiry.upsert({
      where: { id: inquiry.id },
      update: {
        customerId: inquiry.customerId,
        source: inquiry.source,
        status: inquiry.status,
        priority: inquiry.priority,
        subject: inquiry.subject,
        requestedItems: inquiry.requestedItems,
        budgetRange: inquiry.budgetRange,
        deliveryLocation: inquiry.deliveryLocation,
        assignedStaffId: admin.id,
        createdAt: inquiry.createdAt,
        updatedAt: inquiry.createdAt,
      },
      create: {
        ...inquiry,
        assignedStaffId: admin.id,
        createdById: admin.id,
        updatedAt: inquiry.createdAt,
      },
    });
  }

  const qBright = await prisma.quotation.upsert({
    where: { quotationNumber: "QUO-DEMO-1001" },
    update: {
      customerId: brightSpace.id,
      status: "SENT",
      subtotalAmount: 54000,
      totalAmount: 54000,
      paymentTerms: "50% downpayment, balance before delivery",
      deliveryMethod: "In-house delivery",
      createdById: admin.id,
      updatedById: admin.id,
      createdAt: hoursAgo(7),
      updatedAt: hoursAgo(2),
    },
    create: {
      id: "51111111-1111-4111-8111-111111111101",
      quotationNumber: "QUO-DEMO-1001",
      customerId: brightSpace.id,
      status: "SENT",
      subtotalAmount: 54000,
      totalAmount: 54000,
      paymentTerms: "50% downpayment, balance before delivery",
      deliveryMethod: "In-house delivery",
      createdById: admin.id,
      updatedById: admin.id,
      createdAt: hoursAgo(7),
      updatedAt: hoursAgo(2),
    },
  });

  const qNorthstar = await prisma.quotation.upsert({
    where: { quotationNumber: "QUO-DEMO-1002" },
    update: {
      customerId: northstar.id,
      status: "ACCEPTED",
      subtotalAmount: 39100,
      totalAmount: 39100,
      paymentTerms: "₱10,000 downpayment, balance upon delivery",
      deliveryMethod: "Third-party delivery",
      createdById: admin.id,
      updatedById: admin.id,
      createdAt: hoursAgo(6),
      updatedAt: hoursAgo(1),
    },
    create: {
      id: "51111111-1111-4111-8111-111111111102",
      quotationNumber: "QUO-DEMO-1002",
      customerId: northstar.id,
      status: "ACCEPTED",
      subtotalAmount: 39100,
      totalAmount: 39100,
      paymentTerms: "₱10,000 downpayment, balance upon delivery",
      deliveryMethod: "Third-party delivery",
      createdById: admin.id,
      updatedById: admin.id,
      createdAt: hoursAgo(6),
      updatedAt: hoursAgo(1),
    },
  });

  const qLuna = await prisma.quotation.upsert({
    where: { quotationNumber: "QUO-DEMO-1003" },
    update: {
      customerId: luna.id,
      status: "DRAFT",
      subtotalAmount: 26000,
      totalAmount: 26000,
      deliveryMethod: "Customer pickup",
      createdById: admin.id,
      updatedById: admin.id,
      createdAt: hoursAgo(4),
      updatedAt: hoursAgo(4),
    },
    create: {
      id: "51111111-1111-4111-8111-111111111103",
      quotationNumber: "QUO-DEMO-1003",
      customerId: luna.id,
      status: "DRAFT",
      subtotalAmount: 26000,
      totalAmount: 26000,
      deliveryMethod: "Customer pickup",
      createdById: admin.id,
      updatedById: admin.id,
      createdAt: hoursAgo(4),
      updatedAt: hoursAgo(4),
    },
  });

  const qHome = await prisma.quotation.upsert({
    where: { quotationNumber: "QUO-DEMO-1004" },
    update: {
      customerId: homeHaven.id,
      status: "SENT",
      subtotalAmount: 18000,
      totalAmount: 18000,
      createdById: admin.id,
      updatedById: admin.id,
      createdAt: hoursAgo(3),
      updatedAt: hoursAgo(3),
    },
    create: {
      id: "51111111-1111-4111-8111-111111111104",
      quotationNumber: "QUO-DEMO-1004",
      customerId: homeHaven.id,
      status: "SENT",
      subtotalAmount: 18000,
      totalAmount: 18000,
      createdById: admin.id,
      updatedById: admin.id,
      createdAt: hoursAgo(3),
      updatedAt: hoursAgo(3),
    },
  });

  const qStudio = await prisma.quotation.upsert({
    where: { quotationNumber: "QUO-DEMO-1005" },
    update: {
      customerId: studioOak.id,
      status: "ACCEPTED",
      subtotalAmount: 14200,
      totalAmount: 14200,
      createdById: admin.id,
      updatedById: admin.id,
      createdAt: hoursAgo(2),
      updatedAt: hoursAgo(1),
    },
    create: {
      id: "51111111-1111-4111-8111-111111111105",
      quotationNumber: "QUO-DEMO-1005",
      customerId: studioOak.id,
      status: "ACCEPTED",
      subtotalAmount: 14200,
      totalAmount: 14200,
      createdById: admin.id,
      updatedById: admin.id,
      createdAt: hoursAgo(2),
      updatedAt: hoursAgo(1),
    },
  });

  await seedQuotationItem({
    id: "61111111-1111-4111-8111-111111111101",
    quotationId: qBright.id,
    productId: chair.id,
    itemName: "Tolix Chair",
    quantity: 36,
    unitPrice: 1500,
    unitCost: 900,
    sortOrder: 0,
  });
  await seedQuotationItem({
    id: "61111111-1111-4111-8111-111111111102",
    quotationId: qNorthstar.id,
    productId: chair.id,
    itemName: "Tolix Chair",
    quantity: 20,
    unitPrice: 1500,
    unitCost: 900,
    sortOrder: 0,
  });
  await seedQuotationItem({
    id: "61111111-1111-4111-8111-111111111103",
    quotationId: qNorthstar.id,
    productId: stool.id,
    itemName: "Tolix Long Stool",
    quantity: 7,
    unitPrice: 1300,
    unitCost: 850,
    sortOrder: 1,
  });
  await seedQuotationItem({
    id: "61111111-1111-4111-8111-111111111104",
    quotationId: qLuna.id,
    productId: stool.id,
    itemName: "Tolix Long Stool",
    quantity: 20,
    unitPrice: 1300,
    unitCost: 850,
    sortOrder: 0,
  });
  await seedQuotationItem({
    id: "61111111-1111-4111-8111-111111111105",
    quotationId: qHome.id,
    productId: chair.id,
    itemName: "Tolix Chair",
    quantity: 12,
    unitPrice: 1500,
    unitCost: 900,
    sortOrder: 0,
  });
  await seedQuotationItem({
    id: "61111111-1111-4111-8111-111111111106",
    quotationId: qStudio.id,
    productId: chair.id,
    itemName: "Tolix Chair",
    quantity: 6,
    unitPrice: 1500,
    unitCost: 900,
    sortOrder: 0,
  });
  await seedQuotationItem({
    id: "61111111-1111-4111-8111-111111111107",
    quotationId: qStudio.id,
    productId: stool.id,
    itemName: "Tolix Long Stool",
    quantity: 4,
    unitPrice: 1300,
    unitCost: 850,
    sortOrder: 1,
  });

  const orderBright = await prisma.order.upsert({
    where: { orderNumber: "ORD-DEMO-1001" },
    update: {
      customerId: brightSpace.id,
      status: "PARTIALLY_PAID",
      paymentStatus: "PARTIALLY_PAID",
      paymentDueTiming: "BEFORE_DELIVERY",
      paymentDueDate: hoursAgo(6),
      deliveryStatus: "SCHEDULED",
      customerDisplayNameSnapshot: brightSpace.displayName,
      customerTypeSnapshot: brightSpace.customerType,
      companyNameSnapshot: brightSpace.companyName,
      contactPersonNameSnapshot: brightSpace.contactPersonName,
      primaryContactSnapshot: { type: "EMAIL", value: "orders@brightspace.example" },
      deliveryAddressSnapshot: {
        addressLine: "120 Demo Avenue",
        city: "Taguig",
        province: "Metro Manila",
        postalCode: "1630",
      },
      subtotalAmount: 54000,
      totalAmount: 54000,
      totalCostAmount: 32400,
      grossProfitAmount: 21600,
      paidAmount: 27000,
      balanceAmount: 27000,
      lastPaymentAt: hoursAgo(5),
      sourceType: "MANUAL",
      confirmedAt: hoursAgo(7),
      createdById: admin.id,
      updatedById: admin.id,
      createdAt: hoursAgo(7),
      updatedAt: hoursAgo(1),
    },
    create: {
      id: "71111111-1111-4111-8111-111111111101",
      orderNumber: "ORD-DEMO-1001",
      customerId: brightSpace.id,
      status: "PARTIALLY_PAID",
      paymentStatus: "PARTIALLY_PAID",
      paymentDueTiming: "BEFORE_DELIVERY",
      paymentDueDate: hoursAgo(6),
      deliveryStatus: "SCHEDULED",
      customerDisplayNameSnapshot: brightSpace.displayName,
      customerTypeSnapshot: brightSpace.customerType,
      companyNameSnapshot: brightSpace.companyName,
      contactPersonNameSnapshot: brightSpace.contactPersonName,
      primaryContactSnapshot: { type: "EMAIL", value: "orders@brightspace.example" },
      deliveryAddressSnapshot: {
        addressLine: "120 Demo Avenue",
        city: "Taguig",
        province: "Metro Manila",
        postalCode: "1630",
      },
      subtotalAmount: 54000,
      totalAmount: 54000,
      totalCostAmount: 32400,
      grossProfitAmount: 21600,
      paidAmount: 27000,
      balanceAmount: 27000,
      lastPaymentAt: hoursAgo(5),
      sourceType: "MANUAL",
      confirmedAt: hoursAgo(7),
      createdById: admin.id,
      updatedById: admin.id,
      createdAt: hoursAgo(7),
      updatedAt: hoursAgo(1),
    },
  });

  const orderMika = await prisma.order.upsert({
    where: { orderNumber: "ORD-DEMO-1002" },
    update: {
      customerId: mika.id,
      status: "COMPLETED",
      paymentStatus: "PAID",
      deliveryStatus: "DELIVERED",
      customerDisplayNameSnapshot: mika.displayName,
      customerTypeSnapshot: mika.customerType,
      primaryContactSnapshot: { type: "PHONE", value: "0917 000 1002" },
      deliveryAddressSnapshot: {
        addressLine: "42 Sample Street",
        city: "Mandaluyong",
        province: "Metro Manila",
        postalCode: "1550",
      },
      subtotalAmount: 9000,
      totalAmount: 9000,
      totalCostAmount: 5400,
      grossProfitAmount: 3600,
      paidAmount: 9000,
      balanceAmount: 0,
      lastPaymentAt: daysAgo(1),
      sourceType: "MANUAL",
      confirmedAt: daysAgo(2),
      completedAt: hoursAgo(18),
      createdById: admin.id,
      updatedById: admin.id,
      createdAt: daysAgo(2),
      updatedAt: hoursAgo(18),
    },
    create: {
      id: "71111111-1111-4111-8111-111111111102",
      orderNumber: "ORD-DEMO-1002",
      customerId: mika.id,
      status: "COMPLETED",
      paymentStatus: "PAID",
      deliveryStatus: "DELIVERED",
      customerDisplayNameSnapshot: mika.displayName,
      customerTypeSnapshot: mika.customerType,
      primaryContactSnapshot: { type: "PHONE", value: "0917 000 1002" },
      deliveryAddressSnapshot: {
        addressLine: "42 Sample Street",
        city: "Mandaluyong",
        province: "Metro Manila",
        postalCode: "1550",
      },
      subtotalAmount: 9000,
      totalAmount: 9000,
      totalCostAmount: 5400,
      grossProfitAmount: 3600,
      paidAmount: 9000,
      balanceAmount: 0,
      lastPaymentAt: daysAgo(1),
      sourceType: "MANUAL",
      confirmedAt: daysAgo(2),
      completedAt: hoursAgo(18),
      createdById: admin.id,
      updatedById: admin.id,
      createdAt: daysAgo(2),
      updatedAt: hoursAgo(18),
    },
  });

  const orderNorthstar = await prisma.order.upsert({
    where: { orderNumber: "ORD-DEMO-1003" },
    update: {
      customerId: northstar.id,
      status: "PARTIALLY_PAID",
      paymentStatus: "DOWNPAYMENT_PAID",
      paymentDueTiming: "UPON_DELIVERY",
      paymentDueDate: daysFromNow(2),
      deliveryStatus: "NOT_SCHEDULED",
      customerDisplayNameSnapshot: northstar.displayName,
      customerTypeSnapshot: northstar.customerType,
      companyNameSnapshot: northstar.companyName,
      contactPersonNameSnapshot: northstar.contactPersonName,
      primaryContactSnapshot: { type: "VIBER", value: "0917 000 1003" },
      deliveryAddressSnapshot: {
        addressLine: "18 Example Road",
        city: "Makati",
        province: "Metro Manila",
        postalCode: "1200",
      },
      subtotalAmount: 39100,
      totalAmount: 39100,
      totalCostAmount: 23950,
      grossProfitAmount: 15150,
      paidAmount: 10000,
      balanceAmount: 29100,
      lastPaymentAt: hoursAgo(2),
      sourceType: "MANUAL",
      confirmedAt: hoursAgo(5),
      createdById: admin.id,
      updatedById: admin.id,
      createdAt: hoursAgo(5),
      updatedAt: hoursAgo(1),
    },
    create: {
      id: "71111111-1111-4111-8111-111111111103",
      orderNumber: "ORD-DEMO-1003",
      customerId: northstar.id,
      status: "PARTIALLY_PAID",
      paymentStatus: "DOWNPAYMENT_PAID",
      paymentDueTiming: "UPON_DELIVERY",
      paymentDueDate: daysFromNow(2),
      deliveryStatus: "NOT_SCHEDULED",
      customerDisplayNameSnapshot: northstar.displayName,
      customerTypeSnapshot: northstar.customerType,
      companyNameSnapshot: northstar.companyName,
      contactPersonNameSnapshot: northstar.contactPersonName,
      primaryContactSnapshot: { type: "VIBER", value: "0917 000 1003" },
      deliveryAddressSnapshot: {
        addressLine: "18 Example Road",
        city: "Makati",
        province: "Metro Manila",
        postalCode: "1200",
      },
      subtotalAmount: 39100,
      totalAmount: 39100,
      totalCostAmount: 23950,
      grossProfitAmount: 15150,
      paidAmount: 10000,
      balanceAmount: 29100,
      lastPaymentAt: hoursAgo(2),
      sourceType: "MANUAL",
      confirmedAt: hoursAgo(5),
      createdById: admin.id,
      updatedById: admin.id,
      createdAt: hoursAgo(5),
      updatedAt: hoursAgo(1),
    },
  });

  const orderLuna = await prisma.order.upsert({
    where: { orderNumber: "ORD-DEMO-1004" },
    update: {
      customerId: luna.id,
      status: "CONFIRMED",
      paymentStatus: "UNPAID",
      paymentDueTiming: "BEFORE_DELIVERY",
      paymentDueDate: daysFromNow(1),
      deliveryStatus: "SCHEDULED",
      customerDisplayNameSnapshot: luna.displayName,
      customerTypeSnapshot: luna.customerType,
      companyNameSnapshot: luna.companyName,
      contactPersonNameSnapshot: luna.contactPersonName,
      primaryContactSnapshot: { type: "FACEBOOK_PAGE", value: "Luna Events Demo" },
      deliveryAddressSnapshot: {
        addressLine: "77 Portfolio Lane",
        city: "Pasig",
        province: "Metro Manila",
        postalCode: "1600",
      },
      subtotalAmount: 26000,
      totalAmount: 26000,
      totalCostAmount: 17000,
      grossProfitAmount: 9000,
      paidAmount: 0,
      balanceAmount: 26000,
      sourceType: "MANUAL",
      confirmedAt: hoursAgo(2),
      createdById: admin.id,
      updatedById: admin.id,
      createdAt: hoursAgo(2),
      updatedAt: hoursAgo(1),
    },
    create: {
      id: "71111111-1111-4111-8111-111111111104",
      orderNumber: "ORD-DEMO-1004",
      customerId: luna.id,
      status: "CONFIRMED",
      paymentStatus: "UNPAID",
      paymentDueTiming: "BEFORE_DELIVERY",
      paymentDueDate: daysFromNow(1),
      deliveryStatus: "SCHEDULED",
      customerDisplayNameSnapshot: luna.displayName,
      customerTypeSnapshot: luna.customerType,
      companyNameSnapshot: luna.companyName,
      contactPersonNameSnapshot: luna.contactPersonName,
      primaryContactSnapshot: { type: "FACEBOOK_PAGE", value: "Luna Events Demo" },
      deliveryAddressSnapshot: {
        addressLine: "77 Portfolio Lane",
        city: "Pasig",
        province: "Metro Manila",
        postalCode: "1600",
      },
      subtotalAmount: 26000,
      totalAmount: 26000,
      totalCostAmount: 17000,
      grossProfitAmount: 9000,
      paidAmount: 0,
      balanceAmount: 26000,
      sourceType: "MANUAL",
      confirmedAt: hoursAgo(2),
      createdById: admin.id,
      updatedById: admin.id,
      createdAt: hoursAgo(2),
      updatedAt: hoursAgo(1),
    },
  });

  const orderHome = await prisma.order.upsert({
    where: { orderNumber: "ORD-DEMO-1005" },
    update: {
      customerId: homeHaven.id,
      status: "DELIVERED",
      paymentStatus: "PAID",
      deliveryStatus: "DELIVERED",
      customerDisplayNameSnapshot: homeHaven.displayName,
      customerTypeSnapshot: homeHaven.customerType,
      companyNameSnapshot: homeHaven.companyName,
      contactPersonNameSnapshot: homeHaven.contactPersonName,
      subtotalAmount: 18000,
      totalAmount: 18000,
      totalCostAmount: 10800,
      grossProfitAmount: 7200,
      paidAmount: 18000,
      balanceAmount: 0,
      lastPaymentAt: daysAgo(2),
      sourceType: "MANUAL",
      confirmedAt: daysAgo(3),
      createdById: admin.id,
      updatedById: admin.id,
      createdAt: daysAgo(3),
      updatedAt: daysAgo(1),
    },
    create: {
      id: "71111111-1111-4111-8111-111111111105",
      orderNumber: "ORD-DEMO-1005",
      customerId: homeHaven.id,
      status: "DELIVERED",
      paymentStatus: "PAID",
      deliveryStatus: "DELIVERED",
      customerDisplayNameSnapshot: homeHaven.displayName,
      customerTypeSnapshot: homeHaven.customerType,
      companyNameSnapshot: homeHaven.companyName,
      contactPersonNameSnapshot: homeHaven.contactPersonName,
      subtotalAmount: 18000,
      totalAmount: 18000,
      totalCostAmount: 10800,
      grossProfitAmount: 7200,
      paidAmount: 18000,
      balanceAmount: 0,
      lastPaymentAt: daysAgo(2),
      sourceType: "MANUAL",
      confirmedAt: daysAgo(3),
      createdById: admin.id,
      updatedById: admin.id,
      createdAt: daysAgo(3),
      updatedAt: daysAgo(1),
    },
  });

  const brightItem = await seedOrderItem({
    id: "81111111-1111-4111-8111-111111111101",
    orderId: orderBright.id,
    productId: chair.id,
    itemName: "Tolix Chair",
    quantity: 36,
    unitPrice: 1500,
    unitCost: 900,
    sortOrder: 0,
  });
  const mikaItem = await seedOrderItem({
    id: "81111111-1111-4111-8111-111111111102",
    orderId: orderMika.id,
    productId: chair.id,
    itemName: "Tolix Chair",
    quantity: 6,
    unitPrice: 1500,
    unitCost: 900,
    sortOrder: 0,
  });
  const northChairItem = await seedOrderItem({
    id: "81111111-1111-4111-8111-111111111103",
    orderId: orderNorthstar.id,
    productId: chair.id,
    itemName: "Tolix Chair",
    quantity: 20,
    unitPrice: 1500,
    unitCost: 900,
    sortOrder: 0,
  });
  const northStoolItem = await seedOrderItem({
    id: "81111111-1111-4111-8111-111111111104",
    orderId: orderNorthstar.id,
    productId: stool.id,
    itemName: "Tolix Long Stool",
    quantity: 7,
    unitPrice: 1300,
    unitCost: 850,
    sortOrder: 1,
  });
  const lunaItem = await seedOrderItem({
    id: "81111111-1111-4111-8111-111111111105",
    orderId: orderLuna.id,
    productId: stool.id,
    itemName: "Tolix Long Stool",
    quantity: 20,
    unitPrice: 1300,
    unitCost: 850,
    sortOrder: 0,
  });
  const homeItem = await seedOrderItem({
    id: "81111111-1111-4111-8111-111111111106",
    orderId: orderHome.id,
    productId: chair.id,
    itemName: "Tolix Chair",
    quantity: 12,
    unitPrice: 1500,
    unitCost: 900,
    sortOrder: 0,
  });

  const payments = [
    {
      id: "91111111-1111-4111-8111-111111111101",
      paymentNumber: "PAY-DEMO-1001",
      orderId: orderBright.id,
      customerId: brightSpace.id,
      paymentType: "DOWNPAYMENT" as const,
      paymentDate: hoursAgo(5),
      amount: 27000,
      method: "BANK_TRANSFER" as const,
      referenceNumber: "DEMO-BANK-1001",
    },
    {
      id: "91111111-1111-4111-8111-111111111102",
      paymentNumber: "PAY-DEMO-1002",
      orderId: orderNorthstar.id,
      customerId: northstar.id,
      paymentType: "DOWNPAYMENT" as const,
      paymentDate: hoursAgo(2),
      amount: 10000,
      method: "GCASH" as const,
      referenceNumber: "DEMO-GCASH-1002",
    },
    {
      id: "91111111-1111-4111-8111-111111111103",
      paymentNumber: "PAY-DEMO-1003",
      orderId: orderMika.id,
      customerId: mika.id,
      paymentType: "FINAL_PAYMENT" as const,
      paymentDate: daysAgo(1),
      amount: 9000,
      method: "CASH" as const,
      referenceNumber: "DEMO-CASH-1003",
    },
    {
      id: "91111111-1111-4111-8111-111111111104",
      paymentNumber: "PAY-DEMO-1004",
      orderId: orderHome.id,
      customerId: homeHaven.id,
      paymentType: "FINAL_PAYMENT" as const,
      paymentDate: daysAgo(2),
      amount: 18000,
      method: "BANK_TRANSFER" as const,
      referenceNumber: "DEMO-BANK-1004",
    },
  ];

  for (const payment of payments) {
    await prisma.payment.upsert({
      where: { paymentNumber: payment.paymentNumber },
      update: {
        orderId: payment.orderId,
        customerId: payment.customerId,
        paymentType: payment.paymentType,
        status: "RECORDED",
        paymentDate: payment.paymentDate,
        amount: payment.amount,
        method: payment.method,
        referenceNumber: payment.referenceNumber,
        payerName: "Demo customer",
        receivedById: admin.id,
        createdById: admin.id,
        updatedById: admin.id,
        createdAt: payment.paymentDate,
        updatedAt: payment.paymentDate,
      },
      create: {
        ...payment,
        status: "RECORDED",
        payerName: "Demo customer",
        receivedById: admin.id,
        createdById: admin.id,
        updatedById: admin.id,
        createdAt: payment.paymentDate,
        updatedAt: payment.paymentDate,
      },
    });
  }

  const deliveryBright = await prisma.delivery.upsert({
    where: { deliveryNumber: "DEL-DEMO-1001" },
    update: {
      orderId: orderBright.id,
      status: "SCHEDULED",
      scheduledDate: hoursAgo(1),
      scheduledTimeWindow: "3:00 PM - 5:00 PM",
      deliveryProviderType: "IN_HOUSE",
      deliveryAddressSnapshot: orderBright.deliveryAddressSnapshot ?? undefined,
      recipientName: "Avery Cruz",
      recipientPhone: "0917 000 1001",
      assignedStaffId: admin.id,
      createdById: admin.id,
      updatedById: admin.id,
      createdAt: hoursAgo(6),
      updatedAt: hoursAgo(1),
    },
    create: {
      id: "a1111111-1111-4111-8111-111111111101",
      deliveryNumber: "DEL-DEMO-1001",
      orderId: orderBright.id,
      status: "SCHEDULED",
      scheduledDate: hoursAgo(1),
      scheduledTimeWindow: "3:00 PM - 5:00 PM",
      deliveryProviderType: "IN_HOUSE",
      deliveryAddressSnapshot: orderBright.deliveryAddressSnapshot ?? undefined,
      recipientName: "Avery Cruz",
      recipientPhone: "0917 000 1001",
      assignedStaffId: admin.id,
      createdById: admin.id,
      updatedById: admin.id,
      createdAt: hoursAgo(6),
      updatedAt: hoursAgo(1),
    },
  });

  const deliveryLuna = await prisma.delivery.upsert({
    where: { deliveryNumber: "DEL-DEMO-1002" },
    update: {
      orderId: orderLuna.id,
      status: "SCHEDULED",
      scheduledDate: daysFromNow(1),
      scheduledTimeWindow: "10:00 AM - 12:00 PM",
      deliveryProviderType: "THIRD_PARTY",
      deliveryProviderName: "Demo Logistics",
      deliveryAddressSnapshot: orderLuna.deliveryAddressSnapshot ?? undefined,
      recipientName: "Sam Reyes",
      recipientPhone: "0917 000 1004",
      assignedStaffId: admin.id,
      createdById: admin.id,
      updatedById: admin.id,
      createdAt: hoursAgo(2),
      updatedAt: hoursAgo(1),
    },
    create: {
      id: "a1111111-1111-4111-8111-111111111102",
      deliveryNumber: "DEL-DEMO-1002",
      orderId: orderLuna.id,
      status: "SCHEDULED",
      scheduledDate: daysFromNow(1),
      scheduledTimeWindow: "10:00 AM - 12:00 PM",
      deliveryProviderType: "THIRD_PARTY",
      deliveryProviderName: "Demo Logistics",
      deliveryAddressSnapshot: orderLuna.deliveryAddressSnapshot ?? undefined,
      recipientName: "Sam Reyes",
      recipientPhone: "0917 000 1004",
      assignedStaffId: admin.id,
      createdById: admin.id,
      updatedById: admin.id,
      createdAt: hoursAgo(2),
      updatedAt: hoursAgo(1),
    },
  });

  const deliveryMika = await prisma.delivery.upsert({
    where: { deliveryNumber: "DEL-DEMO-1003" },
    update: {
      orderId: orderMika.id,
      status: "DELIVERED",
      scheduledDate: daysAgo(1),
      deliveredAt: hoursAgo(18),
      deliveryProviderType: "IN_HOUSE",
      deliveryAddressSnapshot: orderMika.deliveryAddressSnapshot ?? undefined,
      recipientName: "Mika Santos",
      recipientPhone: "0917 000 1002",
      assignedStaffId: admin.id,
      createdById: admin.id,
      updatedById: admin.id,
      createdAt: daysAgo(2),
      updatedAt: hoursAgo(18),
    },
    create: {
      id: "a1111111-1111-4111-8111-111111111103",
      deliveryNumber: "DEL-DEMO-1003",
      orderId: orderMika.id,
      status: "DELIVERED",
      scheduledDate: daysAgo(1),
      deliveredAt: hoursAgo(18),
      deliveryProviderType: "IN_HOUSE",
      deliveryAddressSnapshot: orderMika.deliveryAddressSnapshot ?? undefined,
      recipientName: "Mika Santos",
      recipientPhone: "0917 000 1002",
      assignedStaffId: admin.id,
      createdById: admin.id,
      updatedById: admin.id,
      createdAt: daysAgo(2),
      updatedAt: hoursAgo(18),
    },
  });

  await prisma.deliveryItem.upsert({
    where: { id: "b1111111-1111-4111-8111-111111111101" },
    update: {
      deliveryId: deliveryBright.id,
      orderItemId: brightItem.id,
      quantityPlanned: 36,
      quantityDelivered: 0,
    },
    create: {
      id: "b1111111-1111-4111-8111-111111111101",
      deliveryId: deliveryBright.id,
      orderItemId: brightItem.id,
      quantityPlanned: 36,
      quantityDelivered: 0,
    },
  });

  await prisma.deliveryItem.upsert({
    where: { id: "b1111111-1111-4111-8111-111111111102" },
    update: {
      deliveryId: deliveryLuna.id,
      orderItemId: lunaItem.id,
      quantityPlanned: 20,
      quantityDelivered: 0,
    },
    create: {
      id: "b1111111-1111-4111-8111-111111111102",
      deliveryId: deliveryLuna.id,
      orderItemId: lunaItem.id,
      quantityPlanned: 20,
      quantityDelivered: 0,
    },
  });

  await prisma.deliveryItem.upsert({
    where: { id: "b1111111-1111-4111-8111-111111111103" },
    update: {
      deliveryId: deliveryMika.id,
      orderItemId: mikaItem.id,
      quantityPlanned: 6,
      quantityDelivered: 6,
    },
    create: {
      id: "b1111111-1111-4111-8111-111111111103",
      deliveryId: deliveryMika.id,
      orderItemId: mikaItem.id,
      quantityPlanned: 6,
      quantityDelivered: 6,
    },
  });

  const documentSeeds = [
    {
      id: "c1111111-1111-4111-8111-111111111101",
      documentNumber: "DOC-DEMO-1001",
      orderId: orderBright.id,
      documentType: "INVOICE" as const,
      title: "Invoice - BrightSpace Interiors",
      generatedAt: hoursAgo(4),
    },
    {
      id: "c1111111-1111-4111-8111-111111111102",
      documentNumber: "DOC-DEMO-1002",
      orderId: orderNorthstar.id,
      documentType: "ORDER_CONFIRMATION" as const,
      title: "Order Confirmation - Northstar Café",
      generatedAt: hoursAgo(3),
    },
    {
      id: "c1111111-1111-4111-8111-111111111103",
      documentNumber: "DOC-DEMO-1003",
      orderId: orderMika.id,
      documentType: "DELIVERY_RECEIPT" as const,
      title: "Delivery Receipt - Mika Santos",
      generatedAt: hoursAgo(18),
    },
    {
      id: "c1111111-1111-4111-8111-111111111104",
      documentNumber: "DOC-DEMO-1004",
      orderId: orderHome.id,
      documentType: "FINAL_ORDER_SUMMARY" as const,
      title: "Final Order Summary - Home Haven PH",
      generatedAt: daysAgo(1),
    },
  ];

  for (const document of documentSeeds) {
    await prisma.orderDocument.upsert({
      where: { documentNumber: document.documentNumber },
      update: {
        orderId: document.orderId,
        documentType: document.documentType,
        title: document.title,
        status: "GENERATED",
        generatedAt: document.generatedAt,
        generatedById: admin.id,
        createdAt: document.generatedAt,
        updatedAt: document.generatedAt,
      },
      create: {
        ...document,
        status: "GENERATED",
        generatedById: admin.id,
        createdAt: document.generatedAt,
        updatedAt: document.generatedAt,
      },
    });
  }

  const activitySeeds = [
    ["d1111111-1111-4111-8111-111111111101", "CUSTOMER_CREATED", "Added BrightSpace Interiors", hoursAgo(8)],
    ["d1111111-1111-4111-8111-111111111102", "QUOTATION_CREATED", "Created QUO-DEMO-1001", hoursAgo(7)],
    ["d1111111-1111-4111-8111-111111111103", "ORDER_CREATED", "Created ORD-DEMO-1001", hoursAgo(6)],
    ["d1111111-1111-4111-8111-111111111104", "PAYMENT_RECORDED", "Recorded ₱27,000 downpayment", hoursAgo(5)],
    ["d1111111-1111-4111-8111-111111111105", "DELIVERY_SCHEDULED", "Scheduled DEL-DEMO-1001", hoursAgo(4)],
    ["d1111111-1111-4111-8111-111111111106", "QUOTATION_CREATED", "Created QUO-DEMO-1002", hoursAgo(3)],
    ["d1111111-1111-4111-8111-111111111107", "ORDER_CREATED", "Created ORD-DEMO-1003", hoursAgo(2)],
    ["d1111111-1111-4111-8111-111111111108", "PAYMENT_RECORDED", "Recorded ₱10,000 downpayment", hoursAgo(2)],
    ["d1111111-1111-4111-8111-111111111109", "ORDER_CREATED", "Created ORD-DEMO-1004", hoursAgo(1)],
    ["d1111111-1111-4111-8111-111111111110", "DELIVERY_UPDATED", "Updated delivery schedule for Luna Events", hoursAgo(1)],
  ] as const;

  for (const [id, action, summary, createdAt] of activitySeeds) {
    await prisma.activityLog.upsert({
      where: { id },
      update: {
        action,
        actorId: admin.id,
        summary,
        createdAt,
      },
      create: {
        id,
        action,
        actorId: admin.id,
        summary,
        createdAt,
      },
    });
  }

  console.log("✅ Demo data seeded.");
  console.log("   6 customers");
  console.log("   5 inquiries");
  console.log("   5 quotations");
  console.log("   5 orders");
  console.log("   4 payments");
  console.log("   3 deliveries");
  console.log("   4 documents");
  console.log("   10 activity entries");
  console.log("Run this command again anytime to refresh the demo dates.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
