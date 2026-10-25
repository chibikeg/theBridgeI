function doPost(e) {
  try {
    var payload =
      e && e.postData && e.postData.contents
        ? JSON.parse(e.postData.contents)
        : {};

    // The form-handler.js sends { formName: "...", fields: { name: "...", ... } }
    // Fields are nested inside payload.fields, not at the top level.
    var formName = payload.formName || "Unknown form";
    var fields = payload.fields || {};

    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

    // Try to find a sheet matching the form name, fall back to "Form Responses"
    var sheet =
      spreadsheet.getSheetByName(formName) ||
      spreadsheet.getSheetByName("Form Responses");

    if (!sheet) {
      // Create the sheet if it does not exist yet
      sheet = spreadsheet.insertSheet("Form Responses");
    }

    // If the sheet is empty, write a header row automatically
    if (sheet.getLastRow() === 0) {
      var autoHeaders = ["Timestamp", "Form"].concat(Object.keys(fields));
      sheet.appendRow(autoHeaders);
    }

    var headers = sheet
      .getRange(1, 1, 1, sheet.getLastColumn())
      .getValues()[0];

    var row = [];
    headers.forEach(function (header) {
      var key = String(header || "").trim();
      if (key === "Timestamp") {
        row.push(new Date().toISOString());
      } else if (key === "Form") {
        row.push(formName);
      } else {
        // Look up the value from the nested fields object
        var value = fields[key];
        row.push(value !== undefined && value !== null ? value : "");
      }
    });

    sheet.appendRow(row);

    return ContentService.createTextOutput(
      JSON.stringify({ message: "Submission recorded successfully." })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ message: "Submission failed: " + error.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput(
    "Bridge Initiative Google Sheet endpoint is active."
  );
}
