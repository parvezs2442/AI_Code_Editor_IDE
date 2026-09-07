import proxy from "express-http-proxy"
import redis from "../../shared/redis/redis.js"

export const proxyWithHeader = (serviceUrl) => {
    return proxy(serviceUrl, {
        proxyReqPathResolver: (req) => {
            return req.url || "/"
        },
        proxyReqOptDecorator: async (proxyReqOpts, srcReq) => {
            // Forward existing cookie header
            if (srcReq.headers.cookie) {
                proxyReqOpts.headers["cookie"] = srcReq.headers.cookie
            }

            // Extract session from cookie and lookup in Redis to supply x-user-id
            const sessionId = srcReq.cookies?.session
            if (sessionId) {
                try {
                    const rawSession = await redis.get(`session-${sessionId}`)
                    if (rawSession) {
                        const sessionData = JSON.parse(rawSession)
                        const userId = sessionData.userId || sessionData._id
                        if (userId) {
                            proxyReqOpts.headers["x-user-id"] = userId.toString()
                        }
                    }
                } catch (err) {
                    console.error("Proxy session fetch error:", err)
                }
            } else if (srcReq.user) {
                const userId = srcReq.user.userId || srcReq.user._id
                if (userId) {
                    proxyReqOpts.headers["x-user-id"] = userId.toString()
                }
            }

            return proxyReqOpts
        }
    })
}