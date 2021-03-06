const Service = require("egg").Service;

class RedisService extends Service {
    /**
     * 设置
     * @param {*} key key值
     * @param {*} value 需要存储的值
     * @param {*} time 过期时间
     */
    async set(key, value, time) {
        const {redis} = this.app;
        value = JSON.stringify(value);
        if (!time) {
            await redis.set(key, value)
        } else {
            await redis.set(key, value, 'EX', time);
        }
    }

    /**
     * 获取
     * @param {*} key
     */
    async get(key) {
        const {redis} = this.app;
        let data = await redis.get(key);
        if (!data) {
            return false;
        }
        return data;
    }

    /**
     * 删除redis中的token
     * @param key
     * @returns {Promise<number>}
     */
    async delete(key) {
        const {redis} = this.app;
        await redis.del(key);
    }

    /**
     * 重新设置过期时间
     * @param key
     * @param time
     * @returns {Promise<void>}
     */
    async expireTokenLiveTime(key,time){
        const {redis} = this.app;
        await redis.expire(key,time)
    }
    /**
     * 获取过期时间
     * @param key
     * @returns {Promise<number>}
     */
    async getLiveTime(key){
        const {redis} = this.app;
        const time = await redis.ttl(key);
        return time;
    }
}

module.exports = RedisService;
