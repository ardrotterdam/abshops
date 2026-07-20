(function () {
    'use strict';

    function currentLang() {
        return window.ABshopsI18n ? window.ABshopsI18n.getLang() : 'nl';
    }

    function thankYouUrl() {
        if (window.ABshopsI18n && typeof window.ABshopsI18n.thankYouUrl === 'function') {
            return window.ABshopsI18n.thankYouUrl(currentLang());
        }
        return 'https://abshops.nl/' + currentLang() + '/bedankt';
    }

    function syncFormRedirects(root) {
        var url = thankYouUrl();
        root.querySelectorAll('input[name="_next"], input[name="redirect"]').forEach(function (input) {
            input.value = url;
        });
    }

    function stepLabels() {
        return window.ABshopsI18n ? window.ABshopsI18n.leadSteps(currentLang()) : ['Contact', 'Organisatie', 'Project', 'Afronden'];
    }

    function validationHint() {
        return window.ABshopsI18n
            ? window.ABshopsI18n.leadString(currentLang(), 'validationHint')
            : 'Controleer de gemarkeerde velden.';
    }

    function syncProgressAria(form) {
        var pg = form.querySelector('.lead-form-progress');
        if (!pg || !window.ABshopsI18n) return;
        pg.setAttribute('aria-label', window.ABshopsI18n.leadString(currentLang(), 'progressAria'));
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

    function validateAllSteps(form, steps) {
        for (var i = 0; i < steps.length; i++) {
            if (!validateStep(steps[i])) return i;
        }
        return -1;
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
                if (status) status.textContent = validationHint();
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
            var invalidAt = validateAllSteps(form, steps);
            if (invalidAt !== -1) {
                e.preventDefault();
                index = invalidAt;
                showStep(form, index);
                if (status) status.textContent = validationHint();
                return;
            }
        });
    }

    function renderProgressShell(form) {
        var track = form.querySelector('.lead-form-progress-track');
        var labelsRow = form.querySelector('.lead-form-progress-labels');
        if (!track || !labelsRow) return;
        track.innerHTML = '';
        labelsRow.innerHTML = '';
        stepLabels().forEach(function (label, i) {
            var seg = document.createElement('div');
            seg.className = 'lead-form-progress-segment';
            seg.setAttribute('data-progress-index', String(i));
            track.appendChild(seg);
            var sp = document.createElement('span');
            sp.textContent = label;
            labelsRow.appendChild(sp);
        });
        syncProgressAria(form);
    }

    function refreshLeadFormsI18n() {
        document.querySelectorAll('form[data-lead-form]').forEach(function (form) {
            var idx = parseInt(form.getAttribute('data-current-step'), 10);
            if (isNaN(idx)) idx = 0;
            syncFormRedirects(form);
            renderProgressShell(form);
            updateProgress(form, idx);
        });
        document.querySelectorAll('form.contact-form').forEach(function (form) {
            syncFormRedirects(form);
        });
    }

    document.addEventListener('abshops:i18n-applied', refreshLeadFormsI18n);

    document.querySelectorAll('form[data-lead-form]').forEach(function (form) {
        syncFormRedirects(form);
        renderProgressShell(form);
        initLeadForm(form);
    });
    document.querySelectorAll('form.contact-form').forEach(function (form) {
        syncFormRedirects(form);
    });
})();
