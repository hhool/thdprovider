import express from 'express';
import { processRequest } from './process.js'; // 注意添加 .js 扩展名
import { Request, Response } from 'express';

const app = express();
const port = 3000;

app.use(express.json());

app.post('/process', (req: Request, res: Response) => {
  const requestData = req.body;
  const responseData = processRequest(requestData);
  res.json(responseData);
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
