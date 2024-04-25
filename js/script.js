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
    time = Date.parse(endtime) - Date.parse(new Date())

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
  const modalCloseBtn = document.querySelector("[data-modal-close]")
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

  modalCloseBtn.addEventListener("click", closeModal)

  modal.addEventListener("click", (evt) => {
    if (evt.target === modal) {
      closeModal()
    }
  })

  document.addEventListener("keydown", event => {
    if (event.code === "Escape" && modal.classList.contains("show")) {
      closeModal()
    }
  })

  const modalTimerId = setTimeout(openModal, 5000)

})
