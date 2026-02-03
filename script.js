const form = document.getElementById("receipt-form");
const billedToInput = document.getElementById("billedTo");
const dateFromInput = document.getElementById("dateFrom");
const dateToInput = document.getElementById("dateTo");
const daysSkippedInput = document.getElementById("daysSkipped");
const taxRateInput = document.getElementById("taxRate");
const errorEl = document.getElementById("error");
const downloadButton = document.getElementById("downloadPdf");

const cowEnabled = document.getElementById("cowEnabled");
const cowQuantity = document.getElementById("cowQuantity");
const cowPrice = document.getElementById("cowPrice");
const buffaloEnabled = document.getElementById("buffaloEnabled");
const buffaloQuantity = document.getElementById("buffaloQuantity");
const buffaloPrice = document.getElementById("buffaloPrice");

const receiptDateRange = document.getElementById("receipt-date-range");
const receiptSkipped = document.getElementById("receipt-skipped");
const receiptBilledTo = document.getElementById("receipt-billed-to");
const receiptPayByDate = document.getElementById("receipt-pay-by-date");
const receiptItems = document.getElementById("receipt-items");
const receiptSubtotal = document.getElementById("receipt-subtotal");
const receiptTax = document.getElementById("receipt-tax");
const receiptTotal = document.getElementById("receipt-total");

const priceMap = {
  cow: 65,
  buffalo: 70,
};

const currency = (value) => `Rs. ${value.toFixed(2)}`;

const formatDate = (value) => {
  if (!value) return "-";
  const [year, month, day] = value.split("-");
  return `${day} ${new Date(value).toLocaleString("en-US", {
    month: "short",
  })} ${year}`;
};

const daysBetweenInclusive = (from, to) => {
  const start = new Date(from);
  const end = new Date(to);
  if (Number.isNaN(start) || Number.isNaN(end)) return 0;
  const diffMs = end - start;
  if (diffMs < 0) return 0;
  return Math.floor(diffMs / 86400000) + 1;
};

const getMilkRows = () => {
  const rows = [];
  if (cowEnabled.checked) {
    const qty = Math.max(0, Number(cowQuantity.value || 0));
    const pricePerL = Math.max(0, Number(cowPrice.value || 0));
    rows.push({
      label: "Milk (cow)",
      qty,
      unit: pricePerL,
      total: qty * pricePerL,
      enabled: true,
      qty,
      pricePerL,
    });
  }
  if (buffaloEnabled.checked) {
    const qty = Math.max(0, Number(buffaloQuantity.value || 0));
    const pricePerL = Math.max(0, Number(buffaloPrice.value || 0));
    rows.push({
      label: "Milk (buffalo)",
      qty,
      unit: pricePerL,
      total: qty * pricePerL,
      enabled: true,
      qty,
      pricePerL,
    });
  }
  return rows;
};

const renderReceiptItems = (items) => {
  receiptItems.innerHTML = "";
  if (!items.length) {
    const emptyRow = document.createElement("tr");
    emptyRow.innerHTML =
      "<td>-</td><td>-</td><td>-</td><td>-</td>";
    receiptItems.appendChild(emptyRow);
    return;
  }

  items.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.label}</td>
      <td>${item.qty.toFixed(2)} L</td>
      <td>${currency(item.unit)}</td>
      <td>${currency(item.total)}</td>
    `;
    receiptItems.appendChild(row);
  });
};

const calculate = () => {
  const billedTo = billedToInput.value.trim() || "-";
  const dateFrom = dateFromInput.value;
  const dateTo = dateToInput.value;
  const skippedDays = Math.max(0, Number(daysSkippedInput.value || 0));
  const taxRate = Math.max(0, Number(taxRateInput.value || 0));

  const totalDays = daysBetweenInclusive(dateFrom, dateTo);
  const billableDays = Math.max(0, totalDays - skippedDays);
  const items = getMilkRows();
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + taxAmount;

  receiptBilledTo.textContent = billedTo;
  receiptDateRange.textContent =
    dateFrom && dateTo
      ? `${formatDate(dateFrom)} - ${formatDate(dateTo)}`
      : "Select dates";
  receiptSkipped.textContent = `Skipped days: ${skippedDays}`;
  const payBy = new Date();
  payBy.setDate(5);
  receiptPayByDate.textContent = formatDate(
    `${payBy.getFullYear()}-${String(payBy.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(payBy.getDate()).padStart(2, "0")}`
  );
  renderReceiptItems(items);
  receiptSubtotal.textContent = subtotal ? currency(subtotal) : "-";
  receiptTax.textContent = taxRate ? currency(taxAmount) : "Rs. 0.00";
  receiptTotal.textContent = subtotal ? currency(total) : "-";

  return {
    totalDays,
    billableDays,
    items,
  };
};

const validate = () => {
  const { totalDays, billableDays, items } = calculate();
  if (!billedToInput.value.trim()) {
    return "Please enter the billed-to name.";
  }
  if (!dateFromInput.value || !dateToInput.value) {
    return "Please select both dates.";
  }
  if (totalDays <= 0) {
    return "Date To must be after or equal to Date From.";
  }
  if (billableDays <= 0) {
    return "Skipped days cannot be more than the total days.";
  }
  if (!items.length) {
    return "Please select at least one milk option.";
  }
  if (items.some((item) => item.qty <= 0 || item.pricePerL <= 0)) {
    return "Selected milk options must have quantity and price greater than 0.";
  }
  return "";
};

const handleSubmit = (event) => {
  event.preventDefault();
  const error = validate();
  errorEl.textContent = error;
};

const sanitizeFilename = (value) =>
  value
    .trim()
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();

const handleDownload = () => {
  const error = validate();
  errorEl.textContent = error;
  if (error) return;

  const billedTo = billedToInput.value.trim() || "receipt";
  const safeName = sanitizeFilename(billedTo) || "receipt";
  const originalTitle = document.title;

  document.title = safeName;
  document.body.classList.add("pdf-export");
  window.print();

  setTimeout(() => {
    document.body.classList.remove("pdf-export");
    document.title = originalTitle;
  }, 500);
};

form.addEventListener("submit", handleSubmit);
downloadButton.addEventListener("click", handleDownload);

[
  billedToInput,
  dateFromInput,
  dateToInput,
  daysSkippedInput,
  cowEnabled,
  cowQuantity,
  cowPrice,
  buffaloEnabled,
  buffaloQuantity,
  buffaloPrice,
  taxRateInput,
].forEach((input) => {
  input.addEventListener("input", calculate);
  input.addEventListener("change", calculate);
});

const setPreviousMonthDates = () => {
  const today = new Date();
  const startPrev = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const endPrev = new Date(today.getFullYear(), today.getMonth(), 0);
  const toIso = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;

  dateFromInput.value = toIso(startPrev);
  dateToInput.value = toIso(endPrev);
};

cowPrice.value = priceMap.cow.toFixed(2);
buffaloPrice.value = priceMap.buffalo.toFixed(2);
setPreviousMonthDates();
calculate();
