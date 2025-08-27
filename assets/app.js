const hmctoken =
  "e74e1523bfaf582757ca621fd6166361a1df604b3c6369383f313fba83baceac";
var bhktypes = [],
  propertytypes = [],
  furnishtypes = [],
  listedBytypes = [],
  isskipCity = false,
  maximumPriceRent = 500000,
  maximumPriceBuy = 50000000;
var ConstantIP = "";
var ConstantFeaturedProperty = "";
var constantVideoID = "";
var partnerId = "info@mhrealty.in";
var domain = "mhrealty.in";

// Execute after the DOM is loaded
document.addEventListener("DOMContentLoaded", loadNavbar);
function loadNavbar() {
  // debugger
  fetch("./navbar.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("navbar-placeholder").innerHTML = data;
      setActiveClass();
    })
    .catch((error) => console.error("Error loading navbar:", error));
}

function setActiveClass() {
  const currentPage = window.location.pathname;
  const navLinks = document.querySelectorAll(
    '#navbar-placeholder a[href]:not([href="#"])'
  );
  const homeLoanButton = document.querySelector(".homeloan-button");
  navLinks.forEach((link) => {
    const linkPage = new URL(link.href, window.location.origin).pathname;
    const orangeLine = link.querySelector(".orange-line");

    if (currentPage === linkPage) {
      link.classList.add("active");
      if (orangeLine) {
        orangeLine.style.transform = "scaleX(1)";
      }
      if (link.textContent.includes("HOME LOAN")) {
        link.classList.remove("active");
        homeLoanButton.classList.add("activate");
      }
    } else {
      link.classList.remove("active");
      if (orangeLine) {
        orangeLine.style.transform = "scaleX(0)";
      }
      if (link.textContent.includes("HOME LOAN")) {
        homeLoanButton.classList.remove("active");
      }
    }
  });
}

// ******  Backend Api  *******

// Live---------
// let apiUrl = 'https://dncrpropertyapi.azurewebsites.net/'
// let apiUrl = 'https://freehostingweb.bsite.net/'
// let apiUrl = "https://mtestatesapi-f0bthnfwbtbxcecu.southindia-01.azurewebsites.net/";
// Live
// let apiUrl ="https://mtestatesapi-f0bthnfwbtbxcecu.southindia-01.azurewebsites.net/";
let apiUrl = "https://api.mtone.in/";

