import { WHITELIST_DOMAIN } from '*/utilities/constants'

export const corsOptions = {
    origin: function (origin, callback) {
        if (WHITELIST_DOMAIN.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error(`${origin} Not allowed by CORS`))
        }
    },
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
