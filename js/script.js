window.addEventListener("DOMContentLoaded", () => {

    // Tabs
    const tabs = document.querySelectorAll(".tabheader__item")
    const tabParents = document.querySelector(".tabheader__items")
    const tabContents = document.querySelectorAll(".tab_content")

    function hideTabContents() {
      tabContents.forEach(tabContent => {
        tabContent.style.display = "none"
      })

      tabs.forEach(tab => {
        tab.classList.remove("tabheader__item_active")
      })
    }

    function showTabContent(index = 0)  { //default index        index = 0
      tabContents[index].style.display = "flex"
      tabs[index].classList.add("tabheader__item_active")
    }

    hideTabContents()
    showTabContent(0)

    tabParents.addEventListener("click", event => {
      const target = event.target

      if (target && target.classList.contains("tabheader__item")) {
        tabs.forEach((tab, index) => {
          if (target === tab) {
            hideTabContents()
            showTabContent(index)
          }
        })
      }
    })

    // Loader
    const loaderWrapper = document.querySelector(".loader__wrapper")

    setTimeout(() => {
      loaderWrapper.style.display = "none"
    }, 1500)


    // Timer
    const deadline = "2024-06-01"

    function getTimeRemaining(endtime) {
      let days, hours, minutes, seconds
      let time = Date.parse(endtime) - Date.parse(new Date())

      if (time <= 0) {
        days = 0,
        hours = 0,
        minutes = 0,
        seconds = 0
      } else {
        days = Math.floor(time / (1000 * 60 * 60 * 24))
        hours = Math.floor((time / (1000 * 60 * 60)) % 24)
        minutes = Math.floor(time / (1000 * 60) % 60)
        seconds = Math.floor((time / 1000) % 60)
      }

      return {
        totalTime: time,
        days,
        hours,
        minutes,
        seconds,
      }
    }

    function formatNumber(number) {
      if (number >= 0 && number < 10) {
        return `0${number}`
      } else {
        return number
      }
    }


    function setClock(selector, endtime) {
      const timer = document.querySelector(selector)
      const days = timer.querySelector("#days")
      const hours = timer.querySelector("#hours")
      const minutes = timer.querySelector("#minutes")
      const seconds = timer.querySelector("#seconds")
      const timeInterval = setInterval(updateClock, 1000)

      updateClock()
      function updateClock() {
        const time = getTimeRemaining(endtime)

        days.innerHTML = formatNumber(time.days)
        hours.innerHTML = formatNumber(time.hours)
        minutes.innerHTML = formatNumber(time.minutes)
        seconds.innerHTML = formatNumber(time.seconds)


        if (time.totalTime <= 0) {
          clearInterval(timeInterval)
        }
      }
    }

    setClock(".timer", deadline)

    // Modal
    const modalOpenBtn = document.querySelectorAll("[data-modal]")
    const modal = document.querySelector(".modal")
    const modalContent = document.querySelector(".modal__content")

    function openModal() {
      modalContent.classList.add("modal-fade")
      modal.classList.add("show")
      modal.classList.remove("hide")
      document.body.style.overflow = "hidden"
      clearInterval(modalTimerId)
    }

    function closeModal() {
      modal.classList.add("hide")
      modal.classList.remove("show")
      document.body.style.overflow = ""
    }

    modalOpenBtn.forEach(item => {
      item.addEventListener("click", openModal)
    })

    modal.addEventListener("click", (evt) => {
      if (evt.target === modal || event.target.getAttribute("data-modal-close") === "") {
        closeModal()
      }
    })

    document.addEventListener("keydown", event => {
      if (event.code === "Escape" && modal.classList.contains("show")) {
        closeModal()
      }
    })

    const modalTimerId = setTimeout(openModal, 50000)

    // Class

    class OfferMenu {
      constructor(src, alt, title, descr, discount, sale, parentSelector) {
        this.src = src
        this.alt = alt
        this.title = title
        this.descr = descr
        this.discount = discount
        this.sale = sale
        this.parent = document.querySelector(parentSelector)
        this.formatToUSD()
      }

      formatToUSD() {
        this.discount = this.discount.toLocaleString("en-US", {style:"currency", currency:"USD"})
        this.sale = this.sale.toLocaleString("en-US", {style:"currency", currency:"USD"})
      }

      render() {
        const element = document.createElement("div")
        element.innerHTML = `
        <img src="${this.src}" alt="${this.alt}">
        <div>
        <h3>${this.title}</h3>
        <p>${this.descr}</p>
        <p><del>${this.discount}</del> <span class="primary-text">${this.sale}</span></p>
        </div>`

        this.parent.append(element)
      }
    }

    fetch("http://localhost:3000/offers", {
      method: "GET",
      headers: {"Content-Type": "application/json"}
    }).then(response => response.json())
      .then(data => {
        data.forEach(offer => {
          const {src, alt, title, descr, discount, sale} = offer
          new OfferMenu(src, alt, title, descr, discount, sale, "#offers .offers-items").render()
        })
      })


    const dayTimeItems = [
      {
        src: "./img/breckfastIcon.png",
        alt: "Breakfast",
        title: "Breakfast",
        descr: "8:00 am to 10:00 am"
      },
      {
        src: "./img/lunchIcon.png",
        alt: "Lunch",
        title: "Lunch",
        descr: "4:00 pm to 7:00 pm"
      },
      {
        src: "./img/dinnerIcon.png",
        alt: "Dinner",
        title: "Dinner",
        descr: "9:00 pm to 1:00 Am"
      },
      {
        src: "./img/dessertIcon.png",
        alt: "Desert",
        title: "Desert",
        descr: "All time"
      },
    ]

    dayTimeItems.forEach(dayTimeItem => {
      const {src, alt, title, descr,} = dayTimeItem
      new OfferMenu(src, alt, title, descr, "", "", ".daytime-items").render()
    })


    // FORM
    const form = document.querySelector("form")
    const telegramTokenBot = "6913787807:AAFBNLiHn-ysNkKEh-bCjIiWCwBDIiqdVLY"
    const chatId = "6726160029"
    const message = {
      loading: "Loading...",
      success: "Thanks for contacting with us",
      failure: "Something went wrong"
    }

    form.addEventListener("submit", event => {
      event.preventDefault()

      const loader = document.createElement("div")
      loader.classList.add("loader")
      form.append(loader)

      const formData = new FormData(form)

      const object = {}
      formData.forEach((value, key) => {
        object[key] = value
      })


      fetch(`https://api.telegram.org/bot${telegramTokenBot}/sendMessage`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          chat_id: chatId,
          text: `name: ${object.name}, Phone: ${object.phone}`
        }),
      })
      .then(() => {showStatusMessage(message.success), form.reset()})
      .catch(() => {showStatusMessage(message.failure)})
      .finally(() => loader.remove())
    })

    function showStatusMessage(message) {
      const modalDialog = document.querySelector(".modal__dialog")

      modalDialog.classList.add("hide")
      openModal()

      const statusModal = document.createElement("div")
      statusModal.classList.add("modal__dialog")
      statusModal.innerHTML = `
      <div class="modal__content">
        <div data-modal-close class="modal__close">&times;</div>
        <div data-modal-close class="modal__close">&times;</div>
          <div class="modal__title">${message}</div>
      </div>`

      document.querySelector(".modal").append(statusModal)

      setTimeout(() => {
        statusModal.remove()
        modalDialog.classList.remove("hide")
        closeModal()
      }, 4000)
    }
})