// Dev----------
// let apiUrl =
//   "https://dncrnewapi-bmbfb6f6awd8b0bd.westindia-01.azurewebsites.net/";
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
    xhr.open("GET", url, true);

    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Accept", "application/json, text/plain, */*");
    xhr.setRequestHeader("Authorization", "Bearer " + hmctoken);
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
  return (
    window.location.pathname === "/" ||
    window.location.pathname === "/index.html"
  );
}

window.onload = function () {
  // debugger;
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("pro");
  const img = urlParams.get("img");
  const index = urlParams.get("in");
  const slider = urlParams.get("slid");
  const reSale = urlParams.get("resale");
  const contact = urlParams.get("is");

  if (isInitialPage()) {
    GetAllFeaturedProperty();
    GetAllResaleProperty();
    GetAllFeedback();
    youTubeVideoIdExtractor2();
  }

  if (id) {
    var details;
    fetch(`${apiUrl}partners/properties/${id}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + hmctoken, // <-- token passed here
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        // debugger;
        details = data.data;
        const images = JSON.parse(data.data.imageURL);

        // details.ImageURL = details.ImageURL.split(",");
        document.getElementById("store-images").value = details.imageURL;
        let videoID = data.data.videoURL
          ? youTubeVideoIdExtractor(data.data.videoURL)
          : null;

        let TagList = "";
        if (details.Tags && details.Tags.length > 0) {
          details.Tags.forEach((tagObj) => {
            TagList += tagObj.Tag + " &nbsp;" + " &nbsp;";
          });
        }
        const toggledImage = images.find((img) => img.toggle === true);
        // console.log(toggledImage);

        if (slider === "true") {
          if (images.length > 0) {
            $("#main-card").html(`
            <div>
            ${
              videoID
                ? `<iframe width="300" height="400" src=${videoID} style="width:100%" title="YouTube video player"
              frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen></iframe>`
                : ""
            }
        
            <div class="row">
              <div class="col-md-4">
                <img src=${
                  toggledImage ? toggledImage.imageUrl : images[0].imageUrl
                }
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
                <div class="col-md-12" style=" text-align: justify;">${
                  data.data.longDescription
                }
                </div>
        
                <div class="col-md-12" style="margin-top: 20px;">
                  <div style="display: flex; flex-wrap: wrap;"><b>${TagList}</b>
                  </div>
                </div>
        
                ${
                  data.data.longDescription.length > 1500
                    ? `
                <div class="row col-md-12">
                  <button class="btn btn-success mobileBTN1 mobileBTN2edit1" data-toggle="modal" data-target="#popupimages"
                    onclick="imageslistpopup(${index},${slider},${reSale})">View More Images
                  </button>
                  <a class="btn btn-success position-absolute mobileBTN2 mobileBTN2edit2" href="#" data-toggle="modal"
                    data-target="#modalContact" onclick="openContactModal('BUYER')">Enquire Now
                  </a>
                </div>`
                    : ""
                }
              </div>
            </div>
          </div> `);
          }
        }
        if (reSale === "true") {
          if (details.imageURL.length > 0) {
            $("#main-card").html(`
  <div>
    ${
      videoID
        ? `<iframe width="300" height="400" src=${videoID} style="width:100%" title="YouTube video player"
      frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen></iframe>`
        : ""
    }
      
    <div class="row">
      <div class="col-md-4">
        <img src=${
          toggledImage ? toggledImage.imageUrl : details.imageURL[0].imageUrl
        } style="height: 200px;width:100%;cursor:zoom-in" data-toggle="modal" data-target="#popupimages" onclick="imageslistpopup(${index},${slider},${reSale})">
     
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
        <div class="col-md-12" style=" text-align: justify;">${
          data.data.longDescription
        }
        </div>

        <div class="col-md-12" style="margin-top: 20px;">
          <div style="display: flex; flex-wrap: wrap;"><b>${TagList}</b>
          </div>
        </div> 

        ${
          data.data.longDescription.length > 1500
            ? `
        <div class="row col-md-12">   
          <button class="btn btn-success mobileBTN1 mobileBTN2edit1" data-toggle="modal" data-target="#popupimages" onclick="imageslistpopup(${index},${slider},${reSale})">View More Images
          </button>      
          <a class="btn btn-success position-absolute mobileBTN2 mobileBTN2edit2" href="#" data-toggle="modal" data-target="#modalContact" onclick="openContactModal('BUYER')">Enquire Now
          </a>      
        </div>`
            : ""
        }
    </div>
  </div> `);
          }
        }
      });
  } else if (img) {
    window.localStorage.setItem("image", img);
    showAllImages();
  }
};
function showAllImages(index) {
  let data = window.localStorage.getItem("image").split(",");
  index == undefined ? (index = 0) : (index = index);

  $("#all-images").empty();

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
    z-index: 9999;" onclick="NextImage(${index})">></span></div>`);
  }
}
function viewallImages() {
  var image = document.getElementById("store-images").value.split(",");
  window.open(`./property_images.html?img=${image}`);
}

function NextImage(data) {
  data += 1;
  imagesno = window.localStorage.getItem("image").split(",").length;
  if (data < imagesno) {
    showAllImages(data);
  }
}
function PreviousImage(data) {
  data -= 1;
  imagesno = window.localStorage.getItem("image").split(",").length;
  if (data < imagesno && data > -1) {
    showAllImages(data);
  }
}

function openContactModal(val) {
  val === "BUYER"
    ? (subjectApi = User.BUYER)
    : val === "RENTER"
    ? (subjectApi = User.RENTER)
    : (subjectApi = User.SELLER);
  document.getElementById("invalid-response-getintoucg").style.display = "none";
  document.getElementById("valid-response-getintoucg").style.display = "none";
  document.forms["getinTouchForm"].reset();
  document.getElementById("name-req-getintouch").style.display = "none";
  document.getElementById("email-req-getintouch").style.display = "none";
  document.getElementById("mobile-req-getintouch").style.display = "none";
  document.getElementById("invalidMobileContact").style.display = "none";
  document.getElementById("message-req-getintouch").style.display = "none";
  document.getElementById("CUmessage").classList.remove("required");
  document.getElementById("CUmobile").classList.remove("required");
  document.getElementById("CUemail1").classList.remove("required");
  document.getElementById("CUname").classList.remove("required");
  document.getElementById("notValidEmail11").style.display = "none";
}

async function sendMessageGetinTouchForm() {
  document.getElementById("loaderOverlay").style.display = "flex";

  const message =
    document.forms["getinTouchForm"]["getinTouchFormmessage"].value;
  const emailaddress =
    document.forms["getinTouchForm"]["getinTouchFormemail"].value;
  const subject = subjectApi;
  const name = document.forms["getinTouchForm"]["getinTouchFormname"].value;
  const mobile = document.forms["getinTouchForm"]["getinTouchFormmobile"].value;

  // Original API payload
  const originalPayload = {
    email: emailaddress,
    message: message,
    name: name,
    subject: subject,
    phone: mobile,
    domain: domain,
  };

  // Webhook API payload
  const webhookPayload = {
    name: name,
    phone: mobile,
    email: emailaddress,
    other_fields: {
      message: message,
      subject: subject,
      domain: domain,
    },
  };

  // Validation logic
  let isValid = true;

  if (message == "") {
    document.getElementById("message-req-getintouch").style.display = "block";
    isValid = false;
  }

  if (emailaddress == "") {
    document.getElementById("email-req-getintouch").style.display = "block";
    isValid = false;
  }

  if (name == "") {
    document.getElementById("name-req-getintouch").style.display = "block";
    isValid = false;
  }

  if (mobile == "") {
    document.getElementById("mobile-req-getintouch").style.display = "block";
    document.getElementById("invalidMobileContact").style.display = "none";
    isValid = false;
  } else {
    if (mobile.length !== 10) {
      document.getElementById("invalidMobileContact").style.display = "block";
      document.getElementById("mobile-req-getintouch").style.display = "none";
      isValid = false;
    } else {
      document.getElementById("mobile-req-getintouch").style.display = "none";
      document.getElementById("invalidMobileContact").style.display = "none";
    }
  }

  const reg = /\S+@\S+\.\S+/;
  const emailIsValid = reg.test(originalPayload?.email);

  if (!emailIsValid && originalPayload?.email !== "") {
    isValid = false;
  }

  if (
    originalPayload?.email !== "" &&
    originalPayload?.message !== "" &&
    originalPayload?.name !== "" &&
    originalPayload?.phone !== "" &&
    originalPayload?.phone?.length == 10 &&
    emailIsValid &&
    isValid
  ) {
    try {
      // Create both API requests
      const originalApiRequest = fetch(`${apiUrl}properties/GetInTouch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
          Authorization: "Bearer " + hmctoken,
        },
        body: JSON.stringify(originalPayload),
      });

      const webhookApiRequest = fetch(
        `${apiUrl}partners/webhook-addclient?partnerId=kWRbUj6d9B3kGpudbgXcHLgHkKU1I-lcJ2z240SCZPFN5dspkoQlLxfegFnVBePc&sourceName=Website Enquiry`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json, text/plain, */*",
          },
          body: JSON.stringify(webhookPayload),
        }
      );

      // Execute both requests simultaneously
      const [originalResponse, webhookResponse] = await Promise.all([
        originalApiRequest,
        webhookApiRequest,
      ]);

      document.getElementById("loaderOverlay").style.display = "none";

      // Handle original API response (primary response for UI feedback)
      if (originalResponse.ok) {
        const json_data = await originalResponse.json();

        if (json_data.success) {
          document.getElementById("valid-response-getintoucg").style.display =
            "flex";
          document.forms["getinTouchForm"].reset();
          grecaptcha.reset();
          document.getElementById("modalContact").style.display = "block";

          // Log webhook response status for debugging
          if (!webhookResponse.ok) {
            console.warn(
              "Webhook API failed:",
              webhookResponse.status,
              webhookResponse.statusText
            );
          } else {
            console.log("Both APIs called successfully");
          }
        } else {
          document.getElementById("invalid-response-getintoucg").style.display =
            "flex";
        }
      } else {
        // Handle HTTP error status codes
        document.getElementById("invalid-response-getintoucg").style.display =
          "flex";
        console.error(
          "Original API Error:",
          originalResponse.status,
          originalResponse.statusText
        );

        // Log webhook response status
        if (!webhookResponse.ok) {
          console.error(
            "Webhook API Error:",
            webhookResponse.status,
            webhookResponse.statusText
          );
        }
      }
    } catch (error) {
      // Handle network errors or other exceptions
      document.getElementById("loaderOverlay").style.display = "none";
      document.getElementById("invalid-response-getintoucg").style.display =
        "flex";
      console.error("API Fetch Error:", error);
    }
  } else {
    // If validation fails, hide loader
    document.getElementById("loaderOverlay").style.display = "none";
  }
}

