
/* ================= PAYSTACK CONFIG =================
   1. Create free account at https://paystack.com
   2. Settings > API Keys & Webhooks > copy TEST secret/public key
   3. Replace below. Amounts are in KOBO (naira x 100).
   Test mode uses Paystack's test cards, no real money moves. */
const PAYSTACK_PUBLIC_KEY = "pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

/* Room price list (naira per night) — edit freely */
const ROOMS = {
  "Standard Room":      { price: 15000, desc: "Comfortable single/double room" },
  "Deluxe Room":        { price: 25000, desc: "Spacious room, city view" },
  "Executive Suite":    { price: 40000, desc: "Lounge + bedroom, VIP treatment" },
  "Conference Hall":    { price: 120000, desc: "Full-day hall rental" }
};

const fmt = n => "₦" + n.toLocaleString("en-NG");

function calcNights() {
  const ci = document.getElementById("checkin").value;
  const co = document.getElementById("checkout").value;
  if (!ci || !co) return 0;
  const n = Math.round((new Date(co) - new Date(ci)) / 86400000);
  return n > 0 ? n : 0;
}

function updateSummary() {
  const room = document.getElementById("room").value;
  const nights = calcNights();
  const rate = ROOMS[room].price;
  const total = rate * nights;
  document.getElementById("sum-room").textContent = room;
  document.getElementById("sum-nights").textContent = nights + " night" + (nights === 1 ? "" : "s");
  document.getElementById("sum-rate").textContent = fmt(rate) + " / night";
  document.getElementById("sum-total").textContent = fmt(total);
  return total;
}

function showAlert(kind, msg) {
  const box = document.getElementById("booking-alert");
  box.className = "alert alert-" + kind;
  box.textContent = msg;
  box.scrollIntoView({ behavior: "smooth", block: "center" });
}

function validate() {
  const req = ["fullname","phone","email","room","checkin","checkout","guests"];
  for (const id of req) {
    const el = document.getElementById(id);
    if (!el.value.trim()) { el.focus(); showAlert("error", "Please fill in all required fields."); return false; }
  }
  if (calcNights() < 1) { showAlert("error", "Check-out must be after check-in."); return false; }
  const phone = document.getElementById("phone").value.replace(/\D/g, "");
  if (phone.length < 10) { showAlert("error", "Enter a valid phone number."); return false; }
  return true;
}

function buildBookingRef() {
  return "PNC-" + Date.now().toString(36).toUpperCase();
}

function saveBooking(data) {
  /* Firebase if configured, otherwise local demo storage */
  if (db) {
    return db.collection("bookings").add({ ...data, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
  }
  const demo = JSON.parse(localStorage.getItem("pinec_demo_bookings") || "[]");
  demo.push(data);
  localStorage.setItem("pinec_demo_bookings", JSON.stringify(demo));
  return Promise.resolve();
}

function payNow() {
  if (!validate()) return;
  const total = updateSummary();
  if (total <= 0) { showAlert("error", "Invalid dates selected."); return; }

  const booking = {
    ref: buildBookingRef(),
    name: document.getElementById("fullname").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    email: document.getElementById("email").value.trim(),
    room: document.getElementById("room").value,
    checkin: document.getElementById("checkin").value,
    checkout: document.getElementById("checkout").value,
    guests: document.getElementById("guests").value,
    requests: document.getElementById("requests").value.trim(),
    amount: total,
    currency: "NGN",
    status: "pending",
    paidAt: null
  };

  /* Demo mode without Paystack key */
  if (PAYSTACK_PUBLIC_KEY.includes("xxxx")) {
    booking.status = "demo-paid";
    booking.paidAt = new Date().toISOString();
    saveBooking(booking).then(() => {
      showAlert("success", "DEMO MODE: Payment simulated. Booking " + booking.ref + " saved (" + fmt(total) + "). Add your Paystack key to accept real payments.");
      document.getElementById("book-form").reset();
      updateSummary();
    });
    return;
  }

  /* Real Paystack checkout */
  const handler = PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email: booking.email,
    amount: total * 100,               // kobo
    currency: "NGN",
    ref: booking.ref,
    metadata: {
      custom_fields: [
        { display_name: "Guest Name", variable_name: "guest_name", value: booking.name },
        { display_name: "Room", variable_name: "room", value: booking.room },
        { display_name: "Check-in", variable_name: "checkin", value: booking.checkin },
        { display_name: "Check-out", variable_name: "checkout", value: booking.checkout }
      ]
    },
    callback: function (response) {
      booking.status = "paid";
      booking.paidAt = new Date().toISOString();
      booking.paystackRef = response.reference;
      saveBooking(booking).then(() => {
        showAlert("success", "Payment successful! Booking reference: " + booking.ref + ". A confirmation has been sent to your email.");
        document.getElementById("book-form").reset();
        updateSummary();
      }).catch((e) => {
        showAlert("error", "Payment received but saving failed — contact us with reference " + response.reference);
      });
    },
    onClose: function () {
      showAlert("error", "Payment window closed. Your booking was NOT completed.");
    }
  });
  handler.openIframe();
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("book-form");
  if (!form) return;
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("checkin").min = today;
  document.getElementById("checkout").min = today;
  ["room","checkin","checkout","guests"].forEach(id =>
    document.getElementById(id).addEventListener("change", updateSummary));
  document.getElementById("pay-btn").addEventListener("click", (e) => { e.preventDefault(); payNow(); });
  updateSummary();
});
