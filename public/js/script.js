(() => {
    'use strict'
    const forms = document.querySelectorAll('.needs-validation')
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }
            form.classList.add('was-validated')
        }, false)
    })
})();
// range
const rangeInput = document.getElementById('rating');
const rangeOutput = document.getElementById('rangeValue');
rangeOutput.textContent = rangeInput.value;
rangeInput.addEventListener('input', function () {
    rangeOutput.textContent = this.value;
});