function emailCheck(email, isLogin) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", `${apiUrl}/api/v1/User/varifyUserbyEmail?email=${email}`);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Accept", "application/json, text/plain, */*");
  xhr.setRequestHeader("Authorization", "Bearer " + hmctoken);
  xhr.send();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        var json_data = JSON.parse(xhr?.responseText);
        if (json_data.Success == true) {
          if (isLogin == false) {
            document.getElementById("emailalreadyexist").style.display =
              "block";
            document.getElementById("btn-signup").disabled = true;
          }
          if (isLogin == true) {
            document.getElementById("emaildoesnotexist-login").style.display =
              "none";
          } else {
            document.getElementById("sellbuyemailalreadyexist").style.display =
              "block";
          }
        } else {
          if (isLogin == true) {
            document.getElementById("emaildoesnotexist-login").style.display =
              "block";
            // document.getElementById("nextStepButton").disabled = true;
          }
          if (isLogin == false) {
            document.getElementById("emailalreadyexist").style.display = "none";
            if (document.getElementById("accpectance").checked) {
              document.getElementById("btn-signup").disabled = false;
            }
          } else {
            document.getElementById("sellbuyemailalreadyexist").style.display =
              "none";
          }
        }
      }
    }
  };
}
function openDetails() {
  window.href = "/prop-details.html";
}
const User = Object.freeze({
  RENTER: "MHRealty : Tenant enquiry",
  BUYER: "MHRealty : Buyer enquiry",
  SELLER: "MHRealty : Owner enquiry",
});
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
  var message, name, emailaddress, mobileno;
  message = document.forms["getinTouchForm"]["getinTouchFormmessage"].value;
  emailaddress = document.forms["getinTouchForm"]["getinTouchFormemail"].value;
  name = document.forms["getinTouchForm"]["getinTouchFormname"].value;
  mobileno = document.forms["getinTouchForm"]["getinTouchFormname"].value;
  if (message != "") {
    document.getElementById("message-req-getintouch").style.display = "none";
  }
  if (emailaddress != "") {
    document.getElementById("email-req-getintouch").style.display = "none";
  }
  if (name != "") {
    document.getElementById("name-req-getintouch").style.display = "none";
  }
  if (mobileno != "") {
    document.getElementById("name-req-getintouch").style.display = "none";
  }
  if (mobileno.length != 10) {
    document.getElementById("invalidMobileContact").style.display = "none";
  }
}
function removeValidation(isemailchanging) {
  let email = document.forms["loginForm"]["Email"].value;
  if (email !== "" && isemailchanging === true) {
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
  if (email != "") {
    document.getElementById("contactemail").style.display = "none";
  }
  const reg = /\S+@\S+\.\S+/;
  var isvalid = reg.test(email);
  if (isvalid) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", `${apiUrl}/account/check-email?email=${email}`);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Accept", "application/json, text/plain, */*");
    xhr.setRequestHeader("Authorization", "Bearer " + hmctoken);
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
              localStorage.setItem("userid", user.ID);
            }
          } else {
            // document.getElementById("sellalreadyregistered").style.display = "none";
            document.getElementById("invalidresponecontact").style.display =
              "none";
            document.getElementById("alreadycontactedProperty").style.display =
              "none";
            document.getElementById("validresponecontact").style.display =
              "none";
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
  // debugger;
  document.querySelector("body").setAttribute("style", "overflow:visible");
  let photos;
  let video;
  if (slider) {
    // debugger
    photos = JSON.parse(localStorage.getItem(`imageSlider${index}`));
    video = localStorage.getItem(`videoSlider${index}`);
  }
  if (resale) {
    photos = JSON.parse(
      JSON.parse(localStorage.getItem(`imageResale${index}`))
    );
    video = localStorage.getItem(`videoResale${index}`);
  }
  let imgtype = [];
  let images = [];
  console.log(photos);

  photos.forEach((im) => {
    if (!imgtype.includes(im.type)) {
      imgtype.push(im.type);
    }
  });
  for (var i = 0; i < 2; i++) {
    if (photos.length > i) {
      images.push(photos[i]);
    }
  }
  if (video) {
    if (!imgtype.includes("Video")) {
      imgtype.push("Video");
    }
  }
  if (images.length == 1 && video) {
    let obj = new Object();
    obj.imageURL = video;
    obj.Type = "Video";
    images.push(obj);
  }
  // remove tab
  $("#popup-tab").empty();
  //remove image dom
  $("#show-image").empty();
  imgtype.forEach((type) => {
    if (images[0].type == type) {
      $("#popup-tab").append(
        `<a class="nav-link" style="color: white;cursor: pointer; border-bottom: 1px solid white;" onclick="imagetabb('${index}','${type}')">${type}</a>`
      );
    } else {
      $("#popup-tab").append(
        `<a class="nav-link" style="color: white;cursor: pointer;" onclick="imagetabb('${index}','${type}')">${type}</a>`
      );
    }
  });

  if (images.length > 1) {
    $("#next-photo").append(
      `<span id="next-btn" style="color: white;font-size: 50px;position: absolute;right: 0;top: 40%;cursor: pointer;z-index:100" onclick="nextimagearrow(${index},${1})">></span>`
    );
  }
  for (var i = 0; i < 2; i++) {
    if (images[i].Type != "Video") {
      if (i == 0) {
        $("#show-image").append(
          `<img class="image-size" src="${images[i].imageUrl}" + data-toggle="modal" data-target="#zoomModal" + onclick="openzoomimages('${images[i].imageUrl}','${images[i].type}')" + style="margin-left:400px;"><br><span style="position:absolute;top:450px;color: white;z-index: 10;left: 30%;">${images[i].type}</span>`
        );
      } else {
        if (images.length > i) {
          $("#show-image").append(
            `<img class="ml-4 image-size" src="${images[i].imageUrl}" + data-toggle="modal" + data-target="#zoomModal" + onclick="openzoomimages('${images[i].imageUrl}','${images[i].type}')" + style="filter:blur(2px)"><span style="top:450px;position: absolute;bottom: 0px;color: white;z-index: 10;right: 30%;">${images[i].type}</span>`
          );
        }
      }
    } else {
      const videoID = youTubeVideoIdExtractor(images[i].imageURL);
      $("#show-image").append(
        `<div class="col-4 position-relative"><iframe width="206" src="${videoID}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" style="height: 100%;width:100%;margin-left: 10px;"  allowfullscreen></iframe><span class="video-text">${images[i].type}</span></div>`
      );
    }
  }
}
function nextimagearrow(propertyindex, imageindex) {
  // debugger;
  const urlParams = new URLSearchParams(window.location.search);
  const slider = urlParams.get("slid");
  const reSale = urlParams.get("resale");
  let images;
  let video;
  if (slider == "true") {
    images = JSON.parse(localStorage.getItem(`imageSlider${propertyindex}`));
    video = localStorage.getItem(`videoSlider${propertyindex}`);
  }
  if (reSale == "true") {
    images = JSON.parse(
      JSON.parse(localStorage.getItem(`imageResale${propertyindex}`))
    );
    video = localStorage.getItem(`videoResale${propertyindex}`);
  }
  if (video) {
    let obj = new Object();
    obj.imageUrl = video;
    obj.type = "Video";
    images.push(obj);
  }
  let imgtype = [];
  images.forEach((im) => {
    if (!imgtype.includes(im.type)) {
      imgtype.push(im.type);
    }
  });
  if (video) {
    if (!imgtype.includes("Video")) {
      imgtype.push("Video");
    }
  }
  // remove tab
  $("#popup-tab").empty();
  //  remove imagedom
  $("#show-image").empty();
  //remove next arrow
  $("#next-photo").empty();
  //remove previous arrow
  $("#previous-photo").empty();
  if (images?.length > imageindex + 1) {
    $("#next-photo").append(
      `<span id="next-btn" style="color: white;font-size: 50px;position: absolute;right: 0;top: 40%;cursor: pointer;z-index:100"  onclick="nextimagearrow(${propertyindex},${
        imageindex + 1
      })">></span>`
    );
  }
  if (imageindex > 0) {
    $("#previous-photo").append(
      `<span id="next-btn" style="color: white;font-size: 50px;position: absolute;left: 0;top: 40%;cursor: pointer;z-index:100" onclick="nextimagearrow(${propertyindex},${
        imageindex - 1
      })"><</span>`
    );
  }
  imgtype.forEach((type) => {
    if (images[imageindex]?.type == type) {
      $("#popup-tab").append(
        `<a class="nav-link" style="color: white;cursor: pointer; border-bottom: 1px solid white;" onclick="imagetabb('${propertyindex}','${type}')">${type}</a>`
      );
    } else {
      $("#popup-tab").append(
        `<a class="nav-link" style="color: white;cursor: pointer;" onclick="imagetabb('${propertyindex}','${type}')">${type}</a>`
      );
    }
  });
  if (imageindex > 0) {
    for (var i = imageindex - 1; i < imageindex + 2; i++) {
      if (images[i]?.type !== "Video") {
        if (i == imageindex) {
          $("#show-image").append(
            `<div class="col-4" data-toggle="modal" data-target="#zoomModal"><img src="${images[i]?.imageUrl}" class="image-size" style="width:100%" + onclick="openzoomimages('${images[i]?.imageUrl}','${images[i]?.type}')" + ><span style="position: absolute;top:360px;color: white;z-index: 10;left: 40%;">${images[i].type}</span></div>`
          );
        } else {
          $("#show-image").append(
            `<div class="col-4" data-toggle="modal" data-target="#zoomModal"><img src="${images[i]?.imageUrl}" class="image-size"  style="width:100%;filter:blur(2px)" + onclick="openzoomimages('${images[i]?.imageUrl}','${images[i]?.type}')" + ><span style="position: absolute;top:360px;color: white;z-index: 10;left: 40%;">${images[i].type}</span></div>`
          );
        }
      } else {
        const videoID = youTubeVideoIdExtractor(images[i]?.imageUrl);
        $("#show-image").append(
          `<div class="col-4 position-relative"><iframe width="206" src="${videoID}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" style="height: 100%;width:100%;margin-left: 10px;"  allowfullscreen></iframe><span class="video-text">${images[i].type}</span></div>`
        );
      }
    }
  } else {
    for (var i = imageindex; i < imageindex + 2; i++) {
      if (images[i]?.type !== "Video") {
        if (i == imageindex) {
          $("#show-image")
            .append(`<img  src="${images[i]?.imageUrl}" + data-toggle="modal" data-target="#zoomModal" + onclick="openzoomimages('${images[i]?.imageUrl}','${images[i]?.type}')" + class="image-size" style="margin-left:400px;">
          <span style="position: absolute;top:450px;color: white;z-index: 10;left: 40%;">${images[i]?.type}</span>`);
        } else {
          $("#show-image")
            .append(`<img  src="${images[i]?.imageUrl}" + data-toggle="modal" + data-target="#zoomModal" + onclick="openzoomimages('${images[i]?.imageUrl}','${images[i]?.type}')" + class="image-size ml-4" style="filter:blur(2px)">
        <span style="position: absolute;top:450px;color: white;z-index: 10;right: 20%;">${images[i]?.type}</span>`);
        }
      } else {
        const videoID = youTubeVideoIdExtractor(images[i]?.imageUrl);
        $("#show-image").append(
          `<div class="col-4 position-relative"><iframe width="206" src="${videoID}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" style="height: 100%;width:100%;margin-left: 10px;"  allowfullscreen></iframe><span class="video-text">${images[i].type}</span></div>`
        );
      }
    }
  }
}
function imagetabb(propindex, type) {
  const urlParams = new URLSearchParams(window.location.search);
  const slider = urlParams.get("slid");
  const reSale = urlParams.get("resale");
  let images;
  let video;
  if (slider == "true") {
    images = JSON.parse(localStorage.getItem(`imageSlider${propindex}`));
    video = localStorage.getItem(`videoSlider${propindex}`);
  }
  if (reSale == "true") {
    images = JSON.parse(
      JSON.parse(localStorage.getItem(`imageResale${propindex}`))
    );
    video = localStorage.getItem(`videoResale${propindex}`);
  }
  let filterimage = [];
  let imgtype = [];
  let index = images.findIndex((x) => x.type == type);
  images.forEach((im) => {
    if (!imgtype.includes(im.type)) {
      imgtype.push(im.type);
    }
  });
  if (video) {
    if (!imgtype.includes("Video")) {
      imgtype.push("Video");
    }
  }
  if (video) {
    let obj = new Object();
    obj.imageURL = video;
    obj.Type = "Video";
    images.push(obj);
  }
  // remove tab
  $("#popup-tab").empty();
  //remove image dom
  $("#show-image").empty();
  //remove next arrow
  $("#next-photo").empty();
  //remove previous arrow
  $("#previous-photo").empty();
  // next button
  if (images.length > index + 1 && type != "Video") {
    $("#next-photo").append(
      `<span id="next-btn" style="color: white;font-size: 50px;position: absolute;right: 0;top: 40%;cursor: pointer;z-index:100"  onclick="nextimagearrow(${propindex},${
        index + 1
      })">></span>`
    );
  }
  //previous button
  if (index > 0) {
    $("#previous-photo").append(
      `<span id="next-btn" style="color: white;font-size: 50px;position: absolute;left: 0;top: 40%;cursor: pointer;z-index:100" onclick="nextimagearrow(${propindex},${
        index - 1
      })"><</span>`
    );
  }
  //tab
  console.log("********88", imgtype, type);

  imgtype.forEach((type1) => {
    if (type == type1) {
      $("#popup-tab").append(
        `<a class="nav-link" style="color: white;cursor: pointer; border-bottom: 1px solid white;" onclick="imagetabb('${propindex}','${type1}')">${type1}</a>`
      );
    } else {
      $("#popup-tab").append(
        `<a class="nav-link" style="color: white;cursor: pointer;" onclick="imagetabb('${propindex}','${type1}')">${type1}</a>`
      );
    }
  });
  if (type == "Video") {
    const videoID = youTubeVideoIdExtractor(video);
    $("#show-image").append(
      `<div class="col-4 position-relative"><iframe width="206" src="${videoID}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" style="width: 100%;height: 400px;" allowfullscreen></iframe><span class="video-text"></span></div>`
    );
  } else {
    if (index == 0) {
      for (var i = index; i < index + 2; i++) {
        if (images[i].Type != "Video") {
          if (i == 0) {
            $("#show-image").append(
              `<div class="col-4"></div><div class="col-4 "><img  src="${images[i].imageUrl}" + data-toggle="modal" data-target="#zoomModal" + onclick="openzoomimages('${images[i].imageUrl}','${images[i].type}')" style="width:100%" class="image-size"></div><span style="position: absolute;top: 440px;color: white;z-index: 10;left: 40%;">${images[i].type}</span>`
            );
          } else {
            $("#show-image").append(
              `<div class="col-4" data-toggle="modal" data-target="#zoomModal"><img src="${images[i].imageUrl}" style="width:100%;filter:blur(2px);"  class="image-size"+ onclick="openzoomimages('${images[i].imageUrl}','${images[i].type}')" +><span style="position: absolute;color: white;z-index: 10;top: 440px;left:40%">${images[i].type}</span></div>`
            );
          }
        } else {
          const videoID = youTubeVideoIdExtractor(video);
          $("#show-image").append(
            `<div class="col-4 position-relative"><iframe width="206" src="${videoID}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" style="width: 400px;height: 400px" allowfullscreen></iframe><span class="video-text">${images[i].type}</span></div>`
          );
        }
      }
    } else {
      for (var i = index - 1; i < index + 2; i++) {
        if (images[i].type != "Video") {
          if (i == index) {
            $("#show-image").append(
              `<div class="col-4" data-toggle="modal" data-target="#zoomModal"><img src="${images[i].imageUrl}" class="image-size" style="width:100%;" + onclick="openzoomimages('${images[i].imageUrl}','${images[i].type}')" +><span style="position: absolute;top:350px;left:40%;color: white;z-index: 10">${images[i].type}</span></div>`
            );
          } else {
            $("#show-image").append(
              `<div class="col-4" data-toggle="modal" data-target="#zoomModal"><img src="${images[i].imageUrl}" class="image-size" style="width:100%;filter:blur(2px)" + onclick="openzoomimages('${images[i].imageUrl}','${images[i].type}')" +><span style="position: absolute;color: white;z-index: 10;top:350px;left:40%;">${images[i].type}</span></div>`
            );
          }
        } else {
          const videoID = youTubeVideoIdExtractor(video);
          $("#show-image").append(
            `<div class="col-4 position-relative"><iframe width="206" src="${videoID}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" style="width: 100%;" class="image-size" allowfullscreen></iframe><span class="video-text">${images[i].type}</span></div>`
          );
        }
      }
    }
  }
}
function zoomimages() {
  let id = document.getElementById("zoom-img").style.transform;
  let ind = id.indexOf(".");
  let val = id.substr(ind - 1, ind + 1);
  let val1 = parseFloat(val) + 0.5;
  let scale = `scale(${val1})`;
  document.getElementById("zoom-img").style.transform = scale;
}

