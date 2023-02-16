import express from 'express'
import sqlite3 from 'sqlite3';
import util from 'node:util';

const app: express.Express = express()
const db = new sqlite3.Database("./blog.db");

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

type Entry = {
  id: string;
  title: string;
};

app.get('/rest', async (req: express.Request, res: express.Response) => {
    const queryStatement = db.prepare(`SELECT id, title FROM entry LIMIT ${process.env.LIMIT}`);
    const entries = (
      await util.promisify(
              queryStatement
              .all
              .bind(queryStatement))
              .call(queryStatement)
    ) as Entry[];

    res.send(JSON.stringify({ data: { entries: entries } }))
})

app.listen(4001, () => {
    console.log("Start on port 4001.")
})

