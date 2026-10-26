import {test} from 'node:test';
import assert from 'node:assert/strict';
import {initialValues,normalizePhone,validateStep,toPayload} from '../src/model.ts';
test('Saudi local, international and Arabic digit phone normalization',()=>{for(const value of ['0512345678','٠٥١٢٣٤٥٦٧٨','۰۵۱۲۳۴۵۶۷۸','+966512345678','00966512345678'])assert.equal(normalizePhone(value),'+966512345678');});
test('optional fields can be empty; invalid phone fails',()=>{assert.deepEqual(validateStep({...initialValues,fullName:'اسم',phoneNumber:'0512345678'},0),{});assert.ok(validateStep({...initialValues,fullName:'اسم',phoneNumber:'123'},0).phoneNumber);});
test('salary rejects missing, non-finite and amounts below 4000 SAR',()=>{
 for(const monthlySalary of ['',' ','0','-1','Infinity','NaN','abc','3999','3999.99','٣٩٩٩','۳۹۹۹'])assert.ok(validateStep({...initialValues,monthlySalary},1).monthlySalary,monthlySalary);
});
test('salary accepts 4000 SAR and above, including Arabic and Persian digits',()=>{
 for(const monthlySalary of ['4000','4000.01','٤٠٠٠','۴۰۰۰','٥٠٠٠'])assert.equal(validateStep({...initialValues,monthlySalary},1).monthlySalary,undefined,monthlySalary);
});
test('final step requires finance and obligations fields and accepts either obligations answer',()=>{
 assert.deepEqual(Object.keys(validateStep(initialValues,1)).sort(),['monthlySalary','salaryPaymentMethod','hasFinancialObligations'].sort());
 const values={...initialValues,monthlySalary:'٥٠٠٠',salaryPaymentMethod:'cash' as const};
 assert.deepEqual(Object.keys(validateStep(values,1)),['hasFinancialObligations']);
 assert.deepEqual(validateStep({...values,hasFinancialObligations:false},1),{});
 assert.deepEqual(Object.keys(validateStep({...values,hasFinancialObligations:true},1)),['currentInstallments']);
 assert.deepEqual(validateStep({...values,hasFinancialObligations:true,currentInstallments:'1500'},1),{});
});
test('financial obligations require a finite positive amount only when selected',()=>{
 for(const currentInstallments of ['',' ','0','٠','-1','Infinity','NaN','abc']){
  assert.ok(validateStep({...initialValues,hasFinancialObligations:true,currentInstallments},1).currentInstallments,currentInstallments);
  assert.equal(validateStep({...initialValues,hasFinancialObligations:false,currentInstallments},1).currentInstallments,undefined,currentInstallments);
 }
 for(const currentInstallments of ['0.01','1500.50','١٥٠٠','۱۵۰۰'])assert.equal(validateStep({...initialValues,hasFinancialObligations:true,currentInstallments},1).currentInstallments,undefined,currentInstallments);
});
test('payload preserves false, optional omission and normalized numbers',()=>{const payload=toPayload({...initialValues,fullName:' اسم ',phoneNumber:'0512345678',monthlySalary:'٥٠٠٠',salaryPaymentMethod:'cash',hasFinancialObligations:false});assert.deepEqual(payload,{fullName:'اسم',phoneNumber:'+966512345678',monthlySalary:5000,salaryPaymentMethod:'cash',hasFinancialObligations:false});});
test('payload includes the normalized obligations amount when selected',()=>{
 const payload=toPayload({...initialValues,monthlySalary:'٤٠٠٠',hasFinancialObligations:true,currentInstallments:'١٥٠٠.٥٠'});
 assert.equal(payload.hasFinancialObligations,true);
 assert.equal(payload.currentInstallments,1500.5);
});
test('payload omits an old obligations amount when no obligations is selected',()=>{
 const payload=toPayload({...initialValues,monthlySalary:'4000',hasFinancialObligations:false,currentInstallments:'1500'});
 assert.equal(payload.hasFinancialObligations,false);
 assert.equal(Object.hasOwn(payload,'currentInstallments'),false);
});
