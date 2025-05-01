var bhktypes = [], propertytypes = [], furnishtypes = [], listedBytypes = [], isskipCity = false, maximumPriceRent = 500000, maximumPriceBuy = 50000000
var ConstantIP = '';
var ConstantFeaturedProperty = '';
var constantVideoID = '';
var partnerId = 'info@mhrealty.in';

// Execute after the DOM is loaded
document.addEventListener('DOMContentLoaded', loadNavbar);
function loadNavbar() {
  debugger
  fetch('./navbar.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('navbar-placeholder').innerHTML = data;
      setActiveClass();  
    })
    .catch(error => console.error('Error loading navbar:', error));
}

function setActiveClass() {
  const currentPage = window.location.pathname;
  const navLinks = document.querySelectorAll('#navbar-placeholder a[href]:not([href="#"])');
  const homeLoanButton = document.querySelector('.homeloan-button');
  navLinks.forEach(link => {
    const linkPage = new URL(link.href, window.location.origin).pathname;
    const orangeLine = link.querySelector('.orange-line');

    if (currentPage === linkPage) {
      link.classList.add('active');
      if (orangeLine) {
        orangeLine.style.transform = 'scaleX(1)'; 
      }
      if (link.textContent.includes('HOME LOAN')) {
        link.classList.remove('active');
        homeLoanButton.classList.add('activate');
      }
    } else {
      link.classList.remove('active');
      if (orangeLine) {
        orangeLine.style.transform = 'scaleX(0)'; 
      }
      if (link.textContent.includes('HOME LOAN')) {
        homeLoanButton.classList.remove('active'); 
      }
    }
  });
}

// ******  Backend Api  *******

// Live---------
// let apiUrl = 'https://dncrpropertyapi.azurewebsites.net/'
let apiUrl = 'https://freehostingweb.bsite.net/'

// Dev----------
// let apiUrl = 'https://devdncrbe.azurewebsites.net/'
// *********************************************************

// function urlRedirection(token) {
  // dev--------
  // window.location.href = `https://devdncrfe.azurewebsites.net/Redirecting/?tok=${token}`

  // Live--------
  // window.location.href = `https://app.MHRealty/Redirecting/?tok=${token}`

  // // Local--------