function openzoomimages(url, img) {
  document.getElementById("imagetag").innerHTML = img;
  $("#zoomimage").empty();
  $("#zoomimage").append(
    `<div  style="cursor:zoom-in;width:100%;height:400px;transform: scale(.6)" onclick="zoomin()" id="zoom-img">`
  );
  document
    .querySelector("#zoom-img")
    .setAttribute(
      "style",
      `background-image:url(${url});width:600px;height:400px;background-repeat: no-repeat;background-size:cover;cursor:zoom-in;transform: scale(.6)`
    );
  const el = document.querySelector("#zoom-img");

  el.addEventListener("mousemove", (e) => {
    el.style.backgroundPositionX = -e.offsetX + 200 + "px";
    el.style.backgroundPositionY = -e.offsetY + 200 + "px";
  });
  // $('#zoomimage').append(`<img src="${url}" class="img-responsive" style="cursor:zoom-in;transform: scale(.6);width:500px" onclick="zoomin()" id="zoom-img">`)
}

function zoomin() {
  let id = document.getElementById("zoom-img").style.transform;
  let ind = id.indexOf(".");
  let val = id.substr(ind - 1, ind + 1);
  let val1 = parseFloat(val) + 0.3;
  let scale = `scale(${val1})`;
  document.getElementById("zoom-img").style.transform = scale;
}

