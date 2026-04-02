const ORGANIZER_WHATSAPP = "905468009243";
const ORGANIZER_EMAIL = "sosyaldemokrasi.isik@gmail.com";

const form = document.getElementById("ticketForm");
const whatsappBtn = document.getElementById("whatsappBtn");
const emailBtn = document.getElementById("emailBtn");
const formStatus = document.getElementById("formStatus");

const previewStudentNo = document.getElementById("previewStudentNo");
const previewFullName = document.getElementById("previewFullName");
const previewPhone = document.getElementById("previewPhone");
const previewTicketCode = document.getElementById("previewTicketCode");

const fields = {
  studentNo: document.getElementById("studentNo"),
  firstName: document.getElementById("firstName"),
  lastName: document.getElementById("lastName"),
  phone: document.getElementById("phone")
};

function normalizePhone(value) {
  return value.replace(/[^\d+]/g, "");
}

function createTicketCode(studentNo) {
  const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const cleaned = studentNo.replace(/\D/g, "").slice(-4) || "0000";
  return `SDK-${datePart}-${cleaned}`;
}

function getFormData() {
  const studentNo = fields.studentNo.value.trim();
  const firstName = fields.firstName.value.trim();
  const lastName = fields.lastName.value.trim();
  const phone = normalizePhone(fields.phone.value.trim());
  const fullName = `${firstName} ${lastName}`.trim();
  const ticketCode = createTicketCode(studentNo);

  return { studentNo, firstName, lastName, phone, fullName, ticketCode };
}

function updatePreview() {
  const data = getFormData();
  previewStudentNo.textContent = data.studentNo || "-";
  previewFullName.textContent = data.fullName || "-";
  previewPhone.textContent = data.phone || "-";
  previewTicketCode.textContent = data.studentNo ? data.ticketCode : "-";
}

function validateForm() {
  const data = getFormData();

  if (!data.studentNo || !data.firstName || !data.lastName || !data.phone) {
    formStatus.textContent = "Lutfen tum alanlari doldur.";
    return null;
  }

  if (!/^\+?\d{10,15}$/.test(data.phone)) {
    formStatus.textContent = "Telefon numarasini gecerli formatta gir.";
    return null;
  }

  formStatus.textContent = "Form hazir. Istegin yollanabilir.";
  return data;
}

function buildMessage(data) {
  return [
    "Gemi Mezuniyet Partisi Bilet Talebi",
    `Ogrenci No: ${data.studentNo}`,
    `Ad Soyad: ${data.fullName}`,
    `Telefon: ${data.phone}`,
    `Bilet Kodu: ${data.ticketCode}`
  ].join("\n");
}

function buildWhatsAppUrl(data) {
  const message = encodeURIComponent(buildMessage(data));
  return `https://wa.me/${ORGANIZER_WHATSAPP}?text=${message}`;
}

function sendWhatsApp() {
  const data = validateForm();
  if (!data) {
    return;
  }

  const url = buildWhatsAppUrl(data);
  window.location.href = url;
}

function sendEmail() {
  const data = validateForm();
  if (!data) {
    return;
  }

  const subject = encodeURIComponent(`Bilet Talebi - ${data.ticketCode}`);
  const body = encodeURIComponent(buildMessage(data));
  window.location.href = `mailto:${ORGANIZER_EMAIL}?subject=${subject}&body=${body}`;
}

Object.values(fields).forEach((field) => {
  field.addEventListener("input", () => {
    updatePreview();
    if (formStatus.textContent) {
      validateForm();
    }
  });
});

whatsappBtn.addEventListener("click", sendWhatsApp);
emailBtn.addEventListener("click", sendEmail);

form.addEventListener("submit", (event) => {
  event.preventDefault();
});

updatePreview();
