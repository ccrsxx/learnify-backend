import { ApplicationError } from '../../libs/error.js';
import { getStatistic } from '../services/statistic.js';

// @ts-ignore
export async function statistic(_req, res) {
  try {
    const data = await getStatistic();
    res.status(200).json({
      status: 'OK',
      message: 'Successful',
      data
    });
  } catch (err) {
    if (err instanceof ApplicationError)
      res.status(err.statusCode).json({
        message: `Internal Server Error: ${err.message}`
      });
  }
}
