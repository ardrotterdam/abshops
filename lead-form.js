(function () {
    'use strict';

    var SERVICE_LABELS = {
        websites: 'Premium websites',
        webshops: 'Webshops & e-commerce',
        ai: 'AI-oplossingen'
    };

    var STEPS = ['Contact', 'Organisatie', 'Project', 'Afronden'];

    function getServiceLabel(service) {
        return SERVICE_LABELS[service] || 'ABshops aanvraag';
    }

    function clearErrors(stepEl) {
        stepEl.querySelectorAll('.lead-form-field.has-error').forEach(function (field) {
            field.classList.remove('has-error');
        });
        stepEl.querySelectorAll('.lead-form-radio-group.has-error').forEach(function (field) {
            field.classList.remove('has-error');
        });
    }

    function markInvalid(fieldWrap) {
        if (fieldWrap) fieldWrap.classList.add('has-error');
    }

    function validateStep(stepEl) {
        clearErrors(stepEl);
        var ok = true;
        var firstInvalid = null;
        var seenRadioName = Object.create(null);

        stepEl.querySelectorAll('[required]').forEach(function (input) {
            var wrap = input.closest('.lead-form-field');
            if (input.type === 'radio') {
                if (seenRadioName[input.name]) return;
                seenRadioName[input.name] = true;
                var group = stepEl.querySelectorAll('input[type="radio"][name="' + input.name.replace(/"/g, '\\"') + '"]');
                var checked = Array.prototype.some.call(group, function (r) {
                    return r.checked;
                });
                if (!checked) {
                    ok = false;
                    var rg = stepEl.querySelector('.lead-form-radio-group[data-radio-group="' + input.name + '"]');
                    if (rg) rg.classList.add('has-error');
                    if (!firstInvalid) firstInvalid = rg || stepEl.querySelector('input[type="radio"][name="' + input.name + '"]');
                }
                return;
            }
            if (input.type === 'checkbox') {
                if (input.required && !input.checked) {
                    ok = false;
                    markInvalid(wrap);
                    if (!firstInvalid) firstInvalid = wrap || input;
                }
                return;
            }
            var val = (input.value || '').trim();
            if (!val) {
                ok = false;
                markInvalid(wrap);
                if (!firstInvalid) firstInvalid = input;
                return;
            }
            if (input.type === 'email' && val.indexOf('@') === -1) {
                ok = false;
                markInvalid(wrap);
                if (!firstInvalid) firstInvalid = input;
            }
        });

        var goalChecked = stepEl.querySelectorAll('input[name="goals[]"]:checked');
        if (stepEl.querySelector('input[name="goals[]"]') && goalChecked.length === 0) {
            ok = false;
            var goalsEl = stepEl.querySelector('[data-goals-group]');
            if (goalsEl) markInvalid(goalsEl);
            if (!firstInvalid) firstInvalid = goalsEl;
        }

        if (firstInvalid) {
            var toFocus = firstInvalid;
            if (firstInvalid.querySelector) {
                var inner = firstInvalid.querySelector('input:not([type="hidden"]), select, textarea');
                if (inner) toFocus = inner;
            }
            try {
                toFocus.focus();
            } catch (ignore) { /* empty */ }
        }

        return ok;
    }

    function collectData(form) {
        var data = {
            service: form.getAttribute('data-service') || '',
            serviceLabel: getServiceLabel(form.getAttribute('data-service') || ''),
            name: (form.querySelector('[name="name"]') || {}).value || '',
            company: (form.querySelector('[name="company"]') || {}).value || '',
            email: (form.querySelector('[name="email"]') || {}).value || '',
            phone: (form.querySelector('[name="phone"]') || {}).value || '',
            businessType: (form.querySelector('[name="business_type"]') || {}).value || '',
            existingSite: '',
            budget: (form.querySelector('[name="budget"]') || {}).value || '',
            timeline: (form.querySelector('[name="timeline"]') || {}).value || '',
            goals: [],
            notes: (form.querySelector('[name="notes"]') || {}).value || ''
        };

        var siteRadio = form.querySelector('input[name="existing_website"]:checked');
        if (siteRadio) data.existingSite = siteRadio.value;

        form.querySelectorAll('input[name="goals[]"]:checked').forEach(function (cb) {
            var label = form.querySelector('label[for="' + cb.id + '"]');
            data.goals.push(label ? label.textContent.trim() : cb.value);
        });

        return data;
    }

    function buildSummaryText(data) {
        var lines = [
            'Aanvraag — ' + data.serviceLabel,
            '---',
            'Naam: ' + data.name,
            'Bedrijf: ' + data.company,
            'E-mail: ' + data.email,
            'Telefoon: ' + data.phone,
            'Type organisatie: ' + data.businessType,
            'Bestaande website: ' + (data.existingSite === 'yes' ? 'Ja' : data.existingSite === 'no' ? 'Nee' : '—'),
            'Budget: ' + data.budget,
            'Timeline: ' + data.timeline,
            'Doelen: ' + (data.goals.length ? data.goals.join(', ') : '—'),
            'Extra opmerkingen:',
            data.notes.trim() || '—'
        ];
        return lines.join('\n');
    }

    function buildMailtoHref(data) {
        var subject = encodeURIComponent(
            'Aanvraag ' + data.serviceLabel + ' — ' + (data.company || data.name || 'ABshops')
        );
        var body = encodeURIComponent(buildSummaryText(data));
        return 'mailto:info@abshops.nl?subject=' + subject + '&body=' + body;
    }

    function updateProgress(form, index) {
        var segments = form.querySelectorAll('.lead-form-progress-segment');
        var labels = form.querySelectorAll('.lead-form-progress-labels span');
        segments.forEach(function (seg, i) {
            seg.classList.toggle('is-complete', i < index);
            seg.classList.toggle('is-current', i === index);
        });
        labels.forEach(function (lbl, i) {
            lbl.classList.toggle('is-active', i === index);
            if (i === index) lbl.setAttribute('aria-current', 'step');
            else lbl.removeAttribute('aria-current');
        });
    }

    function showStep(form, index) {
        var steps = form.querySelectorAll('.lead-form-step');
        var status = form.querySelector('.lead-form-status');
        if (status) status.textContent = '';

        steps.forEach(function (step, i) {
            step.classList.remove('is-active', 'is-exit');
            if (i === index) step.classList.add('is-active');
        });

        updateProgress(form, index);

        var backBtn = form.querySelector('.btn-lead-back');
        var nextBtn = form.querySelector('.btn-lead-next');
        var submitBtn = form.querySelector('.btn-lead-submit');
        if (backBtn) backBtn.hidden = index === 0;
        if (nextBtn) {
            nextBtn.hidden = index === steps.length - 1;
            nextBtn.disabled = false;
        }
        if (submitBtn) submitBtn.hidden = index !== steps.length - 1;

        form.setAttribute('data-current-step', String(index));
    }

    function initLeadForm(form) {
        var steps = form.querySelectorAll('.lead-form-step');
        if (!steps.length) return;

        var index = 0;
        showStep(form, index);

        var backBtn = form.querySelector('.btn-lead-back');
        var nextBtn = form.querySelector('.btn-lead-next');
        var status = form.querySelector('.lead-form-status');

        function go(delta) {
            var next = index + delta;
            if (next < 0 || next >= steps.length) return;
            if (delta > 0 && !validateStep(steps[index])) {
                if (status) status.textContent = 'Controleer de gemarkeerde velden.';
                return;
            }
            index = next;
            showStep(form, index);
        }

        if (backBtn) {
            backBtn.addEventListener('click', function () {
                go(-1);
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', function () {
                go(1);
            });
        }

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!validateStep(steps[index])) {
                if (status) status.textContent = 'Controleer de gemarkeerde velden.';
                return;
            }

            var data = collectData(form);
            var summary = buildSummaryText(data);
            var successEl = form.querySelector('.lead-form-success');
            var mailLink = form.querySelector('[data-lead-mailto]');
            var copyBtn = form.querySelector('[data-lead-copy]');

            if (mailLink) mailLink.setAttribute('href', buildMailtoHref(data));

            if (copyBtn) {
                copyBtn.onclick = function () {
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard.writeText(summary).then(function () {
                            copyBtn.textContent = 'Gekopieerd';
                            setTimeout(function () {
                                copyBtn.textContent = 'Kopieer tekst';
                            }, 2200);
                        });
                    }
                };
            }

            form.classList.add('is-sent');
            if (successEl) {
                successEl.hidden = false;
                var okTitle = successEl.querySelector('h3');
                if (okTitle) {
                    okTitle.setAttribute('tabindex', '-1');
                    try {
                        okTitle.focus();
                    } catch (ignore) { /* empty */ }
                }
            }
        });
    }

    function renderProgressShell(form) {
        var track = form.querySelector('.lead-form-progress-track');
        var labelsRow = form.querySelector('.lead-form-progress-labels');
        if (!track || !labelsRow) return;
        track.innerHTML = '';
        labelsRow.innerHTML = '';
        STEPS.forEach(function (label, i) {
            var seg = document.createElement('div');
            seg.className = 'lead-form-progress-segment';
            seg.setAttribute('data-progress-index', String(i));
            track.appendChild(seg);
            var sp = document.createElement('span');
            sp.textContent = label;
            labelsRow.appendChild(sp);
        });
    }

    document.querySelectorAll('form[data-lead-form]').forEach(function (form) {
        renderProgressShell(form);
        initLeadForm(form);
    });
})();
