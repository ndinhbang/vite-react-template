import { registerSW } from 'virtual:pwa-register'

// no less than 1 minute
const intervalMS = 2 * 60 * 1000

registerSW({
    onRegisteredSW(swUrl, r) {
        r && setInterval(async () => {
            if (!(!r.installing && navigator))
                return

            // check if user go offline
            if (('connection' in navigator) && !navigator.onLine)
                return

            // check if server is down when calling the update method
            const resp = await fetch(swUrl, {
                cache: 'no-store',
                headers: {
                    'cache': 'no-store',
                    'cache-control': 'no-cache',
                },
            })

            if (resp?.status === 200)
                await r.update()
        }, intervalMS)
    }
})