function zoomout() {
  let id = document.getElementById("zoom-img").style.transform;
  let ind = id.indexOf(".");
  let val = id.substr(ind - 1, ind + 1);
  let val1 = parseFloat(val) - 0.3;
  let scale = `scale(${val1})`;
  document.getElementById("zoom-img").style.transform = scale;
}

function reset() {
  document.getElementById("zoom-img").style.transform = "scale(0.6)";
}

function youTubeVideoIdExtractor(url) {
  // debugger;
  const params = url;
  const splitedURL = params.split("/");
  let videoID = splitedURL[splitedURL.length - 1];
  if (videoID.includes("watch?v=")) {
    videoID = videoID.replace("watch?v=", "");
  }
  videoID = `https://www.youtube.com/embed/${videoID}?autoplay=0&mute=1`;
  return videoID;
}
async function youTubeVideoIdExtractor2() {
  const params = "https://youtu.be/YZWhTCO-0-g?si=5kxMYK_b2S11RBpT";
  const splitedURL = params.split("/");
  let videoID = splitedURL[splitedURL.length - 1];
  if (videoID.includes("watch?v=")) {
    videoID = videoID.replace("watch?v=", "");
  }
  constantVideoID = `https://www.youtube.com/embed/${videoID}?autoplay=0&mute=1`;
  const iframe = document.getElementById("videoFrame");
  iframe.src = constantVideoID;
}

