import { ApplicationError } from '../../libs/error.js';
import * as Types from '../../libs/types/common.js';
import * as paymentServices from './../services/payment.js';
/**
 * @type {Types.Controller}
 * @returns {Promise<void>}
 */

export async function payCourse(req, res) {
  try {
    const body = req.body;
    const data = await paymentServices.payCourse(body);

    res.status(201).json(data);
  } catch (err) {
    if (err instanceof ApplicationError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }
  }
}

/**
 * @param {{ body: any }} req
 * @param {{
 *   status: (arg0: number) => {
 *     (): any;
 *     new (): any;
 *     json: { (arg0: { message: string } | undefined): void; new (): any };
 *   };
 * }} res
 */
export async function updatePayCourse(req, res) {
  try {
    // @ts-ignore
    const body = req.body;
    const updateddata = await paymentServices.updatePayCourse(body);
    res.status(200).json(updateddata);
  } catch (err) {
    if (err instanceof ApplicationError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }
  }
}
