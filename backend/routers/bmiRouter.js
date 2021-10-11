import express from 'express';
import Bmi from '../models/bmiModel.js';
import expressAsyncHandler from 'express-async-handler';

const bmiRouter = express.Router();

  bmiRouter.post(
    '/seed',
    expressAsyncHandler(async (req, res) => {
      const bmi = new Bmi({
        weight: req.body.weight,
        height: req.body.height,
      });
      const createdBmi = await bmi.save();
      res.send({
        _id: createdBmi._id,
        weight: createdBmi.weight,
        height: createdBmi.height,
      });
    })
  );
  export default bmiRouter;