import Redis from "ioredis"

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
    connectTimeout: 2000,
    commandTimeout: 1500,
    maxRetriesPerRequest: 1,
    enableOfflineQueue: false,
    retryStrategy: () => null
})

redis.on("connect", () => {
    console.log("Redis connected successfully")
})

redis.on("error", (err) => {
    console.warn("Redis error (app will use fallback):", err.message)
})

export default redis