let playMusic;

(function musicHandler() {
    const audio = new Audio('./assets/song.mp3');
    const playButton = document.getElementById("playButton");
    const pauseButton = document.getElementById("pauseButton");
    let loopCount = 0;
    playMusic = async function () {
        try {
            await audio.play();
        } catch {
            setTimeout(playMusic, 1000);
        }
    };
    audio.onended = function () {
        console.log("ended");
        if (loopCount < 2) {
            loopCount++;
            audio.play();
        }
    };
    audio.onplay = function () {
        playButton.style.display = "none";
        pauseButton.style.display = "";
    };
    audio.onpause = function () {
        playButton.style.display = "";
        pauseButton.style.display = "none";
    };
    playButton.onclick = function (e) {
        e.preventDefault();
        loopCount = 0;
        audio.play();
        return false;
    };
    pauseButton.onclick = function (e) {
        e.preventDefault();
        audio.pause();
        return false;
    };
})();

(function pageLoadHandler() {
    function intersectionListener(entries) {
        for (const entry of entries) {
            if (entry.intersectionRatio >= 0.1 && !entry.target.classList.contains("animate-in")) {
                entry.target.classList.add("animate-in");
            }
            continue;
            if (entry.intersectionRatio == 0 || entry.target.classList.contains("animate-in")) {
                //entry.target.classList.remove("animate-in");
                continue;
            }
            let intersectionThresholdRatio = 0.5;
            const percentageOfScreen = entry.target.clientHeight / window.innerHeight;
            if (percentageOfScreen > 1) {
                intersectionThresholdRatio = 0.1;
            } else if (percentageOfScreen > 0.9) {
                intersectionThresholdRatio = 0.25;
            } else if (percentageOfScreen > 0.8) {
                intersectionThresholdRatio = 0.3;
            } else if (percentageOfScreen > 0.7) {
                intersectionThresholdRatio = 0.35;
            } else if (percentageOfScreen > 0.6) {
                intersectionThresholdRatio = 0.4;
            }
            if (entry.intersectionRatio >= intersectionThresholdRatio) {
                entry.target.classList.add("animate-in");
            }
        }
    }

    function initializeOnPageLoad() {
        document.body.classList.add("loaded");
        playMusic();
        const intersectionObserver = new IntersectionObserver(intersectionListener, {
            threshold: [0.2], //[0, 0.1, 0.25, 0.3, 0.35, 0.4, 0.5]
        });

        const elements = document.querySelectorAll(".animate");
        elements.forEach(element => intersectionObserver.observe(element));
    }

    const image = document.createElement("img");
    image.onload = initializeOnPageLoad;
    image.src = "./assets/top-image.png";
})();

(function accordionHandler() {
    const accordionContainer = document.getElementById("accordionContainer");
    const accordionToggle = document.getElementById("accordionToggle");
    accordionToggle.onclick = function () {
        if (accordionContainer.classList.contains("toggle_show")) {
            accordionContainer.classList.remove("toggle_show");
        } else {
            accordionContainer.classList.add("toggle_show");
        }
    };
})();

(function countdownHandler() {
    const countdownDate = new Date(2022, 6, 16, 19, 15, 0).getTime();
    const countdownDays = document.getElementById("countdownDays");
    const countdownHours = document.getElementById("countdownHours");
    const countdownMinutes = document.getElementById("countdownMinutes");
    const countdownSeconds = document.getElementById("countdownSeconds");
    setInterval(function () {
        let difference = Math.max(0, countdownDate - new Date().getTime()) / 1000;
        const days = Math.floor(difference / 60 / 60 / 24);
        difference -= days * 24 * 60 * 60;
        const hours = Math.floor(difference / 60 / 60);
        difference -= hours * 60 * 60;
        const minutes = Math.floor(difference / 60);
        difference -= minutes * 60;
        const seconds = Math.floor(difference);
        countdownDays.innerText = days;
        countdownHours.innerText = hours;
        countdownMinutes.innerText = minutes;
        countdownSeconds.innerText = seconds;
    }, 1000);
})();

(function rsvpFormHandler() {
    const webAppUrl = "https://script.google.com/macros/s/AKfycbyW5kyTSKoE9yxiSaLxxG_KXha5of-DiSB1ABkI1lYECAB_OTz_yLT_TWzkDchDEYDc/exec";
    const rsvpForm = document.getElementById("rsvp_form");
    const submitButton = rsvpForm.querySelector("button");
    const rsvpFormErrors = document.getElementById("rsvp_form_errors");
    rsvpForm.Attending.onchange = function () {
        if (rsvpForm.Attending.value == "Yes") {
            rsvpForm.querySelector("#paxContainer").style.display = "";
        } else {
            rsvpForm.querySelector("#paxContainer").style.display = "none";
        }
    };
    rsvpForm.onsubmit = function (e) {
        e.preventDefault();
        var errorFields = [];

        if (!rsvpForm.Name.value) {
            errorFields.push("Nama Tetamu");
        }

        if (!rsvpForm.Phone.value) {
            errorFields.push("Nombor Telefon");
        }

        if (!rsvpForm.Attending.value) {
            errorFields.push("Sila sahkan kehadiran anda..");
        }

        if (rsvpForm.Attending.value == "Yes" && !rsvpForm.Pax.value) {
            errorFields.push("Bilangan orang yang akan hadir..");
        }

        if (!errorFields.length) {
            rsvpFormErrors.innerHTML = "";
            submitForm();
        } else {
            rsvpFormErrors.innerHTML = `<p>Sila isikan perkara berikut:</p><ul>${errorFields.map(e => `<li>${e}</li>`).join("")}</ul>`;
        }

        return false;
    };

    const submitForm = async function () {
        submitButton.disabled = true;
        try {
            const response = await fetch(webAppUrl, {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'omit',
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
                body: new URLSearchParams(new FormData(rsvpForm))
            });
            var responseBody = await response.json();
            console.log(response, responseBody);
            if (responseBody.success) {
                console.log("success");
                document.getElementById("formSuccessMessage").style.display = "";
                rsvpForm.style.display = "none";
            } else {
                throw new Error(responseBody.error);
            }
        } catch (e) {
            alert("Oops! You have encountered a network error. Please retry again over a stable internet connection.");
            console.log("error", e);
        }
        submitButton.disabled = false;
    };
})();
