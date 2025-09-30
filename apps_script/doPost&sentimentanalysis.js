function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Dispositions");
    var data = JSON.parse(e.postData.contents);

    // 🔹 Text for sentiment analysis (remark or agent message)
    var textToAnalyze = data.disposition_remark || data.agent_message || "";
    var sentiment = analyzeSentiment(textToAnalyze);

    // 1️⃣ Append row to "Dispositions" sheet
    sheet.appendRow([
      new Date(),                                // Timestamp
      data.customer_name || "",                  // Debtor Name
      data.loan_id || "",                        // Loan ID
      data.bucket || "",                         // Bucket
      data.due_date || "",                       // Due Date
      data.amount_due || "",                     // Amount Due
      data.mobile_number || "",                  // Mobile Number
      data.stage_code || "",                     // Stage Code
      data.disposition_remark || "",             // Disposition Remark
      data.intent || "",                         // Detected Intent
      JSON.stringify(data.next_action || {}),    // Next Action
      JSON.stringify(data.compliance || {}),     // Compliance Notes
      sentiment                                  // ✅ New column: Sentiment
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ status: "success", logged: true, sentiment: sentiment })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: err.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// 🔹 Hugging Face Sentiment API call
function analyzeSentiment(text) {
  if (!text || text.trim() === "") return "neutral"; // fallback

  var apiKey = PropertiesService.getScriptProperties().getProperty("HF_API_KEY");
  if (!apiKey) {
    Logger.log("❌ HF_API_KEY not found in Script Properties");
    return "neutral";
  }

  var url = "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english";
  var options = {
    "method": "post",
    "headers": { "Authorization": "Bearer " + apiKey },
    "contentType": "application/json",
    "payload": JSON.stringify({ "inputs": text }),
    "muteHttpExceptions": true
  };

  try {
    var response = UrlFetchApp.fetch(url, options);
    var result = JSON.parse(response.getContentText());

    if (result && result[0] && result[0][0]) {
      var label = result[0][0].label;
      var score = result[0][0].score;

      if (label === "NEGATIVE" && score > 0.6) return "angry";
      if (label === "POSITIVE" && score > 0.6) return "polite";
      return "neutral";
    }
  } catch (err) {
    Logger.log("Sentiment API error: " + err.message);
  }

  return "neutral"; // fallback
}