function addRequired(id) {
  let data = document.getElementById(id);
  if (data?.value === "") {
    data.classList.add("required");
  }
}

function isNumberValid(id, textID) {
  let data = document.getElementById(id).value;
  if (data !== "") {
    if (data?.length !== 10) {
      document.getElementById(textID).style.display = "block";
    } else {
      document.getElementById(textID).style.display = "none";
    }
  }
}

function isValidEmail(id, textID) {
  let email = document.getElementById(id).value;
  const reg = /\S+@\S+\.\S+/;
  if (email !== "") {
    var isvalid = reg.test(email);
    isvalid
      ? (document.getElementById(textID).style.display = "none")
      : (document.getElementById(textID).style.display = "block");
  }
  // if (isvalid) {
  //   emailVerify(email, textID);
  // }
}

function emailVerify(email, textID) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", `${apiUrl}/account/check-email?email=${email}`);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Accept", "application/json, text/plain, */*");
  xhr.setRequestHeader("Authorization", "Bearer " + hmctoken);
  xhr.send();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        var json_data = JSON.parse(xhr?.responseText);
        if (json_data.Success == true) {
          document.getElementById(textID).style.display = "none";
        } else {
          document.getElementById(textID).style.display = "block";
        }
      }
    }
  };
}

function removeValid(textID) {
  document.getElementById(textID).style.display = "none";
}

function contactEmail() {
  let email = document.forms["buysellForm"]["buysellForm"].value;
  if (
    document.forms["buysellForm"]["buysellEmail"].value !== "" &&
    isemailfield == true
  ) {
    const reg = /\S+@\S+\.\S+/;
    var isvalid = reg.test(email);
    if (isvalid) {
      emailCheckContact(email);
    }
  }
}