//   window.location.href = `http://localhost:4200/Redirecting/?tok=${token}`
// }
function getapicall(url) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json, text/plain, */*');
    xhr.send();
    xhr.onreadystatechange = function () {
      var status = xhr.status;
      if (status == 200) {
        let data = JSON?.parse(xhr?.responseText);
        resolve(data);
      } else {
        reject(status);
      }
    };

  });
}

function isInitialPage() {
  return window.location.pathname === '/' || window.location.pathname === '/index.html';
}

window.onload = function () {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('pro');
  const img = urlParams.get('img');
  const index = urlParams.get('in');
  const slider = urlParams.get('slid');
  const reSale = urlParams.get('resale');
  const contact = urlParams.get('is');

  if (isInitialPage()) {
    GetAllFeaturedProperty();
    GetAllResaleProperty();
    GetAllFeedback();
    youTubeVideoIdExtractor2();
  }

  if (id) {
    var details;
    fetch(`${apiUrl}/api/v1/partner/getPartnerPropertyByid?id=${id}`).
      then(res => {
        return res.json()
      }).then(data => {
        details = data.data;

        // details.ImageURL = details.ImageURL.split(",");
        document.getElementById("store-images").value = details.ImageURLType;
        let videoID = data.data.VideoURL ? youTubeVideoIdExtractor(data.data.VideoURL) : null

        let TagList = '';
        if (details.Tags && details.Tags.length > 0) {
          details.Tags.forEach(tagObj => {
            TagList += tagObj.Tag + ' &nbsp;' + ' &nbsp;';
          });
        }

        const toggledImage = data.data.ImageURLType.find(img => img.toggle === true);

        if (slider === "true") {
          if (details.ImageURLType.length > 0) {
            $("#main-card").html(`
            <div>
            ${videoID ? `<iframe width="300" height="400" src=${videoID} style="width:100%" title="YouTube video player"
              frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen></iframe>` : ''}
        
            <div class="row">
              <div class="col-md-4">
                <img src=${toggledImage ? toggledImage.ImageUrl : details.ImageURLType[0].ImageUrl}
                  style="height: 200px;width:100%;cursor:zoom-in" data-toggle="modal" data-target="#popupimages"
                  onclick="imageslistpopup(${index},${slider},${reSale})">
        
                <div class="ButtonTabs" style="display: flex;">
                  <div>
                    <button class="btn btn-success mobileBTN1" data-toggle="modal" data-target="#popupimages"
                      onclick="imageslistpopup(${index},${slider},${reSale})">View More Images
                    </button>
                  </div>
                  <div>
                    <a class="btn btn-success position-absolute mobileBTN2" href="#" data-toggle="modal"
                      data-target="#modalContact" onclick="openContactModal('BUYER')">Enquire Now
                    </a>
                  </div>
                </div>
              </div>
        
              <div class="col-md-8 float-left row" style="margin-bottom: 120px;font-size: 15px;">
                <div class="col-md-12" style=" text-align: justify;">${data.data.Discription}
                </div>
        
                <div class="col-md-12" style="margin-top: 20px;">
                  <div style="display: flex; flex-wrap: wrap;"><b>${TagList}</b>
                  </div>
                </div>
        
                ${data.data.Discription.length > 1500 ? `
                <div class="row col-md-12">
                  <button class="btn btn-success mobileBTN1 mobileBTN2edit1" data-toggle="modal" data-target="#popupimages"
                    onclick="imageslistpopup(${index},${slider},${reSale})">View More Images
                  </button>
                  <a class="btn btn-success position-absolute mobileBTN2 mobileBTN2edit2" href="#" data-toggle="modal"
                    data-target="#modalContact" onclick="openContactModal('BUYER')">Enquire Now
                  </a>
                </div>` : ''}
              </div>
            </div>
          </div> `)
          }
        }
        if (reSale === "true") {
          if (details.ImageURLType.length > 0) {
            $("#main-card").html(`
  <div>
    ${videoID ? `<iframe width="300" height="400" src=${videoID} style="width:100%" title="YouTube video player"
      frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen></iframe>` : ''}
      
    <div class="row">
      <div class="col-md-4">
        <img src=${toggledImage ? toggledImage.ImageUrl : details.ImageURLType[0].ImageUrl} style="height: 200px;width:100%;cursor:zoom-in" data-toggle="modal" data-target="#popupimages" onclick="imageslistpopup(${index},${slider},${reSale})">
     
        <div class="ButtonTabs" style="display: flex;">
                  <div>
                    <button class="btn btn-success mobileBTN1" data-toggle="modal" data-target="#popupimages"
                      onclick="imageslistpopup(${index},${slider},${reSale})">View More Images
                    </button>
                  </div>
                  <div>
                    <a class="btn btn-success position-absolute mobileBTN2" href="#" data-toggle="modal"
                      data-target="#modalContact" onclick="openContactModal('BUYER')">Enquire Now
                    </a>
                  </div>
                </div>
      </div>

      <div class="col-md-8 float-left row" style="margin-bottom: 120px;font-size: 15px;">
        <div class="col-md-12" style=" text-align: justify;">${data.data.Discription}
        </div>

        <div class="col-md-12" style="margin-top: 20px;">
          <div style="display: flex; flex-wrap: wrap;"><b>${TagList}</b>
          </div>
        </div> 

        ${data.data.Discription.length > 1500 ? `
        <div class="row col-md-12">   
          <button class="btn btn-success mobileBTN1 mobileBTN2edit1" data-toggle="modal" data-target="#popupimages" onclick="imageslistpopup(${index},${slider},${reSale})">View More Images
          </button>      
          <a class="btn btn-success position-absolute mobileBTN2 mobileBTN2edit2" href="#" data-toggle="modal" data-target="#modalContact" onclick="openContactModal('BUYER')">Enquire Now
          </a>      
        </div>` : ''}
    </div>
  </div> `)
          }
        }
      });
  }
  else if (img) {
    window.localStorage.setItem('image', img)
    showAllImages()
  }
};
function showAllImages(index) {
  let data = window.localStorage.getItem('image').split(",");
  index == undefined ? index = 0 : index = index;

  $('#all-images').empty()

  if (index <= data.length) {
    $("#all-images").append(`<div><span style="font-size: 100px;
    color: cadetblue;
    position: absolute;
    top: 50%;
    left: 0;
    cursor:pointer;
    transform: translateY(-50%);
    z-index: 9999;" onclick="PreviousImage(${index})"><</span><img src="${data[index]}" style="position:relative"><span style="font-size: 100px;
    color: cadetblue;
    position: absolute;
    top: 50%;
    right: 0;
    cursor:pointer;
    transform: translateY(-50%);
    z-index: 9999;" onclick="NextImage(${index})">></span></div>`)
  }
}
function viewallImages() {
  var image = document.getElementById("store-images").value.split(",");
  window.open(`./property_images.html?img=${image}`);
}

function NextImage(data) {
  data += 1;
  imagesno = window.localStorage.getItem('image').split(",").length;
  if (data < imagesno) {
    showAllImages(data)
  }
}
function PreviousImage(data) {
  data -= 1
  imagesno = window.localStorage.getItem('image').split(",").length;
  if (data < imagesno && data > -1) {
    showAllImages(data)
  }
}

function openContactModal(val) {
  val === "BUYER" ? subjectApi = User.BUYER : (val === "RENTER" ? subjectApi = User.RENTER : subjectApi = User.SELLER)
  document.getElementById("invalid-response-getintoucg").style.display = "none";
  document.getElementById("valid-response-getintoucg").style.display = "none";
  document.forms["getinTouchForm"].reset();
  document.getElementById("name-req-getintouch").style.display = "none";
  document.getElementById("email-req-getintouch").style.display = "none";
  document.getElementById("mobile-req-getintouch").style.display = "none";
  document.getElementById("invalidMobileContact").style.display = "none";
  document.getElementById("message-req-getintouch").style.display = "none";
  document.getElementById("CUmessage").classList.remove('required');
  document.getElementById("CUmobile").classList.remove('required');
  document.getElementById("CUemail1").classList.remove('required');
  document.getElementById("CUname").classList.remove('required');
  document.getElementById("notValidEmail11").style.display = "none";
}
function sendMessageGetinTouchForm() {
  var message, name, subject, emailaddress, mobile
  message = document.forms["getinTouchForm"]["getinTouchFormmessage"].value;
  emailaddress = document.forms["getinTouchForm"]["getinTouchFormemail"].value;
  subject = subjectApi;
  name = document.forms["getinTouchForm"]["getinTouchFormname"].value;
  mobile = document.forms["getinTouchForm"]["getinTouchFormmobile"].value;

  var mybody = {
    Email: emailaddress,
    Message: message,
    Name: name,
    Subject: subject,
    Phone: mobile,
    PartnerId: partnerId
  }
  if (message == '') {
    document.getElementById("message-req-getintouch").style.display = "block";
  }
  if (emailaddress == '') {
    document.getElementById("email-req-getintouch").style.display = "block";
  }
  if (name == '') {
    document.getElementById("name-req-getintouch").style.display = "block";
  }
  if (mobile == '') {
    document.getElementById("mobile-req-getintouch").style.display = "block";
    document.getElementById("invalidMobileContact").style.display = "none";
  } else {
    if (mobile.length !== 10) {
      document.getElementById("invalidMobileContact").style.display = "block";
      document.getElementById("mobile-req-getintouch").style.display = "none";
    } else {
      document.getElementById("mobile-req-getintouch").style.display = "none";
      document.getElementById("invalidMobileContact").style.display = "none";
    }
  }
  const reg = /\S+@\S+\.\S+/;
  var isvalid = reg.test(mybody?.Email);

  if (mybody?.Email !== '' && mybody?.Message !== '' && mybody?.Name !== '' && mybody?.Phone !== '' && mybody?.Phone?.length == 10 && isvalid) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", `${apiUrl}/api/v1/partner/PartnerGetinTouch`);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json, text/plain, */*');
    xhr.send(JSON.stringify(mybody));
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          var json_data = JSON.parse(xhr.responseText);
          if (json_data.Success) {
            document.getElementById("valid-response-getintoucg").style.display = "flex";
            document.forms["getinTouchForm"].reset();
            grecaptcha.reset();
            document.getElementById("modalContact").style.display = "block";
          }
          else {
            // grecaptcha.reset();
            document.getElementById("invalid-response-getintoucg").style.display = "flex";
          }
        };
      }
    }
  }
}
function emailCheck(email, isLogin) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", `${apiUrl}/api/v1/User/varifyUserbyEmail?email=${email}`);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('Accept', 'application/json, text/plain, */*');
  xhr.send();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        var json_data = JSON.parse(xhr?.responseText);
        if (json_data.Success == true) {
          if (isLogin == false) {
            document.getElementById("emailalreadyexist").style.display = "block";
            document.getElementById("btn-signup").disabled = true;
          }
          if (isLogin == true) {
            document.getElementById("emaildoesnotexist-login").style.display = "none";
          }
          else {
            document.getElementById("sellbuyemailalreadyexist").style.display = "block";
          }
        }
        else {
          if (isLogin == true) {
            document.getElementById("emaildoesnotexist-login").style.display = "block";
            // document.getElementById("nextStepButton").disabled = true;
          }
          if (isLogin == false) {
            document.getElementById("emailalreadyexist").style.display = "none";
            if (document.getElementById("accpectance").checked) {
              document.getElementById("btn-signup").disabled = false;
            }
          }
          else {
            document.getElementById("sellbuyemailalreadyexist").style.display = "none";
          }
        }
      }
    }
  };
}
function openDetails() {
  window.href = "/prop-details.html"
}
const User = Object.freeze({
  RENTER: "MHRealty : Tenant enquiry",
  BUYER: "MHRealty : Buyer enquiry",
  SELLER: "MHRealty : Owner enquiry",
})
var subjectApi = "MHRealty : Website enquiry";
var correctCaptcha = function (response) {
  if (response) {
    document.getElementById("contactus-btn").disabled = false;
  }
};
var correctCaptcha1 = function (response) {
  if (response) {
    document.getElementById("signupsubmit").disabled = false;
  }
};
var correctCaptcha2 = function (response) {
  if (response) {
    document.getElementById("btn-signup").disabled = false;
  }
};
var correctCaptcha3 = function (response) {
  if (response) {
    document.getElementById("contactus-btn1").disabled = false;
  }
};
function removeValidationGetinTouch() {
  var message, name, emailaddress, mobileno
  message = document.forms["getinTouchForm"]["getinTouchFormmessage"].value;
  emailaddress = document.forms["getinTouchForm"]["getinTouchFormemail"].value;
  name = document.forms["getinTouchForm"]["getinTouchFormname"].value;
  mobileno = document.forms["getinTouchForm"]["getinTouchFormname"].value;
  if (message != '') {
    document.getElementById("message-req-getintouch").style.display = "none";
  }
  if (emailaddress != '') {
    document.getElementById("email-req-getintouch").style.display = "none";
  }
  if (name != '') {
    document.getElementById("name-req-getintouch").style.display = "none";
  }
  if (mobileno != '') {
    document.getElementById("name-req-getintouch").style.display = "none";
  }
  if (mobileno.length != 10) {
    document.getElementById("invalidMobileContact").style.display = "none";
  }
}
function removeValidation(isemailchanging) {
  let email = document.forms["loginForm"]["Email"].value
  if (email !== '' && isemailchanging === true) {
    document.getElementById("email-req-login").style.display = "none";
    const reg = /\S+@\S+\.\S+/;
    var isvalid = reg.test(email);
    if (isvalid) {
      emailCheck(email, true);
      document.getElementById("notValidEmailLogin").style.display = "none";
    } else {
      document.getElementById("notValidEmailLogin").style.display = "block";
    }
  }
  if (document.forms["loginForm"]["Password"].value) {
    document.getElementById("password-req-login").style.display = "none";
  }
}

