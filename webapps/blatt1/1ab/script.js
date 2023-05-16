function openForm(evt, formName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("form");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(formName).style.display = "block";
    evt.currentTarget.className += " active";
  }
  
  document.getElementById("register").addEventListener("submit", function(e) {
    e.preventDefault();


    console.log("Registration submitted");
  });
  
  document.getElementById("login").addEventListener("submit", function(e) {
    e.preventDefault();

    
    console.log("Login submitted");
  });