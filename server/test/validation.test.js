import test from 'node:test';
import assert from 'node:assert/strict';
import { validateSurvey, validateAnswers } from '../src/validation.js';
test('survey validation accepts a well-formed survey',()=>{assert.deepEqual(validateSurvey({title:'Feedback',questions:[{text:'Rate us',type:'single',options:['Good','Bad']}]}),[]);});
test('survey validation rejects missing title and options',()=>{const e=validateSurvey({title:'',questions:[{text:'Pick',type:'single',options:['Only one']}]});assert.ok(e.length>=2);});
test('answer validation checks required and allowed options',()=>{const survey={questions:[{_id:'q1',text:'Choice',type:'single',required:true,options:['A','B']}]};assert.ok(validateAnswers(survey,[]).length);assert.ok(validateAnswers(survey,[{questionId:'q1',value:'C'}]).length);assert.deepEqual(validateAnswers(survey,[{questionId:'q1',value:'A'}]),[]);});