function checkuser() {
  var email = document.forms["contactForm"]["contactEmail"].value;
  if (email != '') {
    document.getElementById("contactemail").style.display = "none";
  }
  const reg = /\S+@\S+\.\S+/;
  var isvalid = reg.test(email);
  if (isvalid) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", `${apiUrl}/api/v1/User/varifyUserbyEmail?email=${email}`);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json, text/plain, */*');
    xhr.send();
    xhr.onreadystatechange = function () {
      if (xhr?.readyState == 4) {
        if (xhr?.status == 200) {
          var json_data = JSON.parse(xhr?.responseText);
          if (json_data.Success == true) {
            var user = json_data.data;
            if (user.Role == "User") {
              document.forms["contactForm"]["contactName"].value = user.Name;
              document.forms["contactForm"]["contactMobile"].value = user.Phone;
              document.getElementById("continueContact").style.display = "none";
              document.getElementById("existingUser").style.display = "block";
              document.getElementById("submitContact").style.display = "block";
              localStorage.setItem('userid', user.ID)
            }
          }
          else {
            // document.getElementById("sellalreadyregistered").style.display = "none";
            document.getElementById("invalidresponecontact").style.display = "none";
            document.getElementById("alreadycontactedProperty").style.display = "none";
            document.getElementById("validresponecontact").style.display = "none";
            document.getElementById("continueContact").style.display = "block";
            document.getElementById("existingUser").style.display = "none";
            document.getElementById("submitContact").style.display = "none";
          }
        }
      }
    };
  }
}

