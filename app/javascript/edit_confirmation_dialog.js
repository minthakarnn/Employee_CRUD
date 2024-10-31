window.addEventListener('turbo:load', () => {
  document.addEventListener('submit', (event) => {
    if (event.target && event.target.classList.contains('edit_alert')) {
      event.preventDefault();
      Swal.fire({
          title: 'Are you sure?',
          text: "You want to update this!!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, update it!'
      })
      .then((result) => {
        if (result.isConfirmed) {
          event.target.submit(); // ใช้ event.target แทน
        }
      });
    }
  });
});