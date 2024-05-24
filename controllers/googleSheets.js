const { google } = require("googleapis");
const fs = require("fs");
const { googleSheets } = require("../config/config");

const credentials = JSON.parse(fs.readFileSync(googleSheets.credentialsPath));

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const sheets = google.sheets({ version: "v4", auth });

async function fetchSheetData() {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: googleSheets.spreadsheetId,
    range: googleSheets.range,
  });

  return response.data.values;
}

module.exports = { fetchSheetData };