function closepopupimage() {
  document.querySelector("body").setAttribute("style", "overflow:auto");
}
function imageslistpopup(index, slider, resale) {
  document.querySelector("body").setAttribute("style", "overflow:visible");
  let photos;
  let video;
  if (slider) {
    debugger
    photos = JSON.parse(localStorage.getItem(`imageSlider${index}`));
    video = localStorage.getItem(`videoSlider${index}`);
  }
  if (resale) {
    photos = JSON.parse(localStorage.getItem(`imageResale${index}`));
    video = localStorage.getItem(`videoResale${index}`);
  }
  let imgtype = [];
  let images = [];
  photos.forEach((im) => {
    if (!imgtype.includes(im.Type)) {
      imgtype.push(im.Type)
    }
  })
  for (var i = 0; i < 2; i++) {
    if (photos.length > i) {
      images.push(photos[i])
    }
  }
  if (video) {
    if (!imgtype.includes('Video')) {
      imgtype.push('Video');
    }
  }
  if (images.length == 1 && video) {
    let obj = new Object();
    obj.imageURL = video;
    obj.Type = 'Video';
    images.push(obj)
  }
  // remove tab
  $('#popup-tab').empty()
  //remove image dom
  $('#show-image').empty()
  imgtype.forEach((type) => {
    if (images[0].Type == type) {
      $('#popup-tab').append(`<a class="nav-link" style="color: white;cursor: pointer; border-bottom: 1px solid white;" onclick="imagetabb('${index}','${type}')">${type}</a>`)
    }
    else {
      $('#popup-tab').append(`<a class="nav-link" style="color: white;cursor: pointer;" onclick="imagetabb('${index}','${type}')">${type}</a>`)
    }
  })

  if (images.length > 1) {
    $('#next-photo').append(`<span id="next-btn" style="color: white;font-size: 50px;position: absolute;right: 0;top: 40%;cursor: pointer;z-index:100" onclick="nextimagearrow(${index},${1})">></span>`)
  }
  for (var i = 0; i < 2; i++) {
    if (images[i].Type != 'Video') {
      if (i == 0) {
        $('#show-image').append(`<img class="image-size" src="${images[i].ImageUrl}" + data-toggle="modal" data-target="#zoomModal" + onclick="openzoomimages('${images[i].ImageUrl}','${images[i].Type}')" + style="margin-left:400px;"><br><span style="position:absolute;top:450px;color: white;z-index: 10;left: 30%;">${images[i].Type}</span>`)
      }
      else {
        if (images.length > i) {
          $('#show-image').append(`<img class="ml-4 image-size" src="${images[i].ImageUrl}" + data-toggle="modal" + data-target="#zoomModal" + onclick="openzoomimages('${images[i].ImageUrl}','${images[i].Type}')" + style="filter:blur(2px)"><span style="top:450px;position: absolute;bottom: 0px;color: white;z-index: 10;right: 30%;">${images[i].Type}</span>`)
        }

      }
    }
    else {
      const videoID = youTubeVideoIdExtractor(images[i].imageURL)
      $('#show-image').append(`<div class="col-4 position-relative"><iframe width="206" src="${videoID}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" style="height: 100%;width:100%;margin-left: 10px;"  allowfullscreen></iframe><span class="video-text">${images[i].Type}</span></div>`)

    }
  }
}
function nextimagearrow(propertyindex, imageindex) {
  const urlParams = new URLSearchParams(window.location.search);
  const slider = urlParams.get('slid');
  const reSale = urlParams.get('resale');
  let images;
  let video;
  if (slider == 'true') {
    images = JSON.parse(localStorage.getItem(`imageSlider${propertyindex}`));
    video = localStorage.getItem(`videoSlider${propertyindex}`);
  }
  if (reSale == 'true') {
    images = JSON.parse(localStorage.getItem(`imageResale${propertyindex}`));
    video = localStorage.getItem(`videoResale${propertyindex}`);
  }
  if (video) {
    let obj = new Object();
    obj.imageURL = video;
    obj.Type = 'Video';
    images.push(obj)
  }
  let imgtype = []
  images.forEach((im) => {
    if (!imgtype.includes(im.Type)) {
      imgtype.push(im.Type)
    }
  })
  if (video) {
    if (!imgtype.includes('Video')) {
      imgtype.push('Video');
    }
  }
  // remove tab
  $('#popup-tab').empty()
  //  remove imagedom
  $('#show-image').empty()
  //remove next arrow
  $('#next-photo').empty()
  //remove previous arrow
  $('#previous-photo').empty()
  if (images?.length > imageindex + 1) {
    $('#next-photo').append(`<span id="next-btn" style="color: white;font-size: 50px;position: absolute;right: 0;top: 40%;cursor: pointer;z-index:100"  onclick="nextimagearrow(${propertyindex},${imageindex + 1})">></span>`)
  }
  if (imageindex > 0) {
    $('#previous-photo').append(`<span id="next-btn" style="color: white;font-size: 50px;position: absolute;left: 0;top: 40%;cursor: pointer;z-index:100" onclick="nextimagearrow(${propertyindex},${imageindex - 1})"><</span>`)
  }
  imgtype.forEach((type) => {
    if (images[imageindex]?.Type == type) {
      $('#popup-tab').append(`<a class="nav-link" style="color: white;cursor: pointer; border-bottom: 1px solid white;" onclick="imagetabb('${propertyindex}','${type}')">${type}</a>`)
    }
    else {
      $('#popup-tab').append(`<a class="nav-link" style="color: white;cursor: pointer;" onclick="imagetabb('${propertyindex}','${type}')">${type}</a>`)
    }
  })
  if (imageindex > 0) {
    for (var i = imageindex - 1; i < imageindex + 2; i++) {
      if (images[i]?.Type !== 'Video') {
        if (i == imageindex) {
          $('#show-image').append(`<div class="col-4" data-toggle="modal" data-target="#zoomModal"><img src="${images[i]?.ImageUrl}" class="image-size" style="width:100%" + onclick="openzoomimages('${images[i]?.ImageUrl}','${images[i]?.Type}')" + ><span style="position: absolute;top:360px;color: white;z-index: 10;left: 40%;">${images[i].Type}</span></div>`)
        }
        else {
          $('#show-image').append(`<div class="col-4" data-toggle="modal" data-target="#zoomModal"><img src="${images[i]?.ImageUrl}" class="image-size"  style="width:100%;filter:blur(2px)" + onclick="openzoomimages('${images[i]?.ImageUrl}','${images[i]?.Type}')" + ><span style="position: absolute;top:360px;color: white;z-index: 10;left: 40%;">${images[i].Type}</span></div>`)
        }
      }
      else {
        const videoID = youTubeVideoIdExtractor(images[i]?.imageURL)
        $('#show-image').append(`<div class="col-4 position-relative"><iframe width="206" src="${videoID}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" style="height: 100%;width:100%;margin-left: 10px;"  allowfullscreen></iframe><span class="video-text">${images[i].Type}</span></div>`)
      }
    }
  }
  else {
    for (var i = imageindex; i < imageindex + 2; i++) {
      if (images[i]?.Type !== 'Video') {
        if (i == imageindex) {
          $('#show-image').append(`<img  src="${images[i]?.ImageUrl}" + data-toggle="modal" data-target="#zoomModal" + onclick="openzoomimages('${images[i]?.ImageUrl}','${images[i]?.Type}')" + class="image-size" style="margin-left:400px;">
          <span style="position: absolute;top:450px;color: white;z-index: 10;left: 40%;">${images[i]?.Type}</span>`)
        }
        else {
          $('#show-image').append(`<img  src="${images[i]?.ImageUrl}" + data-toggle="modal" + data-target="#zoomModal" + onclick="openzoomimages('${images[i]?.ImageUrl}','${images[i]?.Type}')" + class="image-size ml-4" style="filter:blur(2px)">
        <span style="position: absolute;top:450px;color: white;z-index: 10;right: 20%;">${images[i]?.Type}</span>`)
        }
      }
      else {
        const videoID = youTubeVideoIdExtractor(images[i]?.imageURL)
        $('#show-image').append(`<div class="col-4 position-relative"><iframe width="206" src="${videoID}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" style="height: 100%;width:100%;margin-left: 10px;"  allowfullscreen></iframe><span class="video-text">${images[i].Type}</span></div>`)
      }
    }
  }
}
function imagetabb(propindex, type) {
  const urlParams = new URLSearchParams(window.location.search);
  const slider = urlParams.get('slid');
  const reSale = urlParams.get('resale');
  let images;
  let video;
  if (slider == 'true') {
    images = JSON.parse(localStorage.getItem(`imageSlider${propindex}`));
    video = localStorage.getItem(`videoSlider${propindex}`);
  }
  if (reSale == 'true') {
    images = JSON.parse(localStorage.getItem(`imageResale${propindex}`));
    video = localStorage.getItem(`videoResale${propindex}`);
  }
  let filterimage = [];
  let imgtype = [];
  let index = images.findIndex(x => x.Type == type);
  images.forEach((im) => {
    if (!imgtype.includes(im.Type)) {
      imgtype.push(im.Type)
    }
  })
  if (video) {
    if (!imgtype.includes('Video')) {
      imgtype.push('Video');
    }
  }
  if (video) {
    let obj = new Object();
    obj.imageURL = video;
    obj.Type = 'Video';
    images.push(obj)
  }
  // remove tab
  $('#popup-tab').empty()
  //remove image dom
  $('#show-image').empty()
  //remove next arrow
  $('#next-photo').empty()
  //remove previous arrow
  $('#previous-photo').empty()
  // next button
  if (images.length > index + 1 && type != 'Video') {
    $('#next-photo').append(`<span id="next-btn" style="color: white;font-size: 50px;position: absolute;right: 0;top: 40%;cursor: pointer;z-index:100"  onclick="nextimagearrow(${propindex},${index + 1})">></span>`)
  }
  //previous button
  if (index > 0) {
    $('#previous-photo').append(`<span id="next-btn" style="color: white;font-size: 50px;position: absolute;left: 0;top: 40%;cursor: pointer;z-index:100" onclick="nextimagearrow(${propindex},${index - 1})"><</span>`)
  }
  //tab
  imgtype.forEach((type1) => {
    if (type == type1) {
      $('#popup-tab').append(`<a class="nav-link" style="color: white;cursor: pointer; border-bottom: 1px solid white;" onclick="imagetabb('${propindex}','${type1}')">${type1}</a>`)
    }
    else {
      $('#popup-tab').append(`<a class="nav-link" style="color: white;cursor: pointer;" onclick="imagetabb('${propindex}','${type1}')">${type1}</a>`)
    }
  })
  if (type == 'Video') {
    const videoID = youTubeVideoIdExtractor(video)
    $('#show-image').append(`<div class="col-4 position-relative"><iframe width="206" src="${videoID}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" style="width: 100%;height: 400px;" allowfullscreen></iframe><span class="video-text"></span></div>`)
  } else {
    if (index == 0) {
      for (var i = index; i < index + 2; i++) {
        if (images[i].Type != 'Video') {
          if (i == 0) {
            $('#show-image').append(`<div class="col-4"></div><div class="col-4 "><img  src="${images[i].ImageUrl}" + data-toggle="modal" data-target="#zoomModal" + onclick="openzoomimages('${images[i].ImageUrl}','${images[i].Type}')" style="width:100%" class="image-size"></div><span style="position: absolute;top: 440px;color: white;z-index: 10;left: 40%;">${images[i].Type}</span>`)
          }
          else {
            $('#show-image').append(`<div class="col-4" data-toggle="modal" data-target="#zoomModal"><img src="${images[i].ImageUrl}" style="width:100%;filter:blur(2px);"  class="image-size"+ onclick="openzoomimages('${images[i].ImageUrl}','${images[i].Type}')" +><span style="position: absolute;color: white;z-index: 10;top: 440px;left:40%">${images[i].Type}</span></div>`)
          }
        }
        else {
          const videoID = youTubeVideoIdExtractor(video)
          $('#show-image').append(`<div class="col-4 position-relative"><iframe width="206" src="${videoID}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" style="width: 400px;height: 400px" allowfullscreen></iframe><span class="video-text">${images[i].Type}</span></div>`)
        }
      }
    }
    else {
      for (var i = index - 1; i < index + 2; i++) {
        if (images[i].Type != 'Video') {
          if (i == index) {
            $('#show-image').append(`<div class="col-4" data-toggle="modal" data-target="#zoomModal"><img src="${images[i].ImageUrl}" class="image-size" style="width:100%;" + onclick="openzoomimages('${images[i].ImageUrl}','${images[i].Type}')" +><span style="position: absolute;top:350px;left:40%;color: white;z-index: 10">${images[i].Type}</span></div>`)
          }
          else {
            $('#show-image').append(`<div class="col-4" data-toggle="modal" data-target="#zoomModal"><img src="${images[i].ImageUrl}" class="image-size" style="width:100%;filter:blur(2px)" + onclick="openzoomimages('${images[i].ImageUrl}','${images[i].Type}')" +><span style="position: absolute;color: white;z-index: 10;top:350px;left:40%;">${images[i].Type}</span></div>`)
          }
        }
        else {
          const videoID = youTubeVideoIdExtractor(video)
          $('#show-image').append(`<div class="col-4 position-relative"><iframe width="206" src="${videoID}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" style="width: 100%;" class="image-size" allowfullscreen></iframe><span class="video-text">${images[i].Type}</span></div>`)
        }
      }
    }
  }
}
function zoomimages() {
  let id = document.getElementById('zoom-img').style.transform;
  let ind = id.indexOf(".");
  let val = id.substr(ind - 1, ind + 1);
  let val1 = parseFloat(val) + .5;
  let scale = `scale(${val1})`
  document.getElementById('zoom-img').style.transform = scale;
}