function emailCheckContact(email) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", `${apiUrl}account/check-email?email=${email}`);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Accept", "application/json, text/plain, */*");
  xhr.send();
  xhr.onreadystatechange = function () {
    if (xhr?.readyState == 4) {
      if (xhr?.status == 200) {
        var json_data = JSON.parse(xhr?.responseText);
        if (json_data.Success == true) {
          document.getElementById("sellbuyemailalreadyexist").style.display =
            "block";
        } else {
          document.getElementById("sellbuyemailalreadyexist").style.display =
            "none";
        }
      }
    }
  };
}
let currentPageIndex = 0;
let ListofAll = [];
async function GetAllFeaturedProperty() {
  try {
    const emailDomain = "mhrealty.in";
    // const emailDomain = "yopmail.com";

    const response = await fetch(
      `${apiUrl}partners/properties/featured?emailDomain=${emailDomain}&pageNumber=1&pageSize=500&isFeatured=true`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + hmctoken,
        },
      }
    );
    const data = await response.json();
    const properties = data?.data?.properties || [];
    saveImagesAndVideos(properties);
    ListofAll = properties;

    const headingsContainerArrows = document.querySelector(
      ".headingsContainerArrows"
    );

    // Only show arrows if there are more than 4 properties
    if (properties.length > 4) {
      headingsContainerArrows.innerHTML = `
        <div class="slider-arrows" id="FeaturedPropertyArrow">
          <button class="slider-arrowLeft" id="prevArrow" style="display: none;background: white; border-radius: 50%; border: 1px solid #CACACA; font-size: 30px; padding: 5px 16px 8px 15px; color: #CACACA;">&lt;</button>
          <button class="slider-arrowRight" id="nextArrow" style="background: white; border-radius: 50%; border: 1px solid #CACACA; font-size: 30px; padding: 5px 16px 8px 15px; color: #CACACA;">&gt;</button>
        </div>
      `;

      const nextArrow = document.getElementById("nextArrow");
      const prevArrow = document.getElementById("prevArrow");

      nextArrow.addEventListener("click", () => {
        if (currentPageIndex + 4 < properties.length) {
          currentPageIndex += 4;
          renderProperties({ data: { properties } });
        }
      });

      prevArrow.addEventListener("click", () => {
        if (currentPageIndex > 0) {
          currentPageIndex -= 4;
          renderProperties({ data: { properties } });
        }
      });
    }

    renderProperties({ data: { properties } });
  } catch (error) {
    console.error(error);
  }
}
function renderProperties(data) {
  const headingsContainerApi = document.querySelector(".headingsContainerApi");
  const properties = data?.data?.properties || [];

  // Get only 4 properties starting from currentPageIndex
  const visibleProperties = properties.slice(
    currentPageIndex,
    currentPageIndex + 4
  );

  headingsContainerApi.innerHTML = '<div class="properties-grid">';

  // Only render the visible properties
  visibleProperties.forEach((property) => {
    const images = JSON.parse(property.imageURL);
    const toggledImage = images.find((img) => img.toggle === true);
    const defaultImage =
      "https://res.cloudinary.com/dncrproperty-com/image/upload/v1735627708/MHRealty/flats%20for%20rent%20in%20Mumbai-Navi%20Mumbai.webp";

    // const tempDiv = document.createElement("div");
    // tempDiv.innerHTML = property.shortDescription;
    // const cleanDescription = tempDiv.textContent || tempDiv.innerText;

    headingsContainerApi.querySelector(".properties-grid").innerHTML += `
      <div class="popularPropertiesBody">
        <div class="image-container">
          <img src="${
            toggledImage ? toggledImage.imageUrl : defaultImage
          }" alt="${property.propertyName}">
          <div class="overlay" onclick="renderProperties1Redirection(${
            property.id
          }, true)">
            <button onclick="renderPropertiesRedirection(${
              property.id
            }, true)">Click for More Info</button>
          </div>
        </div>
        <div class="xyz" onclick="renderPropertiesRedirection(${
          property.id
        }, true)">
          <h3>${property.propertyName}</h3>
          <div class="property-description">${property.shortDescription}</div>
          <div class="property-details">
          </div>
        </div>
      </div>
    `;
  });

  headingsContainerApi.innerHTML += "</div>";

  // Update arrow visibility
  const nextArrow = document.getElementById("nextArrow");
  const prevArrow = document.getElementById("prevArrow");

  if (nextArrow && prevArrow) {
    prevArrow.style.display = currentPageIndex === 0 ? "none" : "inline-block";
    nextArrow.style.display =
      currentPageIndex + 4 >= properties.length ? "none" : "inline-block";
  }
}
function saveImagesAndVideos(properties) {
  properties.forEach((property, i) => {
    const images = JSON.parse(property.imageURL);
    localStorage.setItem(`imageSlider${i}`, JSON.stringify(images));
    localStorage.setItem(`videoSlider${i}`, property.videoURL || "");
  });
}
function renderPropertiesRedirection(id, slider) {
  const propertyIndex = ListofAll.findIndex((property) => property.id === id);
  console.log(id, slider, ListofAll);
  window.open(
    `./property_details.html?pro=${id}&in=${propertyIndex}&slid=${slider}`,
    "_blank"
  );
}
let currentPageIndex1 = 0;
let ListofAll1 = [];
async function GetAllResaleProperty() {
  // debugger;
  try {
    const response = await fetch(
      `${apiUrl}partners/properties/featured?emailDomain=mhrealty.in&pageNumber=1&pageSize=500&readyToMove=yes`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + hmctoken,
        },
      }
    );
    const data = await response.json();
    const properties = data?.data?.properties || [];
    saveImagesAndVideos1(properties);
    ListofAll1 = properties;

    const headingsContainerResaleArrows = document.querySelector(
      ".headingsContainerResaleArrows"
    );

    // Only show arrows if there are more than 4 properties
    if (properties.length > 4) {
      headingsContainerResaleArrows.innerHTML = `
        <div class="slider-arrows" id="ResalePropertyArrow">
          <button class="slider-arrowLeft" id="prevArrowResale" style="display: none; background: white; border-radius: 50%; border: 1px solid #CACACA; font-size: 30px; padding: 5px 16px 8px 15px; color: #CACACA;">&lt;</button>
          <button class="slider-arrowRight" id="nextArrowResale" style="background: white; border-radius: 50%; border: 1px solid #CACACA; font-size: 30px; padding: 5px 16px 8px 15px; color: #CACACA;">&gt;</button>
        </div>
      `;

      const nextArrow = document.getElementById("nextArrowResale");
      const prevArrow = document.getElementById("prevArrowResale");

      nextArrow.addEventListener("click", () => {
        if (currentPageIndex1 + 4 < properties.length) {
          currentPageIndex1 += 4;
          renderProperties1({ data: { properties } });
        }
      });

      prevArrow.addEventListener("click", () => {
        if (currentPageIndex1 > 0) {
          currentPageIndex1 -= 4;
          renderProperties1({ data: { properties } });
        }
      });
    }

    renderProperties1({ data: { properties } });
  } catch (error) {
    console.error(error);
  }
}

