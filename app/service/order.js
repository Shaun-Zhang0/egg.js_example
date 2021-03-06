const Service = require("egg").Service;

class OrderService extends Service {
    async create(params) {
        const {ctx} = this;
        const {cookiesObj} = ctx;
        const {timeStamp, product_id, product_num} = params;
        const {errorCode} = ctx.app.config;
        const getUserInfoByToken = JSON.parse(await ctx.service.redis.get(cookiesObj.key));
        const productNumUpdateStatus = await ctx.service.product.deductProduct(product_id, product_num);
        let result = {};
        if (productNumUpdateStatus) { // 删减商品库存成功
            const {account} = getUserInfoByToken;
            const orderAddResult = await this.app.mysql.insert('order', {
                account,
                product_id,
                product_quantity: product_num,
                create_time: timeStamp
            });
            if (orderAddResult.affectedRows > 0) {
                result = {code: 1, message: '创建订单成功'}
            } else {
                result = errorCode.CREATE_ORDER_ERROR
            }
        } else {
            result = errorCode.PRODUCT_INVENTORY_QUANTITY;
        }
        return result;
    }
}

module.exports = OrderService;
