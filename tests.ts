import Database from './classes/Database'

const db = new Database('mongodb://127.0.0.1:27017', 'users') // Init Database

db.listDocuments().then((data: any) => {
  console.log(data)
  db.close()
})