function openzoomimages(url, img) {
  document.getElementById("imagetag").innerHTML = img;
  $('#zoomimage').empty()
  $('#zoomimage').append(`<div  style="cursor:zoom-in;width:100%;height:400px;transform: scale(.6)" onclick="zoomin()" id="zoom-img">`);
  document.querySelector("#zoom-img").setAttribute("style", `background-image:url(${url});width:600px;height:400px;background-repeat: no-repeat;background-size:cover;cursor:zoom-in;transform: scale(.6)`);
  const el = document.querySelector("#zoom-img");

  el.addEventListener("mousemove", (e) => {
    el.style.backgroundPositionX = -e.offsetX + 200 + "px";
    el.style.backgroundPositionY = -e.offsetY + 200 + "px";
  });
  // $('#zoomimage').append(`<img src="${url}" class="img-responsive" style="cursor:zoom-in;transform: scale(.6);width:500px" onclick="zoomin()" id="zoom-img">`)
}

function zoomin() {
  let id = document.getElementById('zoom-img').style.transform;
  let ind = id.indexOf(".");
  let val = id.substr(ind - 1, ind + 1);
  let val1 = parseFloat(val) + .3;
  let scale = `scale(${val1})`
  document.getElementById('zoom-img').style.transform = scale;
}

function zoomout() {
  let id = document.getElementById('zoom-img').style.transform;
  let ind = id.indexOf(".");
  let val = id.substr(ind - 1, ind + 1);
  let val1 = parseFloat(val) - .3;
  let scale = `scale(${val1})`
  document.getElementById('zoom-img').style.transform = scale;
}

function reset() {
  document.getElementById('zoom-img').style.transform = "scale(0.6)";
}

 function youTubeVideoIdExtractor(url) {
  const params = url
  const splitedURL = params.split('/')
  let videoID = splitedURL[splitedURL.length - 1]
  if (videoID.includes('watch?v=')) {
    videoID = videoID.replace('watch?v=', '')
  }
  videoID = `https://www.youtube.com/embed/${videoID}?autoplay=0&mute=1`
  return videoID
}
async function youTubeVideoIdExtractor2() {
  const params = 'https://youtu.be/YZWhTCO-0-g?si=5kxMYK_b2S11RBpT'
  const splitedURL = params.split('/')
  let videoID = splitedURL[splitedURL.length - 1]
  if (videoID.includes('watch?v=')) {
    videoID = videoID.replace('watch?v=', '')
  }
  constantVideoID = `https://www.youtube.com/embed/${videoID}?autoplay=0&mute=1`
  const iframe = document.getElementById("videoFrame");
  iframe.src = constantVideoID;

}

