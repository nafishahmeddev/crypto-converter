// Import necessary dependencies and components
import CurrencyServices from "@app/services/CurrencyServices";
import { useState } from "react";
import { useEffect } from "react";
import { useCallback } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Icon } from '@iconify/react';
import { Toaster, default as toast } from "react-hot-toast";

// Helper function to format the amount with currency
const formatAmount = (amount, currency) => {
  try {
    return new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3, currency: currency, style: "currency" }).format(
      amount,
    );
  } catch (err) {
    // Fallback to formatting without currency if an error occurs
    return new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(
      amount,
    ) + " " + currency;
  }
}

// Main component function
function App() {
  // State variables
  const [currencies, setCurrencies] = useState([]);
  const [supported, setSupported] = useState([]);
  const [result, setResult] = useState();
  const [isLoading, setIsLoading] = useState(false);

  // Form submission function
  const onSubmit = (values) => {
    return CurrencyServices.convert(values).then(res => {
      setResult(res.result);
    }).catch(err => {
      setResult(undefined);
      toast.error(err.message);
    });
  }

  // Formik hook for form handling and validation
  const formik = useFormik({
    initialValues: {
      id: "",
      currency: "USD",
      amount: ""
    },
    validationSchema: yup.object({
      id: yup.string("Source currency is required").required("Source currency is required"),
      currency: yup.string("Destination currency is required").required("Destination currency is required"),
      amount: yup.number().positive("Please enter a positive amount").required("Amount is required"),
    }),
    onSubmit: onSubmit
  });

  // Destructuring values from formik for ease of use
  const { values, errors, touched, setFieldValue, handleChange, handleSubmit, isSubmitting } = formik;

  // Function to fetch the latest currencies from the API
  const fetchLatestCurrencies = useCallback(() => {
    setIsLoading(true);
    CurrencyServices.latest().then(res => {
      setCurrencies(res.result.currencies ?? []);
      setFieldValue("id", res.result.currencies[0].id);
      setSupported(res.result.currencies[0].currencies)
    }).catch(err => {
      toast.error(err.message);
    }).finally(() => {
      setIsLoading(false)
    });
  }, [setFieldValue]);

  // Event handler for changes in the selected source currency
  const handleIdChange = (e) => {
    handleChange(e);
    const supportedList = currencies.find(c => c.id == e.target.value)?.currencies ?? [];
    setSupported(supportedList);
    if (!supportedList.includes(values.currency)) {
      setFieldValue("currency", "USD");
    }
  }

  // useEffect hook to fetch latest currencies when the component mounts
  useEffect(() => {
    fetchLatestCurrencies();
  }, [fetchLatestCurrencies])

  // JSX for the component
  return (
    <form onSubmit={handleSubmit} onChange={() => setResult(undefined)}
      style={{
        backgroundColor: "#00603b",
        opacity: 1,
        backgroundImage: "repeating-radial-gradient( circle at 0 0, transparent 0, #00603b 40px ), repeating-linear-gradient( #008a4555, #008a45 )"
      }}>
      <div className="w-screen h-screen flex items-center justify-center ">

        <div className="max-w-sm m-auto p-5 bg-white rounded-xl flex-1 flex flex-col gap-4 relative overflow-hidden">

          <h3 className="text-center text-xl mb-4 font-bold">Currency Converter</h3>

          {/* Input for entering the amount */}
          <label className="w-full flex flex-col gap-1">
            <span>Enter Amount</span>
            <input type="number" className="input input-primary input-bordered w-full p-2 border-2  rounded-lg"  {...formik.getFieldProps("amount")} />
            {touched.amount && errors.amount && <div className="label"><span className="label-text-alt text-rose-600">{errors.amount}</span></div>}
          </label>

          {/* Selectors for source and destination currencies */}
          <div className="flex gap-3">
            <label className="flex-1 flex flex-col gap-1">
              <span>Source</span>
              <select className="w-full  p-2 border-2  rounded-lg" name="id" {...formik.getFieldProps("id")} onChange={handleIdChange}>
                {currencies.map(currency => <option key={currency.id} value={currency.id}>{currency.name}</option>)}
              </select>
              {touched.id && errors.id && <div className="label"><span className="label-text-alt text-rose-600">{errors.id}</span></div>}
            </label>

            <label className="flex-1 flex flex-col gap-1">
              <span>Destination</span>
              <select className="w-full p-2 border-2 rounded-lg" name="currency" {...formik.getFieldProps("currency")}>
                {supported && supported.map(currency => <option key={currency} value={currency}>{currency}</option>)}
              </select>
              {touched.currency && errors.currency && <div className="label"><span className="label-text-alt text-rose-600">{errors.currency}</span></div>}
            </label>
          </div>

          {/* Display result if available */}

          {
            result && !isSubmitting &&
            <div className={`text-center  rounded-lg  bg-gray-100 h-24 flex flex-col justify-center items-center transition-all`}>
              <p className="text-4xl font-bold">{formatAmount(result?.price, values?.currency)}</p>
              <p className="text-sm mt-1">Exchange Rate : {formatAmount(result?.rate, values?.currency)}</p>
            </div>
          }


          {/* Submit button with loading indicator */}
          <button className="p-2 bg-emerald-500 w-full  text-white mt-4 disabled:bg-emerald-200 rounded-xl text-center" type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Icon icon="eos-icons:three-dots-loading" className="inline" fontSize={22} /> : "Convert"}
          </button>



          {isLoading && (
            <div className="absolute top-0 left-0 h-full w-full bg-black/30 backdrop-blur-xs flex items-center justify-center">
              <Icon icon="eos-icons:three-dots-loading" className="inline" fontSize={50} />
            </div>
          )}
        </div>
      </div>
      <Toaster />
    </form>
  )
}

export default App;
