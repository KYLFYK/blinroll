const nextButton = document.querySelector('#nextArr');
const prevButton = document.querySelector('#prevArr');

let glide = new Glide('.glide', {
    type: 'carousel',
    focusAt: 'center',
    perView: 1,
    keyboard: true
})

nextButton.addEventListener('click', function (event) {
    event.preventDefault();

    glide.go('>');
})

prevButton.addEventListener('click', function (event) {
    event.preventDefault();

    glide.go('<');
})

glide.mount()