function addRequired(id) {
  let data = document.getElementById(id)
  if (data?.value === '') {
    data.classList.add('required')
  }
}

function isNumberValid(id, textID) {
  let data = document.getElementById(id).value
  if (data !== '') {
    if (data?.length !== 10) {
      document.getElementById(textID).style.display = 'block'
    } else {
      document.getElementById(textID).style.display = 'none'
    }
  }
}

function isValidEmail(id, textID) {
  let email = document.getElementById(id).value
  const reg = /\S+@\S+\.\S+/;
  if (email !== '') {
    var isvalid = reg.test(email);
    isvalid ? document.getElementById(textID).style.display = 'none' : document.getElementById(textID).style.display = 'block'
  }
  // if (isvalid) {
  //   emailVerify(email, textID);
  // }
}

function emailVerify(email, textID) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", `${apiUrl}/api/v1/Account/EmailValidation?Email=${email}`);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('Accept', 'application/json, text/plain, */*');
  xhr.send();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        var json_data = JSON.parse(xhr?.responseText);
        if (json_data.Success == true) {
          document.getElementById(textID).style.display = 'none'
        } else {
          document.getElementById(textID).style.display = 'block'
        }
      }
    }
  };
}

function removeValid(textID) {
  document.getElementById(textID).style.display = 'none'
}

function contactEmail() {
  let email = document.forms["buysellForm"]["buysellForm"].value
  if (document.forms["buysellForm"]["buysellEmail"].value !== '' && isemailfield == true) {
    const reg = /\S+@\S+\.\S+/;
    var isvalid = reg.test(email);
    if (isvalid) {
      emailCheckContact(email)
    }
  }
}


function emailCheckContact(email) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", `${apiUrl}/api/v1/User/varifyUserbyEmail?email=${email}`);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('Accept', 'application/json, text/plain, */*');
  xhr.send();
  xhr.onreadystatechange = function () {
    if (xhr?.readyState == 4) {
      if (xhr?.status == 200) {
        var json_data = JSON.parse(xhr?.responseText);
        if (json_data.Success == true) {
          document.getElementById("sellbuyemailalreadyexist").style.display = 'block'
        }
        else {
          document.getElementById("sellbuyemailalreadyexist").style.display = 'none'
        }
      }

    }
  };
}
let currentPageIndex = 0;
let ListofAll = [];
async function GetAllFeaturedProperty() {
  try {
    const response = await fetch(`${apiUrl}/api/v1/partner/GetAllPartnerFeaturedProperty?partnerId=${partnerId}&pageNumber=1&pageSize=500&readyToMove='No'`);
    const data = await response.json();
    saveImagesAndVideos(data?.data?.propertyModels);
    ListofAll = data?.data?.propertyModels || [];

    const headingsContainerArrows = document.querySelector('.headingsContainerArrows');

    headingsContainerArrows.innerHTML += `<div class="slider-arrows" id="FeaturedPropertyArrow">
      <button class="slider-arrowLeft" id="prevArrow" style="
      background: white;
      border-radius: 50%;
      border: 1px solid #CACACA;
      font-size: 30px;
      padding: 5px 16px 8px 15px;
      color: #CACACA;">&lt;
      </button>
      <button class="slider-arrowRight" id="nextArrow" style="
      background: white;
      border-radius: 50%;
      border: 1px solid #CACACA;
      font-size: 30px;
      padding: 5px 16px 8px 15px;
      color: #CACACA;">&gt;
      </button>
    </div>`;

    const FeaturedPropertyArrow = document.getElementById('FeaturedPropertyArrow');
    if (ListofAll?.length < 5) {
      FeaturedPropertyArrow.style.display = 'none';
    } else {
      FeaturedPropertyArrow.style.display = 'block';
    }

    const nextArrow = document.getElementById('nextArrow');
    const prevArrow = document.getElementById('prevArrow');

    // Right arrow click event listener
    nextArrow.addEventListener('click', () => {
      currentPageIndex = (currentPageIndex + 4) % data?.data?.propertyModels?.length;
      renderProperties(data);
      nextArrow.style.color = '#EE5925';
      nextArrow.style.borderColor = '#CACACA';
      prevArrow.style.color = '#CACACA';
    });

    // Left arrow click event listener
    prevArrow.addEventListener('click', () => {
      currentPageIndex = (currentPageIndex - 4 + data?.data?.propertyModels?.length) % data?.data?.propertyModels?.length;
      renderProperties(data);
      prevArrow.style.color = '#EE5925';
      prevArrow.style.borderColor = '#CACACA';
      nextArrow.style.color = '#CACACA';
    });

    // Initial rendering of properties
    renderProperties(data);
  } catch (error) {
    console.error(error);
  }
}
// function renderProperties(data) {
//   const headingsContainerApi = document.querySelector('.headingsContainerApi');
//   headingsContainerApi.innerHTML = '';
//   const totalProperties = data?.data?.propertyModels.length;
//   // Determine the number of iterations based on the number of properties
//   const iterations = Math.min(4, totalProperties);

