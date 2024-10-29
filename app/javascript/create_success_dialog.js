window.addEventListener(('turbo:load'), () => {
  document.addEventListener('submit', (event) => {
    if (event.target && event.target.className === 'create_success') {
      event.preventDefault()
      Swal.fire({
          title: "Good job!",
          text: "You clicked the button!",
          icon: "success"
      })
        .then((result) => {
          if (result.isConfirmed) {
            document.querySelector('.create_success').submit()
          }
        })
        .catch(event.preventDefault())
    }
  })
})