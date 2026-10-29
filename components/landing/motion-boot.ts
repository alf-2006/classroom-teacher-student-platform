/**
 * Runs inline before the hero is parsed. It turns the CSS intro on only when
 * the visitor has not asked for reduced motion (or explicitly opted back in),
 * so the first paint is already in its final animated state and no-JS
 * visitors simply keep the static, fully visible page.
 *
 * With motion on, the opening curtain (`html[data-intro="play"]`) runs once
 * per browser session, and never for deep links (`#story`, ...) so a shared
 * link lands straight on its section.
 */
export const MOTION_BOOT_SCRIPT = `(function(){try{var d=document.documentElement,s=null;try{s=localStorage.getItem('classroom-motion')}catch(e){}var r=window.matchMedia('(prefers-reduced-motion: reduce)').matches;var m=(s==='off'||(r&&s!=='on'))?'off':'on';d.dataset.motion=m;if(m==='on'&&!window.location.hash){var seen='1';try{seen=sessionStorage.getItem('classroom-intro');sessionStorage.setItem('classroom-intro','1')}catch(e){seen='1'}if(!seen)d.dataset.intro='play'}}catch(e){}})()`