//   for (let i = currentPageIndex; i < currentPageIndex + iterations; i++) {
//     const indexToShow = i % totalProperties;
//     const x = data?.data?.propertyModels[indexToShow];
//     const toggledImage = x.ImageURLType.find(img => img.toggle === true);
//     headingsContainerApi.innerHTML += `
//       <div class="col-md-5 popularPropertiesBody" style="
//         border: 1px solid #D9D9D9;
//         background: var(--primary-Whitecolor);
//         display: flex;
//         flex-wrap: wrap;
//         padding: 0px;
//         margin-bottom: 10px;"
//         onclick="renderPropertiesRedirection(${x.ID},${'true'})">
//         <div class="col-md-4" style="flex-shrink: 0;padding: 0px;">
//           <img src="${toggledImage ? toggledImage.ImageUrl : './assets/MHRealty/flats for rent in Mumbai-Navi Mumbai.jpg'}" style="width: 100%; height: 100%;" alt="">
//         </div>
//         <div class="col-md-8 xyz">
//           <div class="" style="
//             color: #231F20;
//             font-size: 24px;
//             font-style: normal;
//             font-weight: 700;
//             line-height: 28px;
//             padding-top: 15px;">
//             ${x.SellerName}
//             <div class="" style="color: #484848;
//               font-size: 18px;
//               font-style: normal;
//               font-weight: 400;
//               line-height: 21px; 
//               padding-top: 10px;">
//               ${x.ShortDiscription}
//             </div>
//           </div>
//         </div>
//       </div>
//     `;
//   }
// }
function renderProperties(data) {
  const headingsContainerApi = document.querySelector('.headingsContainerApi');
  headingsContainerApi.innerHTML = '';
  const totalProperties = data?.data?.propertyModels.length || 0;
  const propertiesPerPage = 4; // Show 4 properties at a time
  const startIndex = currentPageIndex * propertiesPerPage;
  const endIndex = Math.min(startIndex + propertiesPerPage, totalProperties);

  for (let i = startIndex; i < endIndex; i++) {
    const x = data?.data?.propertyModels[i];
    const toggledImage = x.ImageURLType.find(img => img.toggle === true);
    headingsContainerApi.innerHTML += `
      <div class="popularPropertiesBody">
        <div class="image-container">
          <img src="${toggledImage ? toggledImage.ImageUrl : './assets/MHRealty/flats for rent in Mumbai-Navi Mumbai.jpg'}" alt="">
          <div class="overlay">
            <button onclick="renderPropertiesRedirection(${x.ID}, ${'true'})">Click for More Info</button>
          </div>
        </div>
        <div class="xyz">
          <h3>${x.SellerName}</h3>
          <p>${x.ShortDiscription || 'No description available'}</p>
        </div>
      </div>
    `;
  }
}
function saveImagesAndVideos(propertyModels) {
  let i = 0;
  propertyModels.forEach(x => {
    let raw = x?.ImageURLType;
    localStorage.setItem(`imageSlider${i}`, JSON.stringify(raw));
    localStorage.setItem(`videoSlider${i}`, x.VideoURL);
    i++;
  })
}
function renderPropertiesRedirection(Id, slider) {
  const propertyIndex = ListofAll.findIndex(property => property.ID === Id);
  window.open(`./property_details.html?pro=${Id}&in=${propertyIndex}&slid=${slider}`, '_blank');
}
let currentPageIndex1 = 0;
let ListofAll1 = [];
async function GetAllResaleProperty() {
  try {
    const response = await fetch(`${apiUrl}/api/v1/partner/GetAllPartnerFeaturedProperty?partnerId=${partnerId}&pageNumber=1&pageSize=500&readyToMove=Yes`);
    const data = await response.json();
    saveImagesAndVideos1(data?.data?.propertyModels);
    ListofAll1 = data?.data?.propertyModels || [];

    const headingsContainerResaleArrows = document.querySelector('.headingsContainerResaleArrows');

    headingsContainerResaleArrows.innerHTML += `<div class="slider-arrows" id="ResalePropertyArrow">
      <button class="slider-arrow" id="prevArrow1" style="
       background: white;
       border-radius: 50%;
       border: 1px solid #CACACA;
       font-size: 30px;
       padding: 5px 16px 8px 15px;
       color: #CACACA;"">&lt;
      </button>
      <button class="slider-arrow" id="nextArrow1" style="
        background: white;
        border-radius: 50%;
        border: 1px solid #CACACA;
        font-size: 30px;
        padding: 5px 16px 8px 15px;
        color: #CACACA;"">&gt;
      </button>
    </div>`;

    const ResalePropertyArrow = document.getElementById('ResalePropertyArrow');
    if (ListofAll1?.length < 9) {
      ResalePropertyArrow.style.display = 'none';
    } else {
      ResalePropertyArrow.style.display = 'block';
    }

    const nextArrow1 = document.getElementById('nextArrow1');
    const prevArrow1 = document.getElementById('prevArrow1');

    // Right arrow click event listener
    nextArrow1.addEventListener('click', () => {
      const totalProperties = data?.data?.propertyModels.length;
      currentPageIndex1 = (currentPageIndex1 + 8) % totalProperties;
      renderProperties1(data);
      nextArrow1.style.color = '#EE5925';
      nextArrow1.style.borderColor = '#CACACA';
      prevArrow1.style.color = '#CACACA';
    });

    // Left arrow click event listener
    prevArrow1.addEventListener('click', () => {
      const totalProperties = data?.data?.propertyModels.length;
      currentPageIndex1 = (currentPageIndex1 - 8 + totalProperties) % totalProperties;
      renderProperties1(data);
      prevArrow1.style.color = '#EE5925';
      prevArrow1.style.borderColor = '#CACACA';
      nextArrow1.style.color = '#CACACA';
    });
    // Initial rendering of properties
    renderProperties1(data);
  } catch (error) {
    console.error(error);
  }
}
function renderProperties1(data) {
  const headingsContainerResaleApi = document.querySelector('.headingsContainerResaleApi');
  headingsContainerResaleApi.innerHTML = '';

  const totalProperties = data?.data?.propertyModels.length;
  const start = currentPageIndex1;
  const end = (currentPageIndex1 + 8) % totalProperties;

  const propertiesToShow = end > start
    ? data?.data?.propertyModels.slice(start, end)
    : [...data?.data?.propertyModels.slice(start), ...data?.data?.propertyModels.slice(0, end)];

  if (data?.data?.propertyModels.length <= 8) {
    // for(z = 0 ; z < propertiesToShow.length; z++){
    // Repeat the single property to fill the space
    for (let i = 0; i < data?.data?.propertyModels.length; i++) {
      const property = propertiesToShow[i];
      const toggledImage = property?.ImageURLType.find(img => img.toggle === true);
      const propertyHtml = `
        <div style="border: 1px solid #D9D9D9;
                    background: #FFF;
                    width: 298px; margin-bottom: 20px;object-fit: cover;"
                    class="popularPropertiesBody"
                    onclick="renderProperties1Redirection(${property?.ID},${'true'})">
          <img src="${toggledImage ? toggledImage.ImageUrl : './assets/MHRealty/flats for rent in Mumbai-Navi Mumbai.jpg'}" style="width: 100%; height: 250px;" alt="">
          <div style="padding-top: 25px;padding-bottom: 25px;padding-left: 15px;padding-right: 15px;">
            <div style="color: #231F20;
                        font-family: 'Nexa Bold';
                        font-size: 22px;
                        font-style: normal;
                        font-weight: 700;
                        line-height: 26px;
                        width: 80%;">
                        ${property.SellerName}
            </div>
            <div style="color: #484848;
                        font-family: 'NexaRegular';
                        font-size: 16px;
                        font-style: normal;
                        font-weight: 400;
                        line-height: 22px;
                        margin-top: 10px;">
                        ${property.ShortDiscription}
            </div>
          </div>
        </div>
      `;
      headingsContainerResaleApi.innerHTML += propertyHtml;
    }
    // }
  } else {
    for (let i = 0; i < propertiesToShow.length; i += 4) {
      const rowProperties = propertiesToShow.slice(i, i + 4);

      const rowHtml = rowProperties.map(x => {
        const toggledImage = x?.ImageURLType.find(img => img.toggle === true);

        return `
          <div style="border: 1px solid #D9D9D9;
                      background: #FFF;
                      width: 298px; margin-bottom: 20px;object-fit: cover;"
                      class="popularPropertiesBody"
                      onclick="renderProperties1Redirection(${x?.ID},${'true'})">
            <img src="${toggledImage ? toggledImage.ImageUrl : './assets/MHRealty/flats for rent in Mumbai-Navi Mumbai.jpg'}" style="width: 100%; height: 250px;" alt="">
            <div style="padding-top: 25px;padding-bottom: 25px;padding-left: 15px;padding-right: 15px;">
              <div style="color: #231F20;
                          font-family: 'Nexa Bold';
                          font-size: 22px;
                          font-style: normal;
                          font-weight: 700;
                          line-height: 26px;
                          width: 80%;">
                          ${x.SellerName}
              </div>
              <div style="color: #484848;
                          font-family: 'NexaRegular';
                          font-size: 16px;
                          font-style: normal;
                          font-weight: 400;
                          line-height: 22px;
                          margin-top: 10px;">
                          ${x.ShortDiscription}
              </div>
            </div>
          </div>
        `;
      }).join('');

      headingsContainerResaleApi.innerHTML += `
        <div class="popularProperties" style="width: 100%;  display: flex; justify-content: space-evenly;">
          ${rowHtml}
        </div>
      `;
    }
  }
}
function saveImagesAndVideos1(propertyModels) {
  let i = 0;
  propertyModels.forEach(x => {
    let raw = x?.ImageURLType;
    localStorage.setItem(`imageResale${i}`, JSON.stringify(raw));
    localStorage.setItem(`videoResale${i}`, x.VideoURL);
    i++;
  })
}
function renderProperties1Redirection(Id, reSale) {
  const propertyIndex = ListofAll1.findIndex(property => property.ID === Id);
  window.open(`./property_details.html?pro=${Id}&in=${propertyIndex}&resale=${reSale}`, '_blank');
}
function toggleNavbar() {
  var navbarLinks = document.getElementById("navbarLinks");
  navbarLinks.classList.toggle("show");

  // Toggle visibility of the toggle and close buttons
  var toggleButton = document.querySelector(".navbar-toggle");
  var closeButton = document.querySelector(".close-button");

  if (navbarLinks.classList.contains("show")) {
    toggleButton.style.display = "none";
    closeButton.style.display = "block";
  } else {
    toggleButton.style.display = "block";
    closeButton.style.display = "none";
  }
}
function closeToggleNavbar() {
  var navbarLinks = document.getElementById("navbarLinks");
  navbarLinks.classList.remove("show");

  // Toggle visibility of the toggle and close buttons
  var toggleButton = document.querySelector(".navbar-toggle");
  var closeButton = document.querySelector(".close-button");

  toggleButton.style.display = "block";
  closeButton.style.display = "none";
}


