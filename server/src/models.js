import mongoose from 'mongoose';
const QuestionSchema = new mongoose.Schema({ text:{type:String,required:true,trim:true}, type:{type:String,enum:['single','multiple','text'],required:true}, required:{type:Boolean,default:false}, options:{type:[String],default:[]} });
const SurveySchema = new mongoose.Schema({ title:{type:String,required:true,trim:true}, description:{type:String,default:''}, questions:{type:[QuestionSchema],required:true}, createdAt:{type:Date,default:Date.now} });
const AnswerSchema = new mongoose.Schema({ questionId:{type:mongoose.Schema.Types.ObjectId,required:true}, value:{type:mongoose.Schema.Types.Mixed} }, {_id:false});
const ResponseSchema = new mongoose.Schema({ surveyId:{type:mongoose.Schema.Types.ObjectId,required:true,index:true}, answers:{type:[AnswerSchema],default:[]}, submittedAt:{type:Date,default:Date.now} });
ResponseSchema.index({surveyId:1,submittedAt:-1});
export const Survey = mongoose.model('Survey',SurveySchema);
export const Response = mongoose.model('Response',ResponseSchema);
