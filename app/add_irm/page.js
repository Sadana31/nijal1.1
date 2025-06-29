'use client';

import Sidebar from '@/components/Sidebar';
import React, { useEffect } from 'react';

export default function AddIRM() {
  useEffect(() => {
    const form = document.getElementById('addIrmForm');

    const rules = {
      ADCode: { required: true, maxLength: 8 },
      BankName: { required: true, maxLength: 20 },
      IECode: { required: true, maxLength: 10 },
      RemittanceRefNumber: { required: true },
      RemittanceDate: { required: true, isDate: true },
      PurposeCode: { required: true, maxLength: 5 },
      RemittanceCurrency: { required: true, maxLength: 3 },
      RemittanceAmount: { required: true, isNumber: true, maxDigitsBeforeDecimal: 18, maxDecimals: 2 },
      UtilizedAmount: { required: true, isNumber: true, maxDigitsBeforeDecimal: 18, maxDecimals: 2 },
      OutstandingAmount: { required: true, isNumber: true, maxDigitsBeforeDecimal: 18, maxDecimals: 2 },
      RemitterName: { required: true, maxLength: 30 },
      RemitterAddress: { required: false, maxLength: 50 },
      RemitterCountryCode: { required: false, maxLength: 2 },
      RemitterBank: { required: false, maxLength: 20 },
      OtherBankRefNumber: { required: false, maxLength: 20 },
      Status: { required: false, maxLength: 20 },
      RemittanceType: { required: false, maxLength: 10 },
    };

    function showError(field, message) {
      const errDiv = document.getElementById(field + '-error');
      if (errDiv) {
        errDiv.textContent = message;
        errDiv.style.color = 'red';
        errDiv.style.fontSize = '0.9em';
      }
    }

    function clearError(field) {
      const errDiv = document.getElementById(field + '-error');
      if (errDiv) errDiv.textContent = '';
    }

    function validateField(field) {
      const input = document.getElementById(field);
      if (!input) return true;

      const value = input.value.trim();
      const rule = rules[field];

      if (rule.required && !value) {
        showError(field, 'This field is required');
        return false;
      }

      if (!value) {
        clearError(field);
        return true;
      }

      if (rule.maxLength && value.length > rule.maxLength) {
        showError(field, `Max ${rule.maxLength} characters allowed`);
        return false;
      }

      if (rule.isDate) {
        const dateVal = new Date(value);
        if (isNaN(dateVal.getTime())) {
          showError(field, 'Invalid date');
          return false;
        }
      }

      if (rule.isNumber) {
        const regex = new RegExp(`^\\d{1,${rule.maxDigitsBeforeDecimal}}(\\.\\d{0,${rule.maxDecimals}})?$`);
        if (!regex.test(value)) {
          showError(
            field,
            `Invalid number. Max ${rule.maxDigitsBeforeDecimal} digits before decimal and ${rule.maxDecimals} after.`
          );
          return false;
        }
      }

      clearError(field);
      return true;
    }

    function restrictDecimalInput(e) {
      const input = e.target;
      const rule = rules[input.id];
      if (!rule || !rule.isNumber) return;

      let val = input.value.replace(/[^0-9.]/g, '');
      const parts = val.split('.');
      const intPart = parts[0].slice(0, rule.maxDigitsBeforeDecimal);
      const decPart = (parts[1] || '').slice(0, rule.maxDecimals);
      input.value = decPart ? `${intPart}.${decPart}` : intPart;
    }

    function restrictCurrencyInput(e) {
      const input = e.target;
      input.value = input.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3);
    }


    Object.keys(rules).forEach((field) => {
      const input = document.getElementById(field);
      if (input) {
        // on blur, validate
        input.addEventListener('blur', () => validateField(field));
        // if numeric, restrict typing and pasting
        if (rules[field].isNumber) {
          input.addEventListener('input', restrictDecimalInput);
          input.addEventListener('paste', restrictDecimalInput);
        }
      }
    });

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      Object.keys(rules).forEach((field) => {
        if (!validateField(field)) valid = false;
      });
      if (!valid) {
        alert('Fix errors before submit');
        return;
      }

      const data = {};
      new FormData(form).forEach((v, k) => {
        data[k] = v.trim();
      });

      fetch('/api/addIRM', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
})
  .then(async (res) => {
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('Backend error:', errorData);
      alert(errorData.message || 'Something went wrong');
      return;
    }
    window.location.href = '/irm';
  })
  .catch((err) => {
    console.error('Network or JS error:', err);
    alert('Error: ' + err.message);
  });

    });
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="container mt-4 flex-grow-1">
        <h2 className="fs-2 fw-bold text-[#254852] mb-4">Add IRM Record</h2>
        <form id="addIrmForm">
          <fieldset className="border rounded p-4 mb-4">
            <legend className="px-2 fw-bold">IRM Main Details</legend>
            <div className="row">
              {[
                { id: 'SrNo', label: 'Sr. No.', type: 'number', required: true },
                { id: 'ADCode', label: 'AD Code', required: true },
                { id: 'BankName', label: 'Bank Name', required: true },
                { id: 'IECode', label: 'IE Code', required: true },
                { id: 'RemittanceRefNumber', label: 'Remittance Ref No', required: true },
                { id: 'RemittanceDate', label: 'Remittance Date', type: 'date', required: true },
                { id: 'PurposeCode', label: 'Purpose Code', required: true },
                { id: 'RemittanceCurrency', label: 'Currency', required: true },
                {
                  id: 'RemittanceAmount',
                  label: 'Amount',
                  required: true,
                  // enforce UI-level block:
                  extra: { type: 'text', maxLength: 21 },
                },
                {
                  id: 'UtilizedAmount',
                  label: 'Utilized Amount',
                  required: true,
                  extra: { type: 'text', maxLength: 21 },
                },
                {
                  id: 'OutstandingAmount',
                  label: 'Outstanding Amount',
                  required: true,
                  extra: { type: 'text', maxLength: 21 },
                },
                { id: 'RemitterName', label: 'Remitter Name', required: true },
              ].map((f) => (
                <div className="col-md-3 mb-3" key={f.id}>
                  <label className="form-label fw-semibold">
                    {f.label}
                    {f.required && '*'}
                  </label>
                  <input
                    id={f.id}
                    name={f.id}
                    type={f.extra?.type || f.type || 'text'}
                    maxLength={f.extra?.maxLength}
                    className="form-control"
                    required={!!f.required}
                  />
                  <div id={f.id + '-error'} className="error-message"></div>
                </div>
              ))}
            </div>
          </fieldset>

          <fieldset className="border rounded p-4 mb-4">
            <legend className="px-2 fw-bold">Other Details</legend>
            <div className="row">
              {[
                'RemitterAddress',
                'RemitterCountryCode',
                'RemitterBank',
                'OtherBankRefNumber',
                'Status',
                'RemittanceType',
              ].map((id) => (
                <div className="col-md-4 mb-3" key={id}>
                  <label className="form-label fw-semibold">
                    {id.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <input id={id} name={id} className="form-control" />
                  <div id={id + '-error'} className="error-message"></div>
                </div>
              ))}
            </div>
          </fieldset>

          <div className="mt-4">
            <button type="submit" className="btn btn-primary">Submit IRM</button>
          </div>
        </form>
      </div>
    </div>
  );
}
