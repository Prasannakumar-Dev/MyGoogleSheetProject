const { fetchSheetData } = require("./controllers/googleSheets");
const {
  createEmployeeTable,
  insertEmployee,
  closePool,
} = require("./controllers/postgres");

async function main() {
  try {
    await createEmployeeTable();

    const data = await fetchSheetData();

    // 1st row is headers, remove it
    const employees = data.slice(1);

    for (let employee of employees) {
      await insertEmployee(employee);
    }
    console.log("All employees inserted successfully");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await closePool();
  }
}

main();
