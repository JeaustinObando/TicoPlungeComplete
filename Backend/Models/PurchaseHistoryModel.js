const mongoose = require("mongoose");

/**
 * Modelo de historial de compras.
 */
const PurchaseHistorySchema = new mongoose.Schema({
  buyerName: {
    type: String,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  detail: {
    type: String,
    required: true,
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
});

// Exportación del modelo
module.exports = mongoose.model("PurchaseHistory", PurchaseHistorySchema);
