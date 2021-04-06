
const mongoose = require('mongoose');


const { validationResult } = require('express-validator')
const  User = require('../models/user-schema')
const  Plan = require('../models/plans-schema');
const HttpError = require('../middleware/http-error');

const { v1: uuid } = require('uuid')



//get list of plans 
const getPlansList = async (req, res, next) => {
    let plans
    try{
        plans = await Plan.find()
    }
    catch(err){
        const error = new HttpError("can't fetch plans complete request",500)
        return next(error)
    }
    res.json({ plans : plans.map( plans => plans.toObject({ getters : true}))})
    
  }
  
  
  

// post plan 
const createPlan = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

      return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
      );
    }
  
    const { title, description, amount,type, validity } = req.body;
  
 
  
    const createdPlan = new Plan({
      title,
      description,
      amount,
      validity,
      type
    });
  
   
    try {
        await createdPlan.save();
      } catch (err) {
        const error = new HttpError(
          'Creating Plan failed, please try again.',
          500
        );
        console.log(err)
        return next(error);
      }

  
    res.status(201).json({ plan: createdPlan });
  };
  

//update plan
const updatePlan = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
      );
    }
  
    const { title, description  , validity, amount , plantype} = req.body;
    
   //  const planId = req.params.pid;
    let plan;
    try {
      plan = await Plan.findOneAndUpdate({type : plantype});
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not update plan.',
        500
      );
      return next(error);
    }
  
    plan.title = title;
    plan.description = description;
    plan.validity = validity;
    plan.amount = amount;
  
    try {
      await plan.save();
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, couldnt update plan.',
        500
      );
      return next(error);
    }
  
    res.status(200).json({ plan: plan.toObject({ getters: true }) });
  };
  

  const deletePlan = async (req, res, next) => {
    const planId = req.params.pid;
    Plan.findByIdAndRemove(planId)
    .then((result) => {
      res.json({
        success: true,
        msg: `plan has been deleted.`,
        result: {
          _id: result._id,
          title: result.title,
        }
      });
    })
    .catch((err) => {
      res.status(404).json({ success: false, msg: 'there is no plan to delete with provided id.' });
    });

  };
  

  exports.createPlan =createPlan ;
  exports.getPlansList = getPlansList;
  exports.updatePlan = updatePlan;
  exports.deletePlan = deletePlan;