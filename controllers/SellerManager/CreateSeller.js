const { sendResponse, AppEror } = require('../../utils');
const Seller = require('d:/webb/backsau/models/Seller');
const Product = require('../../models/Product');

const createSeller = async (req, res, next) => {
    const infor = req.body;

    if (!infor || !infor.name || !infor.email || !infor.password) {
        throw new AppEror(400, "Thiếu thông tin người bán");
    }
    const seller = await Seller.findOne({ email: infor.email });
    if (seller) {
        throw new AppEror(400, "Email đã tồn tại");
    }
    const newSeller = await Seller.create(infor);
    
    if (!Array.isArray(newSeller.products)) {
        newSeller.products = [];
    
    if(infor.products&&infor.products.length>0) {
        newSeller.products.push(infor.products);
        for (let i = 0; i < infor.products.length; i++) {
            const product = await Product.findById(infor.products[i]);
            if (!product) {
                throw new AppEror(400, "Sản phẩm không tồn tại");
            }
            product.SellerID = newSeller._id;
            await product.save();
        }
    }
    Product.SellerID = newSeller._id;
    await Product.save();
}
sendResponse(
    res,
     201,
      true,
       newSeller,
        null,
         "Tạo người bán thành công"
        );
    }
   

module.exports = createSeller;
    