(function(){
  function update(car){
    var track=car.querySelector('.mw-car-track');
    var prev=car.querySelector('.mw-car-prev');
    var next=car.querySelector('.mw-car-next');
    if(!track||!prev||!next)return;
    var max=track.scrollWidth-track.clientWidth;
    prev.disabled=track.scrollLeft<=2;
    next.disabled=track.scrollLeft>=max-2;
  }
  function cars(){return document.querySelectorAll('.mw-car-head');}
  cars().forEach(function(head){
    var car=head.parentElement;
    var track=car.querySelector('.mw-car-track');
    if(!track)return;
    update(car);
    track.addEventListener('scroll',function(){update(car);},{passive:true});
  });
  window.addEventListener('resize',function(){cars().forEach(function(head){update(head.parentElement);});});
  document.addEventListener('click',function(e){
    var b=e.target.closest('.mw-car-nav button');
    if(!b||b.disabled)return;
    var car=b.closest('.mw-car-head').parentElement;
    var track=car.querySelector('.mw-car-track');
    var first=track?track.firstElementChild:null;
    if(!first)return;
    var gap=parseFloat(getComputedStyle(track).columnGap||getComputedStyle(track).gap)||24;
    var step=first.getBoundingClientRect().width+gap;
    track.scrollBy({left:b.classList.contains('mw-car-next')?step:-step,behavior:'smooth'});
  });
})();