function imgSliderFeedback() {
  var slider = $('.your-class-feedback');
  slider.slick({
    infinte: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 10000,
    pauseOnFocus: false,
    pauseOnHover: false,
    pauseOnDotsHover: false,
    dots: true,
    nextArrow: '<i class="fa fa-arrow-right clr-gry circle-icon"></i>',
    prevArrow: '<i class="fa fa-arrow-left clr-gry circle-icon"></i>'
  });
  // Add click event handlers to change arrow color
  $('.fa-arrow-right, .fa-arrow-left').on('click', function () {
    $('.fa-arrow-right, .fa-arrow-left').removeClass('active');
    $(this).addClass('active');
  });
}
async function GetAllFeedback() {
  try {
    const response = await fetch(`${apiUrl}/api/v1/partner/PartnerCustomerTestimonial?partnerId=${partnerId}&pageNumber=1&pageSize=100&isWebsite=true`);
    const data = await response.json();
    let i = 0;
    data?.data?.CustomerTestimonialModels.forEach((x) => {
      i++;
      let videoID = x?.VideoURL ? youTubeVideoIdExtractor(x?.VideoURL) : null;
      if (x?.Status !== 3) {
        if (x?.Video) {
          $("#your-class-feedback").append(`
          <div>
            <div style="height: 300px;">
              <iframe src="${videoID}" style="width: 100%; height: 100%; object-fit: cover;"></iframe>
            </div>
            <hr style="border-top: 1px solid #D4D4D4;width: 80%;">
            <div style="text-align: center;">
              <span style="color: #2B2B2B;
                font-family: Nexa-Bold;
                font-size: 22px;
                font-style: normal;
                font-weight: 400;
                line-height: normal;">
                ${x?.CustomerName}
              </span>
            </div>
          </div>
        `);
        } else {
          $("#your-class-feedback").append(`
          <div>
            <div style="color: #2B2B2B;
              font-family: Nexa-Bold;
              font-size: 19.4px;
              font-style: normal;
              font-weight: 400;
              line-height: 28px;
              padding: 0px 50px 50px 40px;
              text-align: justify;">
              ${x?.FeedbackText ? x?.FeedbackText : ''}
            </div>
            <hr style="border-top: 1px solid #D4D4D4; width: 80%;">
            <div class="feedbackImg feedbackImgNewCSS row" style="display: flex; align-items: center; justify-content: space-around; padding: 0px 0px 10px 40px;">
              <div class="col-md-2" style="text-align: center;">
                <span class="feedbackImgBody" style="width: 60px; height: 60px; border-radius: 50%; overflow: hidden; display: inline-block;">
                  <img src="${x?.ImageURL ? x?.ImageURL : 'https://res.cloudinary.com/dncrproperty-com/image/upload/v1735627708/MHRealty/man.webp'}" alt="" style="object-fit: cover; width: 100%; height: 100%; border-radius: 50%;" >
                </span>
              </div>
              <div class="col-md-10 feedbackImgNewCSS" style="text-align: left;">
                <span style="color: #2B2B2B; font-family: Nexa-Bold; font-size: 22px; font-style: normal; font-weight: 400; line-height: normal;">
                ${x?.CustomerName.replace(/ - /, '<br>')}
                </span>
                </span>
              </div>
            </div>
        </div>

        `);
        }
      }
    });

    imgSliderFeedback();
  } catch (error) {
    console.error(error);
  }
}
function openPropertyDetails(element) {
  const pro = element.getAttribute('data-pro');
  const inValue = element.getAttribute('data-in');
  const slid = element.getAttribute('data-slid');

  const isSmallScreen = window.matchMedia("screen and (max-width: 375px)").matches;

  if (isSmallScreen) {
    element.removeAttribute("onclick");
  } else {
    const url = `./property_details.html?pro=${pro}&in=${inValue}&slid=${slid}`;
    window.open(url, '_blank');
  }
}


