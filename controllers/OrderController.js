import { getOrderById } from "../models/OrderModel.js";

export default {
    // Get Order by Id
    getOrderById: async (req, res) => {
        try {
            const orderId = req.params.id; // Get Order ID from URL
            const result = await getOrderById(orderId);

            if(!result) {
                return res.status(404).json({error: "Order not found"});
            }

            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }
}