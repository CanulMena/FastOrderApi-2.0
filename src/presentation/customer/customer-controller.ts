import { Request, Response } from 'express';
export class CustomerController{

  constructor(
    //TODO: Add customer repository
  ){}
  
  public postCustomer = (req: Request, res: Response) => {//POST /api/customer
    res.status(200).json({message: `${req.body.message}`});
  }
}