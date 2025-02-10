// ดึงค่าใช้จ่ายจาก Local Storage
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
// ฟังก์ชันเพิ่มค่าใช้จ่าย
function addExpense(expenseData) {
  if (
    !expenseData.title ||
    isNaN(expenseData.amount) ||
    !expenseData.category ||
    !expenseData.date
  ) {
    alert("กรุณากรอกข้อมูลให้ครบถ้วน");
    return;
  }
  const newExpense = { id: Date.now(), ...expenseData };
  expenses.push(newExpense);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  renderExpenses();
  updateTotal();
  updateSummary();
}
// ฟังก์ชันดึงค่าใช้จ่ายตามวันที่
function getExpensesByDate(date) {
  return expenses.filter((expense) => expense.date === date);
}
// ฟังก์ชันคำนวณค่าใช้จ่ายตามหมวดหมู่
function calculateTotalByCategory(category) {
  return expenses
    .filter((expense) => expense.category === category)
    .reduce((sum, expense) => sum + expense.amount, 0);
}
// ฟังก์ชันแสดงรายการค่าใช้จ่ายแบบตาราง
function renderExpenses() {
  const expenseList = document.getElementById("expenseList");
  expenseList.innerHTML = "";
  expenses.forEach((expense) => {
    const row = document.createElement("tr");
    row.innerHTML = ` <td>${expense.date}</td> <td>${expense.title}</td> <td>${expense.amount}</td> <td>${expense.category}</td> <td><button class="edit-btn" onclick="populateEditForm(${expense.id})">แก้ไข</button></td> <td><button class="delete-btn" onclick="deleteExpense(${expense.id})">ลบ</button> </td> `;
    expenseList.appendChild(row);
  });
}
// ฟังก์ชันแก้ไขค่าใช้จ่าย
function editExpense(id, updatedData) {
  const index = expenses.findIndex((expense) => expense.id === id);
  if (index !== -1) {
    expenses[index] = { ...expenses[index], ...updatedData };
    localStorage.setItem("expenses", JSON.stringify(expenses));
    renderExpenses();
    updateTotal();
    updateSummary();
  }
}
// ฟังก์ชันเติมข้อมูลลงฟอร์มเพื่อแก้ไข
function populateEditForm(id) {
  const expense = expenses.find((expense) => expense.id === id);
  if (expense) {
    document.getElementById("title").value = expense.title;
    document.getElementById("amount").value = expense.amount;
    document.getElementById("category").value = expense.category;
    document.getElementById("date").value = expense.date;
    document.getElementById("expenseId").value = expense.id;
  }
}
// ฟังก์ชันลบค่าใช้จ่าย
function deleteExpense(id) {
  expenses = expenses.filter((expense) => expense.id !== id);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  renderExpenses();
  updateTotal();
  updateSummary();
}
// ฟังก์ชันคำนวณค่าใช้จ่ายรวม
function updateTotal() {
  const totalAmount = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  document.getElementById("totalAmount").textContent = totalAmount;
}
// ฟังก์ชันคำนวณค่าใช้จ่ายรายวัน
function calculateDailyTotal() {
  const dailyTotals = {};
  expenses.forEach((expense) => {
    dailyTotals[expense.date] =
      (dailyTotals[expense.date] || 0) + expense.amount;
  });
  return dailyTotals;
}
// ฟังก์ชันคำนวณค่าใช้จ่ายรายเดือน
function generateMonthlyReport() {
  const monthlyTotals = {};
  expenses.forEach((expense) => {
    const month = expense.date.slice(0, 7);
    monthlyTotals[month] = (monthlyTotals[month] || 0) + expense.amount;
  });
  return monthlyTotals;
}
// ฟังก์ชันอัปเดตการแสดงผลของสรุปค่าใช้จ่าย
function updateSummary() {
  const dailyTotals = calculateDailyTotal();
  const monthlyTotals = generateMonthlyReport();
  const dailySummary = document.getElementById("dailySummary");
  const monthlySummary = document.getElementById("monthlySummary");
  dailySummary.innerHTML = "<h3>ค่าใช้จ่ายรายวัน</h3>";
  Object.keys(dailyTotals)
    .sort()
    .forEach((date) => {
      dailySummary.innerHTML += `<p>${date}: ${dailyTotals[date]} บาท</p>`;
    });
  monthlySummary.innerHTML = "<h3>ค่าใช้จ่ายรายเดือน</h3>";
  Object.keys(monthlyTotals)
    .sort()
    .forEach((month) => {
      monthlySummary.innerHTML += `<p>${month}: ${monthlyTotals[month]} บาท</p>`;
    });
}
// โหลดข้อมูลเมื่อหน้าเว็บเปิดขึ้น
document.getElementById("expenseForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const expenseData = {
    title: document.getElementById("title").value,
    amount: parseFloat(document.getElementById("amount").value),
    category: document.getElementById("category").value,
    date: document.getElementById("date").value,
  };
  addExpense(expenseData);
  document.getElementById("expenseForm").reset();
});
renderExpenses();
updateTotal();
updateSummary();
