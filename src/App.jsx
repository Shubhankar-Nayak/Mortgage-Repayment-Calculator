import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import calci from './assets/images/icon-calculator.svg';
import empty from './assets/images/illustration-empty.svg';

// Helper function to format numbers with commas
const formatNumberWithCommas = (value) => {
  if (!value) return '';
  const num = value.toString().replace(/,/g, ''); // Remove existing commas
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas
};

function App() {
  const [selectedMortgageType, setSelectedMortgageType] = useState('');
  const [results, setResults] = useState(null);
  const [mortgageTypeError, setMortgageTypeError] = useState(false); // For mortgage type error

  const validationSchema = Yup.object({
    amount: Yup.string()
      .required('This field is required')
      .test(
        'isValidNumber',
        'Please enter a valid number',
        (value) => !isNaN(Number(value?.replace(/,/g, ''))) // Ignore commas for validation
      ),
    term: Yup.string()
      .required('This field is required')
      .test(
        'isValidNumber',
        'Please enter a valid number',
        (value) => !isNaN(Number(value?.replace(/,/g, '')))
      ),
    interest: Yup.number().required('This field is required'),
    mortgageType: Yup.string().required('This field is required'),
  });

  const formik = useFormik({
    initialValues: {
      amount: '',
      term: '',
      interest: '',
    },
    validationSchema,
    onSubmit: (values) => {
      if (selectedMortgageType === '') {
        setMortgageTypeError(true);
        return;
      }

      const principal = parseFloat(values.amount.replace(/,/g, '')); // Remove commas
      const years = parseInt(values.term.replace(/,/g, ''), 10);
      const rate = parseFloat(values.interest) / 100;

      let monthlyRepayment = 0;

      if (selectedMortgageType === 'repayment') {
        const monthlyRate = rate / 12;
        const months = years * 12;
        monthlyRepayment =
          (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
      } else if (selectedMortgageType === 'interestOnly') {
        monthlyRepayment = (principal * rate) / 12;
      }

      setResults({
        monthlyRepayment: monthlyRepayment.toFixed(2),
        totalRepayment: (monthlyRepayment * 12 * years).toFixed(2),
      });
    },
  });

  return (
    <div className='w-[100%] h-screen bg-Slate100 flex justify-center items-center font-PlusJarkartaSans'>
      <div className='w-[100%] laptop:w-[70vw] laptop:h-[600px] flex flex-col laptop:flex-row justify-center items-center laptop:rounded-3xl laptop:overflow-hidden bg-white'>
        <form className='w-[85%] min-h-[700px] laptop:w-[50%] laptop:min-h-[600px] bg-white py-8 laptop:px-10' onSubmit={formik.handleSubmit}>
          <div className='flex flex-col laptop:flex-row laptop:justify-between laptop:items-center gap-2'>
            <h1 className='text-[25px] text-Slate900 font-bold'>Mortgage Calculator</h1>
            <p className='underline text-Slate900 cursor-pointer' onClick={() => formik.resetForm()}>Clear All</p>
          </div>

          {/* Mortgage Amount */}
          <div className='my-6'>
            <p className='text-Slate700 font-semibold mb-2'>Mortgage Amount</p>
            <div className={`border-2 flex rounded-md overflow-hidden ${formik.touched.amount && formik.errors.amount ? "border-red-500" : "border-Slate900"}`}>
              <div className={`w-[20%] flex justify-center items-center text-center font-semibold ${formik.touched.amount && formik.errors.amount ? "bg-red-500 text-Slate100" : "bg-Slate100 text-Slate700"}`}>£</div>
              <input
                type="text"
                name='amount'
                className='w-[80%] px-3 py-2 text-Slate900 font-bold focus:outline-none'
                onChange={(e) => formik.setFieldValue('amount', formatNumberWithCommas(e.target.value))}
                value={formik.values.amount}
              />
            </div>
            {formik.touched.amount && formik.errors.amount && (
              <p className="text-red-500 text-[14px] font-semibold mt-2">{formik.errors.amount}</p>
            )}
          </div>

          <div className='flex flex-col tablet:flex-row tablet:justify-between'>
            {/* Mortgage Term */}
            <div className='tablet:w-[48%] my-6'>
              <p className='text-Slate700 font-semibold mb-2'>Mortgage Term</p>
              <div className={`border-2 flex rounded-md overflow-hidden ${formik.touched.term && formik.errors.term ? "border-red-500" : "border-Slate900"}`}>
                <input
                  type="text"
                  name='term'
                  className='w-[80%] px-3 py-2 text-Slate900 font-bold focus:outline-none'
                  onChange={(e) => formik.setFieldValue('term', formatNumberWithCommas(e.target.value))}
                  value={formik.values.term}
                />
                <div className={`w-[20%] laptop:w-[30%] flex justify-center items-center text-center font-semibold ${formik.touched.term && formik.errors.term ? "bg-red-500 text-Slate100" : "bg-Slate100 text-Slate700"}`}>years</div>
              </div>
              {formik.touched.term && formik.errors.term && (
                <p className="text-red-500 text-[14px] font-semibold mt-2">{formik.errors.term}</p>
              )}
            </div>

            {/* Interest Rate */}
            <div className='tablet:w-[48%] my-6'>
              <p className='text-Slate700 font-semibold mb-2'>Interest Rate</p>
              <div className={`border-2 flex rounded-md overflow-hidden ${formik.touched.interest && formik.errors.interest ? "border-red-500" : "border-Slate900"}`}>
                <input
                  step=".01"
                  type="number"
                  name='interest'
                  className='w-[80%] px-3 py-2 text-Slate900 font-bold focus:outline-none'
                  onChange={formik.handleChange}
                  value={formik.values.interest}
                />
                <div className={`w-[20%] flex justify-center items-center text-center font-semibold ${formik.touched.interest && formik.errors.interest ? "bg-red-500 text-Slate100" : "bg-Slate100 text-Slate700"}`}>%</div>
              </div>
              {formik.touched.interest && formik.errors.interest && (
                <p className="text-red-500 text-[14px] font-semibold mt-2">{formik.errors.interest}</p>
              )}
            </div>
          </div>

          {/* Mortgage Type */}
          <div className='my-6'>
            <p className='text-Slate700 font-semibold mb-2'>Mortgage Type</p>
            <div
              className={`px-3 py-2 border-2 rounded-md mb-3 ${selectedMortgageType === 'repayment' ? 'border-Lime' : 'border-Slate900'}`}
              onClick={() => {
                setSelectedMortgageType('repayment');
                formik.setFieldValue('mortgageType', 'repayment');
                setMortgageTypeError(false);
              }}
            >
              <input
                className='me-2 accent-Lime'
                type='radio'
                name='mortgageType'
                value='repayment'
                checked={selectedMortgageType === 'repayment'}
                onChange={() => {
                  setSelectedMortgageType('repayment');
                  formik.setFieldValue('mortgageType', 'repayment');
                }}
              />
              <label className='text-Slate900 font-semibold'>Repayment</label>
            </div>
            <div
              className={`px-3 py-2 border-2 rounded-md ${selectedMortgageType === 'interestOnly' ? 'border-Lime' : 'border-Slate900'}`}
              onClick={() => {
                setSelectedMortgageType('interestOnly');
                formik.setFieldValue('mortgageType', 'interestOnly');
                setMortgageTypeError(false);
              }}
            >
              <input
                className='me-2 accent-Lime'
                type='radio'
                name='mortgageType'
                value='interestOnly'
                checked={selectedMortgageType === 'interestOnly'}
                onChange={() => {
                  setSelectedMortgageType('interestOnly');
                  formik.setFieldValue('mortgageType', 'interestOnly');
                }}
              />
              <label className='text-Slate900 font-semibold'>Interest Only</label>
            </div>
            {mortgageTypeError && (
              <p className="text-red-500 text-[14px] font-semibold mt-2">This field is required</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            className='w-[100%] flex justify-center items-center gap-2 bg-Lime px-5 py-3 font-semibold rounded-full'
          >
            <img className='size-5' src={calci} alt="" /> Calculate Repayments
          </button>
        </form>

        {/* Results Section */}
        <div className='w-[100%] laptop:w-[50%] laptop:h-full laptop:flex laptop:flex-col laptop:justify-center laptop:items-center laptop:px-10 laptop:rounded-bl-[100px] bg-Slate900'>
          {results ? (
            <div className='px-5 py-10'>
            <h1 className='text-white text-[24px] my-3 font-semibold'>Your results</h1>
            <p className='text-Slate300'>Your results are shown below based on the information you provided. To adjust the results, edit the form and click “calculate repayments” again.</p>
            <div className='bg-slate-950 border-t-4 border-t-Lime rounded-lg px-5 mt-8'>
              <div className='py-5 border-b-[1px]'>
                <p className='text-Slate300 mb-2'>Your monthly repayments</p>
                <p className='text-[35px] laptop:text-[40px] text-Lime font-bold'>£{formatNumberWithCommas(results.monthlyRepayment)}</p>
              </div>
              <div className='py-5'>
                <p className='text-Slate300 mb-2'>Total you'll repay over the term</p>
                <p className='text-[20px] text-white font-bold'>£{formatNumberWithCommas(results.totalRepayment)}</p>
              </div>
            </div>
          </div>
          ) : (
            <div className='flex flex-col justify-center items-center py-10'>
              <img className='mb-5' src={empty} alt='Results' />
              <h1 className='text-white text-[24px] my-3 font-semibold'>Results shown here</h1>
              <p className='text-Slate300 text-center'>
                Complete the form and click “calculate repayments” to see what your monthly
                repayments would be.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
