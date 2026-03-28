!function(){"use strict";function t(t,e,s,i){var o,r=arguments.length,n=r<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,s,i);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(n=(r<3?o(n):r>3?o(e,s,n):o(e,s))||n);return r>3&&n&&Object.defineProperty(e,s,n),n}"function"==typeof SuppressedError&&SuppressedError;
/**
     * @license
     * Copyright 2019 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */
const e=globalThis,s=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),o=new WeakMap;let r=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(s&&void 0===t){const s=void 0!==e&&1===e.length;s&&(t=o.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&o.set(e,t))}return t}toString(){return this.cssText}};const n=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new r(s,t,i)},a=s?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:l,defineProperty:d,getOwnPropertyDescriptor:c,getOwnPropertyNames:h,getOwnPropertySymbols:u,getPrototypeOf:p}=Object,_=globalThis,m=_.trustedTypes,g=m?m.emptyScript:"",f=_.reactiveElementPolyfillSupport,$=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?g:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},v=(t,e)=>!l(t,e),b={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:v};
/**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */Symbol.metadata??=Symbol("metadata"),_.litPropertyMetadata??=new WeakMap;let A=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=b){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&d(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:o}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const r=i?.call(this);o?.call(this,e),this.requestUpdate(t,r,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty($("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty($("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty($("properties"))){const t=this.properties,e=[...h(t),...u(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,i)=>{if(s)t.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const s of i){const i=document.createElement("style"),o=e.litNonce;void 0!==o&&i.setAttribute("nonce",o),i.textContent=s.cssText,t.appendChild(i)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const o=(void 0!==s.converter?.toAttribute?s.converter:y).toAttribute(e,s.type);this._$Em=t,null==o?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=i;const r=o.fromAttribute(e,t.type);this[i]=r??this._$Ej?.get(i)??r,this._$Em=null}}requestUpdate(t,e,s,i=!1,o){if(void 0!==t){const r=this.constructor;if(!1===i&&(o=this[t]),s??=r.getPropertyOptions(t),!((s.hasChanged??v)(o,e)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:o},r){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==o||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};A.elementStyles=[],A.shadowRootOptions={mode:"open"},A[$("elementProperties")]=new Map,A[$("finalized")]=new Map,f?.({ReactiveElement:A}),(_.reactiveElementVersions??=[]).push("2.1.2");
/**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */
const w=globalThis,x=t=>t,C=w.trustedTypes,S=C?C.createPolicy("lit-html",{createHTML:t=>t}):void 0,E="$lit$",M=`lit$${Math.random().toFixed(9).slice(2)}$`,P="?"+M,k=`<${P}>`,O=document,U=()=>O.createComment(""),T=t=>null===t||"object"!=typeof t&&"function"!=typeof t,R=Array.isArray,N="[ \t\n\f\r]",D=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,H=/-->/g,L=/>/g,I=RegExp(`>|${N}(?:([^\\s"'>=/]+)(${N}*=${N}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),z=/'/g,j=/"/g,B=/^(?:script|style|textarea|title)$/i,V=(t=>(e,...s)=>({_$litType$:t,strings:e,values:s}))(1),W=Symbol.for("lit-noChange"),q=Symbol.for("lit-nothing"),F=new WeakMap,Y=O.createTreeWalker(O,129);function J(t,e){if(!R(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const G=(t,e)=>{const s=t.length-1,i=[];let o,r=2===e?"<svg>":3===e?"<math>":"",n=D;for(let e=0;e<s;e++){const s=t[e];let a,l,d=-1,c=0;for(;c<s.length&&(n.lastIndex=c,l=n.exec(s),null!==l);)c=n.lastIndex,n===D?"!--"===l[1]?n=H:void 0!==l[1]?n=L:void 0!==l[2]?(B.test(l[2])&&(o=RegExp("</"+l[2],"g")),n=I):void 0!==l[3]&&(n=I):n===I?">"===l[0]?(n=o??D,d=-1):void 0===l[1]?d=-2:(d=n.lastIndex-l[2].length,a=l[1],n=void 0===l[3]?I:'"'===l[3]?j:z):n===j||n===z?n=I:n===H||n===L?n=D:(n=I,o=void 0);const h=n===I&&t[e+1].startsWith("/>")?" ":"";r+=n===D?s+k:d>=0?(i.push(a),s.slice(0,d)+E+s.slice(d)+M+h):s+M+(-2===d?e:h)}return[J(t,r+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class K{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let o=0,r=0;const n=t.length-1,a=this.parts,[l,d]=G(t,e);if(this.el=K.createElement(l,s),Y.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=Y.nextNode())&&a.length<n;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(E)){const e=d[r++],s=i.getAttribute(t).split(M),n=/([.?@])?(.*)/.exec(e);a.push({type:1,index:o,name:n[2],strings:s,ctor:"."===n[1]?et:"?"===n[1]?st:"@"===n[1]?it:tt}),i.removeAttribute(t)}else t.startsWith(M)&&(a.push({type:6,index:o}),i.removeAttribute(t));if(B.test(i.tagName)){const t=i.textContent.split(M),e=t.length-1;if(e>0){i.textContent=C?C.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],U()),Y.nextNode(),a.push({type:2,index:++o});i.append(t[e],U())}}}else if(8===i.nodeType)if(i.data===P)a.push({type:2,index:o});else{let t=-1;for(;-1!==(t=i.data.indexOf(M,t+1));)a.push({type:7,index:o}),t+=M.length-1}o++}}static createElement(t,e){const s=O.createElement("template");return s.innerHTML=t,s}}function X(t,e,s=t,i){if(e===W)return e;let o=void 0!==i?s._$Co?.[i]:s._$Cl;const r=T(e)?void 0:e._$litDirective$;return o?.constructor!==r&&(o?._$AO?.(!1),void 0===r?o=void 0:(o=new r(t),o._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=o:s._$Cl=o),void 0!==o&&(e=X(t,o._$AS(t,e.values),o,i)),e}class Z{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??O).importNode(e,!0);Y.currentNode=i;let o=Y.nextNode(),r=0,n=0,a=s[0];for(;void 0!==a;){if(r===a.index){let e;2===a.type?e=new Q(o,o.nextSibling,this,t):1===a.type?e=new a.ctor(o,a.name,a.strings,this,t):6===a.type&&(e=new ot(o,this,t)),this._$AV.push(e),a=s[++n]}r!==a?.index&&(o=Y.nextNode(),r++)}return Y.currentNode=O,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=q,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=X(this,t,e),T(t)?t===q||null==t||""===t?(this._$AH!==q&&this._$AR(),this._$AH=q):t!==this._$AH&&t!==W&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>R(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==q&&T(this._$AH)?this._$AA.nextSibling.data=t:this.T(O.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=K.createElement(J(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new Z(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=F.get(t.strings);return void 0===e&&F.set(t.strings,e=new K(t)),e}k(t){R(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const o of t)i===e.length?e.push(s=new Q(this.O(U()),this.O(U()),this,this.options)):s=e[i],s._$AI(o),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=x(t).nextSibling;x(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,o){this.type=1,this._$AH=q,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=q}_$AI(t,e=this,s,i){const o=this.strings;let r=!1;if(void 0===o)t=X(this,t,e,0),r=!T(t)||t!==this._$AH&&t!==W,r&&(this._$AH=t);else{const i=t;let n,a;for(t=o[0],n=0;n<o.length-1;n++)a=X(this,i[s+n],e,n),a===W&&(a=this._$AH[n]),r||=!T(a)||a!==this._$AH[n],a===q?t=q:t!==q&&(t+=(a??"")+o[n+1]),this._$AH[n]=a}r&&!i&&this.j(t)}j(t){t===q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===q?void 0:t}}class st extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==q)}}class it extends tt{constructor(t,e,s,i,o){super(t,e,s,i,o),this.type=5}_$AI(t,e=this){if((t=X(this,t,e,0)??q)===W)return;const s=this._$AH,i=t===q&&s!==q||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==q&&(s===q||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class ot{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){X(this,t)}}const rt=w.litHtmlPolyfillSupport;rt?.(K,Q),(w.litHtmlVersions??=[]).push("3.3.2");const nt=globalThis;
/**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */class at extends A{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let o=i._$litPart$;if(void 0===o){const t=s?.renderBefore??null;i._$litPart$=o=new Q(e.insertBefore(U(),t),t,void 0,s??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return W}}at._$litElement$=!0,at.finalized=!0,nt.litElementHydrateSupport?.({LitElement:at});const lt=nt.litElementPolyfillSupport;lt?.({LitElement:at}),(nt.litElementVersions??=[]).push("4.2.2");
/**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */
const dt={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:v},ct=(t=dt,e,s)=>{const{kind:i,metadata:o}=s;let r=globalThis.litPropertyMetadata.get(o);if(void 0===r&&globalThis.litPropertyMetadata.set(o,r=new Map),"setter"===i&&((t=Object.create(t)).wrapped=!0),r.set(s.name,t),"accessor"===i){const{name:i}=s;return{set(s){const o=e.get.call(this);e.set.call(this,s),this.requestUpdate(i,o,t,!0,s)},init(e){return void 0!==e&&this.C(i,void 0,t,e),e}}}if("setter"===i){const{name:i}=s;return function(s){const o=this[i];e.call(this,s),this.requestUpdate(i,o,t,!0,s)}}throw Error("Unsupported decorator location: "+i)};function ht(t){return(e,s)=>"object"==typeof s?ct(t,e,s):((t,e,s)=>{const i=e.hasOwnProperty(s);return e.constructor.createProperty(s,t),i?Object.getOwnPropertyDescriptor(e,s):void 0})(t,e,s)}
/**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */function ut(t){return ht({...t,state:!0,attribute:!1})}const pt={de:{loading:"Lade…",no_calls:"Keine Anrufe",load_more:"Mehr laden",loading_more:"Lade…",today:"Heute",yesterday:"Gestern",two_days_ago:"Vorgestern",retry_suffix:" – Erneuter Versuch in 5 Min.",default_title:"Anrufliste",status_answered_inbound:"Eingehender Anruf",status_answered_outbound:"Ausgehender Anruf",status_missed:"Verpasster Anruf",status_not_reached:"Nicht erreichbar",status_voicemail:"Mailbox",status_default:"Anruf",modal_status:"Status",modal_caller:"Anrufer",modal_called:"Angerufen",modal_device:"Endgerät",modal_extension:"Nebenstelle",modal_started:"Beginn",modal_connected:"Verbunden",modal_finished:"Ende",modal_duration:"Dauer",modal_msn:"MSN",modal_trunk:"Trunk",modal_line:"Linie",modal_internal:"Intern",modal_yes:"Ja",modal_no:"Nein",modal_unknown:"–"},en:{loading:"Loading…",no_calls:"No calls",load_more:"Load more",loading_more:"Loading…",today:"Today",yesterday:"Yesterday",two_days_ago:"2 days ago",retry_suffix:" — Retrying in 5 min",default_title:"Call Log",status_answered_inbound:"Incoming call",status_answered_outbound:"Outgoing call",status_missed:"Missed call",status_not_reached:"Not reached",status_voicemail:"Voicemail",status_default:"Call",modal_status:"Status",modal_caller:"Caller",modal_called:"Called",modal_device:"Device",modal_extension:"Extension",modal_started:"Started",modal_connected:"Connected",modal_finished:"Finished",modal_duration:"Duration",modal_msn:"MSN",modal_trunk:"Trunk",modal_line:"Line",modal_internal:"Internal",modal_yes:"Yes",modal_no:"No",modal_unknown:"–"}};function _t(t,e){const s=function(t){return t?.startsWith("de")?"de":"en"}(e);return pt[s]?.[t]??pt.en[t]??t}function mt(t,e,s){return _t("answered"===t?"inbound"===e?"status_answered_inbound":"status_answered_outbound":"missed"===t?"status_missed":"not_reached"===t?"status_not_reached":"voicemail"===t?"status_voicemail":"status_default",s)}function gt(t,e){return"answered"===t?"inbound"===e?{icon:"mdi:phone-incoming",color:"#3092dc"}:{icon:"mdi:phone-outgoing",color:"#8bbf68"}:"missed"===t?{icon:"mdi:phone-missed",color:"#e45f3b"}:"not_reached"===t?{icon:"mdi:phone-off",color:"#e45f3b"}:"voicemail"===t?{icon:"mdi:phone-message",color:"#e45f3b"}:{icon:"mdi:phone-hangup",color:"var(--secondary-text-color, grey)"}}function ft(t){if(!t||t<=0)return"–";const e=Math.floor(t/3600),s=Math.floor(t%3600/60),i=t%60;return`${String(e).padStart(2,"0")}:${String(s).padStart(2,"0")}:${String(i).padStart(2,"0")}`}function $t(t,e){return t?new Date(t).toLocaleString(e,{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit"}):"–"}function yt(t){return`${t.getFullYear()}-${t.getMonth()}-${t.getDate()}`}function vt(t,e,s){const i=yt(e),o=yt(t),r=new Date(e.getFullYear(),e.getMonth(),e.getDate()),n=new Date(t.getFullYear(),t.getMonth(),t.getDate()),a=Math.round((r.getTime()-n.getTime())/864e5);return o===i?_t("today",s):1===a?_t("yesterday",s):2===a?_t("two_days_ago",s):t.toLocaleDateString(s,{weekday:"short",day:"2-digit",month:"2-digit",year:"numeric"})}class bt extends at{constructor(){super(...arguments),this._calls=[],this._nextCursor=null,this._loading=!1,this._loadingMore=!1,this._error=null,this._selectedCall=null,this._failCount=0,this._circuitOpenUntil=0}get _lang(){return this.hass?.language}static{this.CIRCUIT_MAX_FAILURES=3}static{this.CIRCUIT_COOLDOWN_MS=3e5}static getStubConfig(){return{}}setConfig(t){this._config=t}connectedCallback(){super.connectedCallback(),this._startPolling()}disconnectedCallback(){super.disconnectedCallback(),this._stopPolling()}updated(t){t.has("hass")&&this.hass&&0===this._calls.length&&!this._loading&&this._fetchCalls()}_startPolling(){this._stopPolling(),this._pollTimer=setInterval(()=>this._fetchCalls(),6e4)}_stopPolling(){this._pollTimer&&(clearInterval(this._pollTimer),this._pollTimer=void 0)}async _fetchCalls(t){if(!this.hass)return;if(Date.now()<this._circuitOpenUntil)return;const e=Boolean(t);e?this._loadingMore=!0:(this._loading=!0,this._error=null);try{const s=this._config?.limit??20,i=this._config?.msn?Array.isArray(this._config.msn)?this._config.msn:[this._config.msn]:[],o=await this.hass.callWS({type:"phone_logger/calls",limit:s,...t?{cursor:t}:{},...i.length?{msn:i}:{}});this._calls=e?[...this._calls,...o.items??[]]:o.items??[],this._nextCursor=o.next_cursor??null,this._failCount=0}catch(t){this._failCount++;const e=t instanceof Error?t.message:"object"==typeof t&&null!==t&&"message"in t?String(t.message):JSON.stringify(t);this._failCount>=bt.CIRCUIT_MAX_FAILURES?(this._circuitOpenUntil=Date.now()+bt.CIRCUIT_COOLDOWN_MS,this._error=e+_t("retry_suffix",this._lang),this._failCount=0):this._error=e}finally{this._loading=!1,this._loadingMore=!1}}_loadMore(){this._nextCursor&&this._fetchCalls(this._nextCursor)}_groupedCalls(){const t=new Date,e=new Map;for(const t of this._calls){const s=yt(new Date(t.started_at));e.has(s)||e.set(s,[]),e.get(s).push(t)}return Array.from(e.entries()).map(([,e])=>({day:vt(new Date(e[0].started_at),t,this._lang),calls:e}))}render(){if(!this._config)return q;const t=this._groupedCalls(),{title:e}=this._config;return V`
      <ha-card>
        ${""!==e?V`<div class="card-header">${e??_t("default_title",this._lang)}</div>`:q}
        <div class="card-content">
          ${this._loading?V`<div class="status">${_t("loading",this._lang)}</div>`:this._error?V`<div class="status error">${this._error}</div>`:0===t.length?V`<div class="status">${_t("no_calls",this._lang)}</div>`:V`
                    ${t.map(t=>V`
                        <div class="day-header">${t.day}</div>
                        <table>
                          ${t.calls.map(t=>this._renderRow(t))}
                        </table>
                      `)}
                    ${this._nextCursor?V`
                          <div class="load-more">
                            <button @click=${this._loadMore} ?disabled=${this._loadingMore}>
                              ${this._loadingMore?_t("loading_more",this._lang):_t("load_more",this._lang)}
                            </button>
                          </div>
                        `:q}
                  `}
        </div>
        ${this._selectedCall?this._renderModal(this._selectedCall):q}
      </ha-card>
    `}_renderRow(t){const e=gt(t.status,t.direction),s=mt(t.status,t.direction,this._lang),i="inbound"===t.direction?t.caller_display:t.called_display,o=t.caller_device?.name??null,r=new Date(t.started_at).toLocaleTimeString(this._lang,{hour:"2-digit",minute:"2-digit"}),n=o?`${r} – ${o}`:r;return V`
      <tr
        @click=${()=>{this._selectedCall=t}}
        class="clickable"
      >
        <td class="icon-cell">
          <ha-icon icon=${e.icon} style="color:${e.color}" title=${s}></ha-icon>
        </td>
        <td class="name-cell">
          <span class="name">${i}</span>
          <span class="secondary">${n}</span>
        </td>
        <td class="duration-cell">${ft(t.duration_seconds)}</td>
      </tr>
    `}_renderModal(t){const e=this._lang,s=gt(t.status,t.direction),i=mt(t.status,t.direction,e),o="inbound"===t.direction?t.caller_display:t.called_display,r=t.caller_device,n=(t,e)=>V`
      <tr>
        <td class="modal-label">${t}</td>
        <td class="modal-value">${e}</td>
      </tr>
    `;return V`
      <div class="modal-backdrop" @click=${this._closeModal}>
        <div class="modal" @click=${t=>t.stopPropagation()}>
          <div class="modal-header">
            <ha-icon icon=${s.icon} style="color:${s.color}" title=${i}></ha-icon>
            <span class="modal-title">${o}</span>
            <button class="modal-close" @click=${this._closeModal}><ha-icon icon="mdi:close"></ha-icon></button>
          </div>
          <table class="modal-table">
            <tr>
              <td class="modal-label">${_t("modal_status",e)}</td>
              <td class="modal-value" style="color:${s.color}">${i}</td>
            </tr>
            ${n(_t("modal_caller",e),`${t.caller_display} (${t.caller_number})`)}
            ${n(_t("modal_called",e),`${t.called_display} (${t.called_number})`)}
            ${r?n(_t("modal_device",e),r.name):q}
            ${r?n(_t("modal_extension",e),r.extension):q}
            ${n(_t("modal_started",e),$t(t.started_at,e))}
            ${n(_t("modal_connected",e),$t(t.connected_at,e))}
            ${n(_t("modal_finished",e),$t(t.finished_at,e))}
            ${n(_t("modal_duration",e),ft(t.duration_seconds))}
            ${n(_t("modal_msn",e),t.msn||_t("modal_unknown",e))}
            ${n(_t("modal_trunk",e),t.trunk_id||_t("modal_unknown",e))}
            ${n(_t("modal_line",e),String(t.line_id))}
            ${n(_t("modal_internal",e),t.is_internal?_t("modal_yes",e):_t("modal_no",e))}
          </table>
        </div>
      </div>
    `}_closeModal(){this._selectedCall=null}static{this.styles=n`
    :host {
      display: block;
    }
    .card-header {
      padding: 12px 16px 0;
      font-size: 1.1em;
      font-weight: 500;
      color: var(--primary-text-color);
    }
    .card-content {
      padding: 8px 16px 16px;
    }
    .status {
      color: var(--secondary-text-color);
      padding: 8px 0;
    }
    .status.error {
      color: var(--error-color, #e45f3b);
    }
    .day-header {
      font-size: 0.75em;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--secondary-text-color);
      padding: 10px 0 4px;
    }
    .day-header:first-child {
      padding-top: 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    tr.clickable {
      cursor: pointer;
    }
    tr.clickable:hover {
      background: var(--secondary-background-color);
    }
    tr {
      border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
    }
    tr:last-child {
      border-bottom: none;
    }
    td {
      padding: 6px 4px;
      vertical-align: middle;
    }
    .icon-cell {
      width: 28px;
      padding-right: 8px;
      --mdc-icon-size: 22px;
    }
    .name-cell {
      display: flex;
      flex-direction: column;
    }
    .name {
      font-size: 0.95em;
      color: var(--primary-text-color);
    }
    .secondary {
      font-size: 0.78em;
      color: var(--secondary-text-color);
    }
    .duration-cell {
      text-align: right;
      font-size: 0.85em;
      color: var(--secondary-text-color);
      white-space: nowrap;
      padding-left: 8px;
    }
    .load-more {
      display: flex;
      justify-content: center;
      padding-top: 12px;
    }
    .load-more button {
      background: none;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.2));
      border-radius: 4px;
      color: var(--primary-color);
      cursor: pointer;
      font-size: 0.85em;
      padding: 6px 16px;
    }
    .load-more button:disabled {
      color: var(--secondary-text-color);
      cursor: default;
    }
    .load-more button:hover:not(:disabled) {
      background: var(--secondary-background-color);
    }
    /* Modal */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .modal {
      background: var(--card-background-color, #fff);
      border-radius: 8px;
      padding: 20px;
      max-width: 420px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }
    .modal-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 16px;
    }
    .modal-title {
      flex: 1;
      font-size: 1.05em;
      font-weight: 500;
      color: var(--primary-text-color);
    }
    .modal-close {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      color: var(--secondary-text-color);
      display: flex;
      align-items: center;
    }
    .modal-table {
      width: 100%;
      border-collapse: collapse;
    }
    .modal-table tr {
      border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.06));
    }
    .modal-table tr:last-child {
      border-bottom: none;
    }
    .modal-label {
      font-size: 0.8em;
      color: var(--secondary-text-color);
      padding: 5px 12px 5px 0;
      white-space: nowrap;
      vertical-align: top;
    }
    .modal-value {
      font-size: 0.85em;
      color: var(--primary-text-color);
      padding: 5px 0;
      word-break: break-all;
    }
  `}}t([ht({attribute:!1})],bt.prototype,"hass",void 0),t([ut()],bt.prototype,"_config",void 0),t([ut()],bt.prototype,"_calls",void 0),t([ut()],bt.prototype,"_nextCursor",void 0),t([ut()],bt.prototype,"_loading",void 0),t([ut()],bt.prototype,"_loadingMore",void 0),t([ut()],bt.prototype,"_error",void 0),t([ut()],bt.prototype,"_selectedCall",void 0),window.customCards=window.customCards||[],window.customCards.push({type:"phone-logger-card",name:"Phone Logger Card",description:"Displays phone call history via Phone Logger custom component",preview:!1,documentationURL:"https://github.com/akentner/phone-logger-card"}),customElements.define("phone-logger-card",bt),console.info("%c PHONE-LOGGER-CARD %c v2.1.0 ","color:white;background:#3092dc;font-weight:bold","color:#3092dc;background:white;font-weight:bold")}();
