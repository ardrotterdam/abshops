/**
 * Mobile navigation overlay (<768px): open/close, scroll lock, Escape.
 */
(function () {
    'use strict';

    var root = document.getElementById('abshops-mobile-nav');
    if (!root) return;

    var trigger = document.querySelector('.mobile-nav-trigger');
    var backdrop = root.querySelector('.mobile-nav-backdrop');
    var closeBtn = root.querySelector('.mobile-nav-close');
    var mq = window.matchMedia('(max-width: 768px)');

    function navigationalAnchors() {
        return Array.prototype.slice.call(root.querySelectorAll('a.mobile-nav-primary-link'));
    }

    function setOpen(open) {
        root.setAttribute('aria-hidden', open ? 'false' : 'true');
        root.classList.toggle('mobile-nav-is-open', open);
        document.documentElement.classList.toggle('mobile-nav-open', open);

        if (trigger) {
            trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
            trigger.classList.toggle('mobile-nav-trigger-is-open', open);
        }

        window.requestAnimationFrame(function () {
            if (open) {
                if (closeBtn) closeBtn.focus();
            } else if (trigger) {
                trigger.focus();
            }
        });
    }

    function openNav() {
        if (!mq.matches) return;
        setOpen(true);
    }

    function closeNav() {
        setOpen(false);
    }

    function onDocumentKeyDown(e) {
        if (!root.classList.contains('mobile-nav-is-open')) return;
        if (e.key === 'Escape') {
            e.preventDefault();
            closeNav();
        }
    }

    navigationalAnchors().forEach(function (a) {
        a.addEventListener('click', closeNav);
    });

    var ctaLink = root.querySelector('a.mobile-nav-cta');
    if (ctaLink) ctaLink.addEventListener('click', closeNav);

    if (backdrop) backdrop.addEventListener('click', closeNav);

    if (closeBtn) closeBtn.addEventListener('click', closeNav);

    if (trigger) {
        trigger.addEventListener('click', function () {
            if (!mq.matches) return;
            var isOpen = root.classList.contains('mobile-nav-is-open');
            if (isOpen) closeNav();
            else openNav();
        });
    }

    document.addEventListener('keydown', onDocumentKeyDown);

    function maybeCloseOnBreakpoint() {
        if (!mq.matches && root.classList.contains('mobile-nav-is-open')) {
            root.classList.remove('mobile-nav-is-open');
            document.documentElement.classList.remove('mobile-nav-open');
            root.setAttribute('aria-hidden', 'true');
            if (trigger) {
                trigger.setAttribute('aria-expanded', 'false');
                trigger.classList.remove('mobile-nav-trigger-is-open');
            }
        }
    }

    if (mq.addEventListener) {
        mq.addEventListener('change', maybeCloseOnBreakpoint);
    } else if (mq.addListener) {
        mq.addListener(maybeCloseOnBreakpoint);
    }
})();
