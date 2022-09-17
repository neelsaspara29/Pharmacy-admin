// const day=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
// const month=['Jan','Feb','March','Apr','May','Jun','July','Aug','Sep','Oct','Nov','Dec']

const append_child=(who,Name,massage,image)=>{
   
    console.log(who,Name,massage,image)
      var div = document.getElementById(`appendhear`);
      let string;
      if(who!='admin'){

     string=` <div class="d-flex flex-column mb-5 align-items-start">
    <div class="d-flex align-items-center">
      <div class="symbol symbol-circle symbol-40 mr-3">
        <img alt="Pic" src=${image} style={{width:'50px'}}/>
      </div>
      <div>
        <a
          href="#"
          class="text-dark-75 text-hover-primary font-weight-bold font-size-h6"
        >
        ${Name}
        </a>
        
      </div>
    </div>
    <div class="mt-2 rounded p-5 bg-light-success text-dark-50 font-weight-bold font-size-lg text-left max-w-400px">
    ${massage}
    </div>
  </div>`
}else{
  string=` <div class="d-flex flex-column mb-5 align-items-end">
  <div class="d-flex align-items-center">
    <div>
      
      <a
        href="#"
        class="text-dark-75 text-hover-primary font-weight-bold font-size-h6"
      >
      You
      </a>
    </div>
    <div class="symbol symbol-circle symbol-40 ml-3">
    <div class="profile">
    <span>A</span>
  </div>
    </div>
  </div>
  <div class="mt-2 rounded p-5 bg-light-primary text-dark-50 font-weight-bold font-size-lg text-right max-w-400px">
  ${massage}
  </div>
</div>`
}
  let div_tag=document.createElement('div');
  div_tag.innerHTML=string

  div && div.appendChild(div_tag);
  var divt = document.getElementById(`kt_chat_content`);
  divt && (divt.scrollTop = divt.scrollHeight);
}

 
export {append_child}