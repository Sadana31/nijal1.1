'use client';

import Sidebar from '@/components/Sidebar';
import React, { useEffect } from 'react';

const AddShippingBill = () => {
  useEffect(() => {
    const form = document.getElementById('addSbForm');
    const decimalFields = ['exportBillValue', 'billRealizedValue', 'billOutstandingValue'];

    function showError(input, message) {
      let error = input.nextElementSibling;
      if (!error || !error.classList.contains('error-message')) {
        error = document.createElement('div');
        error.className = 'error-message';
        error.style.color = 'red';
        error.style.fontSize = '0.9em';
        input.after(error);
      }
      error.textContent = message;
    }

    function clearError(input) {
      let error = input.nextElementSibling;
      if (error && error.classList.contains('error-message')) {
        error.textContent = '';
      }
    }

    form?.querySelectorAll('input').forEach(input => {
      input.addEventListener('input', () => {
        if (input.maxLength > 0 && input.value.length > input.maxLength) {
          input.value = input.value.slice(0, input.maxLength);
        }

        if (decimalFields.includes(input.id)) {
          let val = input.value;
          const selectionStart = input.selectionStart;
          const selectionEnd = input.selectionEnd;

          val = val.replace(/[^0-9.]/g, '');
          const firstDecimalIndex = val.indexOf('.');
          if (firstDecimalIndex !== -1) {
            val = val.slice(0, firstDecimalIndex + 1) + val.slice(firstDecimalIndex + 1).replace(/\./g, '');
          }

          const parts = val.split('.');
          parts[0] = parts[0].slice(0, 18);
          if (parts.length > 1) {
            parts[1] = parts[1].slice(0, 2);
            val = parts[0] + '.' + parts[1];
          } else {
            val = parts[0];
          }

          input.value = val;
          input.setSelectionRange(selectionStart, selectionEnd);
        }
      });

      input.addEventListener('blur', () => {
        validateField(input);
      });
    });

    function validateField(input) {
      clearError(input);
      const val = input.value.trim();

      if (input.hasAttribute('required') && val === '') {
        showError(input, 'This field is required');
        return false;
      }

      if (input.maxLength > 0 && val.length > input.maxLength) {
        showError(input, `Maximum length is ${input.maxLength}`);
        return false;
      }

      switch (input.id) {
        case 'shippingBill':
          if (!/^\d{1,10}$/.test(val)) {
            showError(input, 'Enter a valid number (up to 10 digits)');
            return false;
          }
          break;
        case 'sbDate':
        case 'invoiceDate':
        case 'blDate':
          if (val && isNaN(new Date(val).getTime())) {
            showError(input, 'Enter a valid date');
            return false;
          }
          break;
        case 'exportBillValue':
        case 'billRealizedValue':
        case 'billOutstandingValue':
          if (!/^\d{1,18}(\.\d{1,2})?$/.test(val)) {
            showError(input, 'Enter up to 18 digits before decimal and 2 after');
            return false;
          }
          break;
      }

      return true;
    }

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll('input').forEach(input => {
        if (!validateField(input)) valid = false;
      });

      if (valid) {
  const formData = new FormData(form);
  const data = {};

  form.querySelectorAll('input').forEach(input => {
    data[input.id] = input.value.trim();
  });

  fetch('/app/api/addSB', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})
.then(res => {
  if (res.ok) {
    // Redirect after successful form submission
    window.location.href = '/';
  } else {
    return res.json().then(d => {
      throw new Error(d.message || 'Something went wrong');
    });
  }
})
.catch(err => {
  alert('Error: ' + err.message);
});
}else {
  alert('Please fix errors before submitting.');
}
    });
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="container mt-4 flex-grow-1">
        <h2 className="mb-4 fw-bold text-dark-blue fs-2">Add Shipping Bill</h2>

        <form id="addSbForm">
          <fieldset className="border border-dark rounded p-4 mb-4">
            <legend className="w-auto px-2 fw-bold text-dark-blue fs-5 mb-4">Shipping Bill Basic Details</legend>
            <div className="row">
              <div className="col-md-3 mb-3">
                <label className="form-label fw-semibold text-black">Shipping Bill*</label>
                <input className="form-control" id="shippingBill" required maxLength={10} />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label fw-semibold text-black">Form No*</label>
                <input className="form-control" id="formNo" required />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label fw-semibold text-black">Shipping Bill Date*</label>
                <input type="date" className="form-control" id="sbDate" required />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label fw-semibold text-black">Port Code*</label>
                <input className="form-control" id="portCode" required />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label fw-semibold text-black">Export Agency*</label>
                <input className="form-control" id="exportAgency" required />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label fw-semibold text-black">AD Code*</label>
                <input className="form-control" id="adCode" required />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label fw-semibold text-black">Bank Name*</label>
                <input className="form-control" id="bankName" required />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label fw-semibold text-black">IE Code*</label>
                <input className="form-control" id="ieCode" required />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label fw-semibold text-black">Invoice No*</label>
                <input className="form-control" id="invoiceNo" required />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label fw-semibold text-black">Invoice Date*</label>
                <input type="date" className="form-control" id="invoiceDate" required />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label fw-semibold text-black">FOB Currency*</label>
                <input className="form-control" id="fobCurrency" required />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label fw-semibold text-black">Export Bill Value*</label>
                <input className="form-control" id="exportBillValue" required />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label fw-semibold text-black">Bill Realized Value*</label>
                <input className="form-control" id="billRealizedValue" required />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label fw-semibold text-black">Bill Outstanding Value*</label>
                <input className="form-control" id="billOutstandingValue" required />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label fw-semibold text-black">BL Date*</label>
                <input className="form-control" id="blDate" required type="date" />
              </div>
            </div>
          </fieldset>

          <fieldset className="border border-dark rounded p-4 mb-4">
            <legend className="w-auto px-2 fw-bold text-dark-blue fs-5 mb-4">Other Details</legend>
            <div className="row">
              {['buyerName','buyerAddress','buyerCountryCode','consigneeName','consigneeCountryCode','originOfGoods','portOfDestination','tenorAsPerInvoice','commodityDescription','shippingCompanyName','blAwbNo','vesselName','commercialInvoice','tradeTerms'].map(id => (
                <div className="col-md-3 mb-3" key={id}>
                  <label className="form-label fw-semibold text-black">{id.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
                  <input className="form-control" id={id} />
                </div>
              ))}
            </div>
          </fieldset>

          <div className="mt-4">
            <button type="submit" className="btn btn-primary mb-5">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddShippingBill;