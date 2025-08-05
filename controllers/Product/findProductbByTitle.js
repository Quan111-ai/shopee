const { AppError, sendResponse } = require('../../helpers/utils');
const Product = require('../../models/Product');

const findProductbyTitle = async (req, res, next) => {
    try {
        const { title } = req.query;

        if (!title) {
            throw new AppError(400, "Title query is required");
        }

        // Sử dụng trường 'name' để tìm kiếm sản phẩm theo tên
        const products = await Product.find({
            name: { $regex: title, $options: 'i' }
        }).populate([
            { path: 'categoryID', select: 'name' },
            { path: 'sellerID', select: 'name' }
        ]);

        if (!products.length) {
            throw new AppError(404, "No products found with the given title");
        }

        sendResponse(
            res,
            200,
            true,
            products,
            null,
            "Find products by title successfully"
        );
    } catch (error) {
        next(error);
    }
};

module.exports = findProductbyTitle;