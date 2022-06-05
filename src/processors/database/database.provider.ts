import { mongoose } from '@typegoose/typegoose'

import { MONGO_DB } from '~/app.config'
import { DB_CONNECTION_TOKEN } from '~/constants/system.constant'

export const databaseProvider = {
  provide: DB_CONNECTION_TOKEN,
  useFactory: async () => {
    let reconnectionTask: NodeJS.Timeout | null = null
    const RECONNECT_INTERVAL = 6000

    const connection = () => {
      return mongoose.connect(MONGO_DB.uri, {})
    }


    mongoose.connection.on('connecting', () => {
    })

    mongoose.connection.on('open', () => {
      if (reconnectionTask) {
        clearTimeout(reconnectionTask)
        reconnectionTask = null
      }
    })

    mongoose.connection.on('disconnected', () => {

      reconnectionTask = setTimeout(connection, RECONNECT_INTERVAL)
    })

    mongoose.connection.on('error', (error) => {
      mongoose.disconnect()
    })

    return await connection().then((mongoose) => mongoose.connection)
  },
}
