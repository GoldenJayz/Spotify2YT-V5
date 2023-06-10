import { db } from './Helpers/exports';
// import Database  from './classes/Database';

db.listDocuments('payerId', '42MU39UGCUAMU').then(res => console.log(res));

