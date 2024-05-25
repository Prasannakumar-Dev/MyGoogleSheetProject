const { fetchSheetData } = require("./controllers/googleSheets");
const {
  createEmployeeTable,
  insertEmployees,
  closePool,
} = require("./controllers/postgres");

const BATCH_SIZE = 10; // Number of employees to process in each batch

async function main() {
  try {
    await createEmployeeTable();

    const data = await fetchSheetData();

    // Assuming the first row contains headers, remove it
    const employees = data.slice(1);

    // Process employees in batches
    for (let i = 0; i < employees.length; i += BATCH_SIZE) {
      const batch = employees.slice(i, i + BATCH_SIZE);
      await insertEmployees(batch);
    }

    console.log("All employees processed successfully");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await closePool();
  }
}

main();
