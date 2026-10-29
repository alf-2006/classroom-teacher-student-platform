/**
 * Runs inline before the hero is parsed. It turns the CSS intro on only when
 * the visitor has not asked for reduced motion (or explicitly opted back in),
 * so the first paint is already in its final animated state and no-JS
 * visitors simply keep the static, fully visible page.
 */
export const MOTION_BOOT_SCRIPT = `(function(){try{var d=document.documentElement,s=null;try{s=localStorage.getItem('classroom-motion')}catch(e){}var r=window.matchMedia('(prefers-reduced-motion: reduce)').matches;d.dataset.motion=(s==='off'||(r&&s!=='on'))?'off':'on'}catch(e){}})()`
