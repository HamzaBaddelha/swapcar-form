export type PaymentMethod = 'bank_transfer' | 'cash' | 'other';
export interface FormValues { fullName: string; phoneNumber: string; city: string; monthlySalary: string; salaryPaymentMethod: PaymentMethod | ''; hasFinancialObligations: boolean | null; currentInstallments: string }
export interface CampaignApplication { fullName: string; phoneNumber: string; city?: string; monthlySalary: number; salaryPaymentMethod: PaymentMethod; hasFinancialObligations: boolean; currentInstallments?: number }
export const initialValues: FormValues = { fullName:'',phoneNumber:'',city:'',monthlySalary:'',salaryPaymentMethod:'',hasFinancialObligations:null,currentInstallments:'' };
export const MIN_MONTHLY_SALARY = 4000;
export type Errors = Partial<Record<keyof FormValues,string>>;
export function normalizeDigits(value:string):string { return value.replace(/[٠-٩۰-۹]/g, char => String('٠١٢٣٤٥٦٧٨٩'.includes(char) ? '٠١٢٣٤٥٦٧٨٩'.indexOf(char) : '۰۱۲۳۴۵۶۷۸۹'.indexOf(char))); }
export function normalizePhone(value:string):string { const phone=normalizeDigits(value).replace(/[\s()-]/g,''); return /^05\d{8}$/.test(phone) ? '+966'+phone.slice(1) : phone.replace(/^00966/,'+966'); }
export function validateStep(values:FormValues, step:number):Errors {
 const errors:Errors={};
 if(step===0){if(!values.fullName.trim()) errors.fullName='يرجى إدخال الاسم الكامل.'; if(!/^\+9665\d{8}$/.test(normalizePhone(values.phoneNumber))) errors.phoneNumber='أدخل رقم جوال سعودي صحيح، مثل 0512345678.';}
 if(step===1){
  const salary=Number(normalizeDigits(values.monthlySalary));
  if(!values.monthlySalary.trim()||!Number.isFinite(salary)||salary<MIN_MONTHLY_SALARY) errors.monthlySalary='يجب ألا يقل الراتب الشهري عن 4,000 ر.س.';
  if(!values.salaryPaymentMethod) errors.salaryPaymentMethod='يرجى اختيار طريقة استلام الراتب.';
  if(values.hasFinancialObligations===true){
   const amount=Number(normalizeDigits(values.currentInstallments));
   if(!values.currentInstallments.trim()||!Number.isFinite(amount)||amount<=0) errors.currentInstallments='يرجى إدخال مبلغ الالتزامات المالية أكبر من صفر.';
  }
 }
 if(step===1&&values.hasFinancialObligations===null) errors.hasFinancialObligations='يرجى تحديد ما إذا كانت لديك التزامات مالية.';
 return errors;
}
export function toPayload(values:FormValues):CampaignApplication { return { fullName:values.fullName.trim(),phoneNumber:normalizePhone(values.phoneNumber),...(values.city?{city:values.city}:{}),monthlySalary:Number(normalizeDigits(values.monthlySalary)),salaryPaymentMethod:values.salaryPaymentMethod as PaymentMethod,hasFinancialObligations:values.hasFinancialObligations as boolean,...(values.hasFinancialObligations===true?{currentInstallments:Number(normalizeDigits(values.currentInstallments))}:{}) }; }
