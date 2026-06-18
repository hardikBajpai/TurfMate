(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

const dateInput = document.getElementById("preferDate");

const today = new Date();

dateInput.value = today.toISOString().split("T")[0];


dateInput.min = today.toISOString().split("T")[0];
const maxDate = new Date();
maxDate.setMonth(maxDate.getMonth() + 2);

dateInput.max = maxDate.toISOString().split("T")[0];