function renderProperties1(data) {
  const headingsContainerResaleApi = document.querySelector(
    ".headingsContainerResaleApi"
  );
  const properties = data?.data?.properties || [];

  const visibleProperties = properties.slice(
    currentPageIndex1,
    currentPageIndex1 + 4
  );

  headingsContainerResaleApi.innerHTML = '<div class="properties-grid">';

  visibleProperties.forEach((property) => {
    const images = JSON.parse(property.imageURL);
    const toggledImage = images.find((img) => img.toggle === true);
    const defaultImage =
      "https://res.cloudinary.com/dncrproperty-com/image/upload/v1735627708/MHRealty/flats%20for%20rent%20in%20Mumbai-Navi%20Mumbai.webp";

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = property.shortDescription || "";
    const cleanDescription = tempDiv.textContent || tempDiv.innerText;

    headingsContainerResaleApi.querySelector(".properties-grid").innerHTML += `
      <div class="popularPropertiesBody">
        <div class="image-container">
          <img src="${
            toggledImage ? toggledImage.imageUrl : defaultImage
          }" alt="${property.propertyName}">
          <div class="overlay" onclick="renderProperties1Redirection(${
            property.id
          }, true)">
            <button onclick="renderProperties1Redirection(${
              property.id
            }, true)">Click for More Info</button>
          </div>
        </div>
        <div class="xyz" class="xyz" onclick="renderPropertiesRedirection(${
          property.id
        }, true)">
          <h3 class="property-title">${property.propertyName}</h3>
          <div class="property-description">${property.shortDescription}</div>
          <div class="property-details">
            
          </div>
        </div>
      </div>
    `;
  });

  headingsContainerResaleApi.innerHTML += "</div>";

  // Update arrow visibility
  const nextArrow = document.getElementById("nextArrowResale");
  const prevArrow = document.getElementById("prevArrowResale");

  if (nextArrow && prevArrow) {
    prevArrow.style.display = currentPageIndex1 === 0 ? "none" : "inline-block";
    nextArrow.style.display =
      currentPageIndex1 + 4 >= properties.length ? "none" : "inline-block";
  }
}
function saveImagesAndVideos1(propertyModels) {
  let i = 0;
  propertyModels.forEach((x) => {
    let raw = x?.imageURL;
    localStorage.setItem(`imageResale${i}`, JSON.stringify(raw));
    localStorage.setItem(`videoResale${i}`, x.videoURL);
    i++;
  });
}
function renderProperties1Redirection(id, reSale) {
  // debugger;
  const propertyIndex = ListofAll1.findIndex((property) => property.id === id);
  window.open(
    `./property_details.html?pro=${id}&in=${propertyIndex}&resale=${reSale}`,
    "_blank"
  );
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
  var slider = $(".your-class-feedback");
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
    prevArrow: '<i class="fa fa-arrow-left clr-gry circle-icon"></i>',
  });
  // Add click event handlers to change arrow color
  $(".fa-arrow-right, .fa-arrow-left").on("click", function () {
    $(".fa-arrow-right, .fa-arrow-left").removeClass("active");
    $(this).addClass("active");
  });
}
async function GetAllFeedback() {
  try {
    const response = await fetch(
      `${apiUrl}testimonials/by-createdby?createdBy=info@mhrealty.in&pageNumber=1&pageSize=100&isWebsite=true`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + hmctoken,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    let i = 0;
    data?.data?.testimonials.forEach((x) => {
      i++;
      let videoID = x?.videoURL ? youTubeVideoIdExtractor(x?.VideoURL) : null;
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
                ${x?.customerName}
              </span>
            </div>
          </div>
        `);
        } else {
          $("#your-class-feedback").append(`
      <div style="max-width: 100%; padding: 0 20px; box-sizing: border-box;">
  <div style="color: #2B2B2B; font-family: 'Nexa-Bold', sans-serif; font-size: clamp(16px, 4vw, 18px); font-style: normal; font-weight: 400; line-height: 1.5; padding: 0 5% 30px 5%; text-align: justify;">
    ${x?.feedbackText ? x?.feedbackText : ""}
  </div>
  <hr style="border-top: 1px solid #D4D4D4; width: 60%; margin: 0 auto 20px;">
  <div class="feedbackImg feedbackImgNewCSS" style="display: flex; width: 100%; max-width: 80%; margin: 0 auto; gap: 20px; align-items: center; justify-content: flex-start; padding: 0 0 10px 5%; box-sizing: border-box;">
    <div style="flex: 0 0 auto; text-align: center;">
      <span style="width: clamp(80px, 15vw, 100px); height: clamp(80px, 15vw, 100px); border: 4px solid #09898A; border-radius: 50%; overflow: hidden; display: inline-block;">
        <img src="${
          x?.imageURL
            ? x?.imageURL
            : "https://res.cloudinary.com/dncrproperty-com/image/upload/v1735627708/MHRealty/man.webp"
        }" alt="Customer Image" style="object-fit: cover; width: 100%; height: 100%; border-radius: 50%;">
      </span>
    </div>
    <div style="flex: 1; text-align: left;">
      <span style="color: #2B2B2B; font-family: 'Nexa-Bold', sans-serif; font-size: clamp(18px, 5vw, 20px); font-style: normal; font-weight: 400; line-height: normal; display: block;">
        ${x?.customerName.replace(/ - /, "<br>")}
      </span>
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
  const pro = element.getAttribute("data-pro");
  const inValue = element.getAttribute("data-in");
  const slid = element.getAttribute("data-slid");

  const isSmallScreen = window.matchMedia(
    "screen and (max-width: 375px)"
  ).matches;

  if (isSmallScreen) {
    element.removeAttribute("onclick");
  } else {
    const url = `./property_details.html?pro=${pro}&in=${inValue}&slid=${slid}`;
    window.open(url, "_blank");
  }
}
