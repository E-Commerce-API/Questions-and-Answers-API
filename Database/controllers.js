const mongoose = require('mongoose');
const Model = require('./models.js')
mongoose.set('useFindAndModify', false);

let getQuestions = async (req, res) => {
  let id = req.query.product_id;
  let page = req.query.page || 0;
  let count = req.query.count || 5;
  let response = {
    product_id: id,
    page: page,
    count: count,
    results: []
  }

  let questions = await Model.find({product_id: id}, {_id: 0})

  if (!questions.length) {
    return response;
  } else {
    response.results.push(...questions)
    return response;
  }

}

// let getQuestions = async (req, res) => {
//   let id = req.query.product_id;
//   let page = req.query.page || 0;
//   let count = req.query.count || 5;
//   let response = {
//     product_id: id,
//     page: page,
//     count: count,
//     results: []
//   }

//   var streamData = await Model.find({product_id: id}, {_id: 0}).stream();
//   streamData.on('data', function(doc) {
//     console.log(doc);
//   })
//   streamData.on('end', function() {
//     console.log('done')
//   })
//   // if (!questions.length) {
//   //   return response;
//   // } else {
//   //   response.results.push(...questions)
//   //   return response;
//   // }

// }

let getAnswers = async (req, res) => {
 let id = req.params.question_id;
 let page = req.params.page || 0;
 let count = req.params.count || 5;
 let response = {
   question: id,
   page: page,
   count: count,
   results: []
 }

 let answers =  await Model.find({question_id: id}, {_id: 0})

if (!answers.length) {
  return response;
} else {
  response.results.push(...answers)
  return response;
}
}

let saveQuestion = async (req, res) => {
  var id = req.query.product_id;
  let questionCount = await Model.find({product_id: id}).sort({question_id: -1}).limit(1);

  req = {body: {
    question_id: (questionCount[0].question_id + 1),
    product_id: id,
    question_body: req.body.question_body,
    quetion_date: new Date().toISOString(),
    asker_name: req.body.asker_name,
    question_helpfulness: 0,
    reported: false
  }}

  let newQuestion = new Model(req.body);
  newQuestion.save(function(err,result) {
        if (err) {
          res.status(500).send(err);
         } else {
           console.log(result)
           res.status(201).json(result);;
         }
      })

}

let saveAnswer = async (req, res) => {
  var id = req.params.question_id;
  let answerCount = await Model.find({question_id: id}, {answers: 1, _id: 0});

  req = {body: {
    question_id: id,
    answer_id: (answerCount[0].answers[0].answer_id + 1),
    body: req.body.body,
    date_written: new Date().toISOString(),
    answerer_name: req.body.answerer_name,
    helpfulness: 0,
    report: false,
    photos: req.body.photos
  }}

  Model.updateOne(
    {'question_id': Number(id)},
    { $push: { answers: req.body }},
    function(err,result) {
      if (err) {
        res.status(500).send(err);
       } else {
         console.log(result)
         res.status(201).json(result);;
       }
    }
  );

};

let updateHelpfulness = (req, res) => {
  var query = {'question_id': req.params.question_id};
  var updateByOne = {'$inc' : {question_helpfulness: 1}};
  Model.findOneAndUpdate(query, updateByOne, {new: true} , (err, result) => {
    if (err) {
      res.status(500).send(err)
    } else {
     res.status(200).send(result);
    }
  })
}

let updateAnswerHelpful = (req, res) => {
  var questionId = req.params.question_id;
  var paramId = req.params.answer_id;
  var query = {'answers.answer_id': Number(paramId)};
  var updateHelpful = {$inc : {'answers.$.helpful': 1}}
  Model.updateOne(query, updateHelpful, {new: true} , (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      console.log(result);
     res.status(200).send(result);
    }
  })

}

let updateAnswerReport = (req, res) => {
  var paramId = req.params.answer_id;
  var query = {'answers.answer_id': Number(paramId)};
  var updateHelpful = {'reported': true}
  Model.updateOne(query, updateHelpful, {new: true} , (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      console.log(result);
     res.status(200).send(result);
    }
  })
}

module.exports = {
  getQuestions,
  getAnswers,
  saveQuestion,
  saveAnswer,
  updateHelpfulness,
  updateAnswerHelpful,
  updateAnswerReport
}



