import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import fs from 'fs'

if (fs.existsSync('db.json')) {
  fs.unlinkSync('db.json')
}

const adapter = new FileSync('db.json')

const db = low(adapter)

export default db
