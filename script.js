'use strict';
document.body.classList.add('js');
const menu=document.querySelector('#menu'),nav=document.querySelector('#nav');
if(menu&&nav){const close=()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='Menú';};menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'Cerrar':'Menú';});nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',close));document.addEventListener('keydown',event=>{if(event.key==='Escape'&&nav.classList.contains('open')){close();menu.focus();}});}
// Búsqueda local; normaliza tildes y combina búsqueda y categoría.
const topics=[...document.querySelectorAll('.topic')],filters=document.querySelectorAll('[data-filter]'),search=document.querySelector('#topic-search');let category='todos';
const normalize=text=>text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function filterTopics(){if(!search)return;const term=normalize(search.value.trim());let count=0;topics.forEach(topic=>{const show=(category==='todos'||topic.dataset.category===category)&&normalize(topic.textContent).includes(term);topic.hidden=!show;if(show)count++;});document.querySelector('#topic-count').textContent=`${count} ${count===1?'tema disponible':'temas disponibles'}`;document.querySelector('#topic-empty').hidden=count>0;}
filters.forEach(button=>button.addEventListener('click',()=>{category=button.dataset.filter;filters.forEach(item=>{const active=item===button;item.classList.toggle('active',active);item.setAttribute('aria-pressed',String(active));});filterTopics();}));if(search)search.addEventListener('input',filterTopics);
// Calculadora de porcentajes. No determina si una operación está gravada.
function calculateIVA(amount,rate,mode){
 if(!Number.isFinite(amount)||!Number.isFinite(rate)||amount<0||amount>1e12||rate<0||rate>100||!['add','extract'].includes(mode))throw new Error('Ingresa un valor entre 0 y 1.000.000.000.000 y una tarifa entre 0 y 100.');
 const base=mode==='extract'?amount/(1+rate/100):amount;const tax=mode==='extract'?amount-base:base*rate/100;return{base,tax,total:mode==='extract'?amount:base+tax};
}
const calculator=document.querySelector('#calculator');
const formatMoney=new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',minimumFractionDigits:2,maximumFractionDigits:2});
if(calculator){
 const amount=document.querySelector('#amount'),rate=document.querySelector('#rate'),result=document.querySelector('#calc-result'),error=document.querySelector('#calc-error');
 const clearResult=()=>{result.hidden=true;error.hidden=true;};
 amount.addEventListener('input',clearResult);rate.addEventListener('input',clearResult);
 calculator.querySelectorAll('input[name="mode"]').forEach(input=>input.addEventListener('change',()=>{document.querySelector('#amount-label').textContent=input.value==='extract'?'Valor total con IVA (COP)':'Valor antes de IVA (COP)';clearResult();}));
 calculator.addEventListener('submit',event=>{event.preventDefault();try{if(amount.value.trim()===''||rate.value.trim()==='')throw new Error('Completa el valor y la tarifa.');const values=calculateIVA(Number(amount.value),Number(rate.value),calculator.querySelector('input[name="mode"]:checked').value);document.querySelector('#result-base').textContent=formatMoney.format(values.base);document.querySelector('#result-tax').textContent=formatMoney.format(values.tax);document.querySelector('#result-total').textContent=formatMoney.format(values.total);result.hidden=false;error.hidden=true;}catch(problem){result.hidden=true;error.textContent=problem.message;error.hidden=false;}});
}
const checklist=document.querySelectorAll('.checklist input');const updateCount=()=>{const count=[...checklist].filter(input=>input.checked).length;const label=document.querySelector('#check-count');if(label)label.textContent=`${count} de ${checklist.length} puntos organizados`;};checklist.forEach(input=>input.addEventListener('change',updateCount));updateCount();const print=document.querySelector('#print-list');if(print)print.addEventListener('click',()=>window.print());