function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DebtAssistantData"); 
  
  // Read row 2, columns A–H (assuming column H will hold email)
  var data = sheet.getRange(2,1,1,8).getValues()[0]; 
  
  var obj = {
    "additional_info": {
      "inya_data": {
        "text": "Hello " + data[0] + ", your payment of ₹" + data[2] + " for Loan " + data[1] + 
                " is due on " + data[3] + ". You are in " + data[4] + ".",
        "user_context": {
          "customer_name": data[0],
          "loan_id": data[1],
          "amount_due": data[2],
          "due_date": data[3],
          "bucket": data[4],
          "last_payment_date": data[5],
          "preferred_language": data[6],
          // ✅ Add customer_email
          "customer_email": data[7] || "demo.user@example.com"
        }
      }
    }
  };
}
