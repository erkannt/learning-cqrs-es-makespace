import express, {Application, Request, Response} from 'express';
import path from 'path';

const app: Application = express();
const port = 8080;

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('<h1>Hello World</h1>');
});

app.use('/static', express.static(path.resolve(__dirname, './static')));

app.listen(port, () =>
  process.stdout.write(`Server is listening on port ${port}!\n`)
);
