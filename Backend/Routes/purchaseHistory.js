const express = require('express');
const router = express.Router();
const PurchaseHistory = require('../Models/PurchaseHistoryModel');

// Obtener todo el historial de compras
router.get('/', async (req, res) => {
    try {
        const history = await PurchaseHistory.find();
        res.json(history);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Crear una nueva entrada en el historial de compras
router.post('/', async (req, res) => {
    const { buyerName, totalAmount, detail } = req.body;

    const history = new PurchaseHistory({
        buyerName,
        totalAmount,
        detail
    });

    try {
        const newHistory = await history.save();
        res.status(201).json(newHistory);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Eliminar una entrada del historial de compras
router.delete('/:id', async (req, res) => {
    try {
        const result = await PurchaseHistory.deleteOne({ _id: req.params.id });
        if (result.deletedCount === 0) {
            console.log('Purchase not found');
            return res.status(404).json({ message: 'Purchase not found' });
        }
        res.json({ message: 'Purchase deleted' });
    } catch (err) {
        console.error(`Error deleting purchase: ${err.message}`);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
