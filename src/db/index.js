import Dexie from 'dexie'

const db = new Dexie('AccountBook')

db.version(1).stores({
  expenses: '++id, date, category, paymentMethod, createdAt'
})

export default db
