// Scholarship application page script
(function(){
  function $(id){ return document.getElementById(id); }

  // Attempt to open a native date picker
  function openDatePicker(inputEl){
    if(!inputEl) return;
    try {
      if(typeof inputEl.showPicker === 'function'){
        inputEl.showPicker();
        return;
      }
    } catch(_){}
    // Fallbacks
    inputEl.focus();
    // Some browsers open the picker on click
    try { inputEl.click(); } catch(_){}
  }

  // Attempt to open a select dropdown programmatically
  function openSelect(selectEl){
    if(!selectEl) return;
    selectEl.focus();
    // Try to simulate user interaction that opens the list
    try {
      const ev = new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window });
      selectEl.dispatchEvent(ev);
      // Some UAs may open on click
      const ev2 = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
      selectEl.dispatchEvent(ev2);
    } catch(_){}

    // Last‑resort: temporarily expand via size attribute
    const originalSize = selectEl.getAttribute('size');
    const originalMultiple = selectEl.hasAttribute('multiple');
    let reverted = false;
    const revert = ()=>{
      if(reverted) return;
      reverted = true;
      if(originalSize === null){ selectEl.removeAttribute('size'); } else { selectEl.setAttribute('size', originalSize); }
      if(!originalMultiple) selectEl.removeAttribute('multiple');
    };
    // Only apply if not already open (heuristic)
    if(!selectEl.hasAttribute('size') || parseInt(selectEl.getAttribute('size')||'1',10) === 1){
      const visibleCount = Math.min(Math.max(selectEl.options.length, 2), 6);
      selectEl.setAttribute('size', String(visibleCount));
      selectEl.setAttribute('multiple', 'multiple');
      // Revert on blur or after a short timeout
      const onBlur = ()=>{ revert(); selectEl.removeEventListener('blur', onBlur); };
      selectEl.addEventListener('blur', onBlur);
      setTimeout(revert, 2500);
    }
  }

  function populateStates(){
    const states = [
      ['AL','Alabama'], ['AK','Alaska'], ['AZ','Arizona'], ['AR','Arkansas'], ['CA','California'],
      ['CO','Colorado'], ['CT','Connecticut'], ['DE','Delaware'], ['FL','Florida'], ['GA','Georgia'],
      ['HI','Hawaii'], ['ID','Idaho'], ['IL','Illinois'], ['IN','Indiana'], ['IA','Iowa'],
      ['KS','Kansas'], ['KY','Kentucky'], ['LA','Louisiana'], ['ME','Maine'], ['MD','Maryland'],
      ['MA','Massachusetts'], ['MI','Michigan'], ['MN','Minnesota'], ['MS','Mississippi'], ['MO','Missouri'],
      ['MT','Montana'], ['NE','Nebraska'], ['NV','Nevada'], ['NH','New Hampshire'], ['NJ','New Jersey'],
      ['NM','New Mexico'], ['NY','New York'], ['NC','North Carolina'], ['ND','North Dakota'], ['OH','Ohio'],
      ['OK','Oklahoma'], ['OR','Oregon'], ['PA','Pennsylvania'], ['RI','Rhode Island'], ['SC','South Carolina'],
      ['SD','South Dakota'], ['TN','Tennessee'], ['TX','Texas'], ['UT','Utah'], ['VT','Vermont'],
      ['VA','Virginia'], ['WA','Washington'], ['WV','West Virginia'], ['WI','Wisconsin'], ['WY','Wyoming']
    ];
    const sel = $('state');
    if(!sel) return;
    sel.innerHTML = '<option value="">Select a state</option>' + states.map(([v,l])=>`<option value="${v}">${l}</option>`).join('');
  }

  function populateMonths(selectId){
    const months = [
      'January','February','March','April','May','June','July','August','September','October','November','December'
    ];
    const sel = $(selectId);
    if(!sel) return;
    sel.innerHTML = '<option value="">Month</option>' + months.map((m,i)=>`<option value="${i+1}">${m}</option>`).join('');
  }

  function populateYears(selectId, spanYears){
    const sel = $(selectId);
    if(!sel) return;
    const now = new Date();
    const start = now.getFullYear();
    const end = start + spanYears;
    const options = ['<option value="">Year</option>'];
    for(let y=start; y<=end; y++) options.push(`<option value="${y}">${y}</option>`);
    sel.innerHTML = options.join('');
  }

  function wordCount(text){
    return (text || '').trim().split(/\s+/).filter(Boolean).length;
  }

  function setupWordCounters(){
    const e1 = $('essay1');
    const e2 = $('essay2');
    const c1 = $('essay1Count');
    const c2 = $('essay2Count');
    function bind(el, counter){
      if(!el || !counter) return;
      const update = ()=>{
        const wc = wordCount(el.value);
        counter.textContent = wc + ' words';
      };
      el.addEventListener('input', update);
      update();
    }
    bind(e1, c1); bind(e2, c2);
  }

  function collectFormData(form){
    const fd = new FormData(form);
    const obj = Object.fromEntries(fd.entries());
    obj.essay1WordCount = wordCount(obj.essay1);
    obj.essay2WordCount = wordCount(obj.essay2);
    obj.submittedAt = new Date().toISOString();
    return obj;
  }

  function validate(form){
    const errors = [];
    const focusables = [];

    function req(id, label){
      const el = $(id);
      if(!el || !el.value || !el.value.trim()){
        errors.push(label + ' is required.');
        if(el) focusables.push(el);
      }
    }
    req('firstName','First Name');
    req('lastName','Last Name');
    req('dob','Date of Birth');
    req('gender','Gender');
    req('address','Address');
    req('city','City');
    req('state','State');
    req('zip','ZIP Code');
    req('email','Email');
    req('phone','Phone');
    req('college','College Name');
    req('degree','Degree');
    req('major','Major');
    req('gpa','GPA');
    req('startMonth','Start Term Month');
    req('startYear','Start Term Year');
    req('gradMonth','Expected Graduation Month');
    req('gradYear','Expected Graduation Year');
    req('essay1','Essay 1');
    req('essay2','Essay 2');

    const email = $('email');
    if(email && email.value && !email.checkValidity()){
      errors.push('Please enter a valid email address.');
      focusables.push(email);
    }
    const phone = $('phone');
    if(phone && phone.value && !phone.checkValidity()){
      errors.push('Please enter a valid phone number.');
      focusables.push(phone);
    }
    const zip = $('zip');
    if(zip && zip.value && !zip.checkValidity()){
      errors.push('Please enter a valid ZIP code (5 digits or ZIP+4).');
      focusables.push(zip);
    }
    const gpa = $('gpa');
    if(gpa && gpa.value){
      const val = parseFloat(gpa.value);
      if(isNaN(val) || val < 0 || val > 4.0){
        errors.push('GPA must be between 0.00 and 4.00.');
        focusables.push(gpa);
      }
    }

    const e1wc = wordCount(($('essay1')||{}).value || '');
    const e2wc = wordCount(($('essay2')||{}).value || '');
    if(e1wc < 200) errors.push('Essay 1 must be at least 200 words (currently ' + e1wc + ').');
    if(e2wc < 200) errors.push('Essay 2 must be at least 200 words (currently ' + e2wc + ').');

    const terms = $('terms');
    const termsError = $('termsError');
    if(terms && !terms.checked){
      errors.push('You must accept the terms and conditions to submit.');
      if(termsError) termsError.textContent = 'Please accept the terms and conditions.';
      focusables.push(terms);
    } else if(termsError){
      termsError.textContent = '';
    }

    if(errors.length){
      alert('Please fix the following before submitting:\n\n- ' + errors.join('\n- '));
      if(form.reportValidity) form.reportValidity();
      const first = focusables[0];
      if(first){ first.scrollIntoView({ behavior: 'smooth', block: 'center' }); first.focus && first.focus(); }
      return false;
    }
    return true;
  }

  function onSubmit(e){
    e.preventDefault();
    const form = e.currentTarget;
    if(!validate(form)) return;
    const data = collectFormData(form);
    // Send emails (simulated by default)
    if(typeof window.sendScholarshipEmails === 'function'){
      window.sendScholarshipEmails(data).finally(()=>{
        // Redirect regardless of simulation result
        const name = encodeURIComponent(data.firstName || '');
        window.location.href = 'scholarship-confirmation.html?name=' + name;
      });
    } else {
      // Fallback redirect
      const name = encodeURIComponent(data.firstName || '');
      window.location.href = 'scholarship-confirmation.html?name=' + name;
    }
  }

  document.addEventListener('DOMContentLoaded', function(){
    populateStates();
    populateMonths('startMonth');
    populateMonths('gradMonth');
    populateYears('startYear', 4); // next 4 years
    populateYears('gradYear', 10); // next 10 years
    setupWordCounters();

    const form = $('scholarshipForm');
    if(form) form.addEventListener('submit', onSubmit);
    const terms = $('terms');
    const termsError = $('termsError');
    if(terms) terms.addEventListener('change', ()=>{ if(termsError) termsError.textContent=''; });

    // Bind trigger buttons for selects and date inputs
    document.addEventListener('click', function(e){
      const btn = e.target.closest && e.target.closest('.trigger-btn[data-action]');
      if(!btn) return;
      const action = btn.getAttribute('data-action');
      const targetId = btn.getAttribute('data-target');
      const target = $(targetId);
      if(action === 'date'){
        openDatePicker(target);
      } else if(action === 'select'){
        openSelect(target);
      }
    });
  });
})();
